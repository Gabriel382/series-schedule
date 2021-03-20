import axios from 'axios';
import tmdb from '../../config/tmdb';
import formatTMDBdate from '../../utils/formatTMDBdate';
import formatBrazilianDate from '../../utils/formatBrazilianDate';
import View from '../models/View';
import Series from '../models/Series';
import List from '../models/List';

var todaysdate = function dataAtualFormatada(){
  let data = new Date(),
      dia  = data.getDate().toString(),
      diaF = (dia.length == 1) ? '0'+dia : dia,
      mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
      mesF = (mes.length == 1) ? '0'+mes : mes,
      anoF = data.getFullYear();
  //return anoF+"-"+mesF+"-"+diaF;
  return "2021-02-27 00:00:00-03"
}

var checkMarkedEpisode = async function(userId, episode_id, series_id){

  // Consulta interna pra trazer informações
  // do registro de visualização do episódio
  const episode = await View.findOne({
    where: {
      episode_id: episode_id,
      user_id: userId,
      series_id: series_id,
    }
  });

  if(episode){
    return true;
  } else {
    return false
  }
}

class SeriesController{

  async index(req, res){

    const {exuserId, id} = req.params;
    var userId = -1
    if(req.cookies['userId'] != undefined)
      var userId = req.cookies['userId']
    let seasons = [];

    var serieadded = false;

    try {
      const seriesResponse = await axios.get(
        `${tmdb.baseUrl}/tv/${id}?api_key=${tmdb.apiKey}&language=pt-BR`
      );

      if(seriesResponse){

        var seriesId = seriesResponse.data.id; 
        var seasonsData = seriesResponse.data.seasons;

        if(seasonsData){
          const promises = seasonsData.map(season => {

            const getEpisodesUrl = `${tmdb.baseUrl}/tv/${seriesId}/season/${season.season_number}?api_key=${tmdb.apiKey}&language=pt-BR`;
            
            return axios.get(getEpisodesUrl);

            // console.log('EPISÓDIOS: ', episodesResponse.data.episodes);
          })

          await Promise.all(promises).then(
            responses => {
              // console.log('Response: ', response);

                responses.forEach((response) => {
                  // console.log(response.data);

                  const episodesTMDB = response.data.episodes;
                  const episodes = [];

                  episodesTMDB.forEach(async (episodeTMDB) => {
                    const watched = await View.findOne({
                      where: {
                        episode_id: episodeTMDB.id,
                        user_id: userId,
                      }
                    });

                    episodes.push({...episodeTMDB, watched: watched ? true : false});
                    console.log('EP adicionado: ', episodeTMDB.episode_number);
                  });

                  seasons.push({
                    id: response.data.id,
                    poster: response.data.poster_path,
                    season_number: response.data.season_number,
                    episodes: episodes.sort(),
                  });
                })
            }
          );

        } 

      }

      // Consulta interna pra trazer informações
      // do registro de visualização do episódio
      const serieentry = await Series.findOne({
        where: {
          series_id: seriesId,
          user_id: userId
        }
      });
      // Mudando a variável de serie adicionada para personalizar a pagina
      if(serieentry){
        serieadded = true;
      }

      
      var numberOfEpisodes = seriesResponse.data.number_of_episodes;
      var episodeRunTime = seriesResponse.data.episode_run_time[0];
      var time = numberOfEpisodes * episodeRunTime;
      
      var days = Math.floor(time/24/60);
      var hours = Math.floor(time/60%24);
      var minutes = Math.floor(time%60);

      var bingeSize = 
        (days ? days + "d " : '') 
        + (hours ? hours + "h " : '') 
        + (minutes ? minutes + "min" : '') 


      // For each season, each episode
      let isuserfinished = true
      let scoresum = 0
      let numberwithscore = 0
      for(let i = 0; i < seasons.length; i++){
        let season = seasons[i]
        let totaleps = season.episodes.length
          let watchedeps = 0.0
          for(let j = 0; j < season.episodes.length; j++){  
            let episode = season.episodes[j]
            episode.air_date = formatBrazilianDate(episode.air_date)
            const episodequery = await View.findOne({
              where: {
                episode_id: episode.id,
                user_id: userId,
                series_id: seriesId,
              }
            });
          
            if(episodequery){
              watchedeps += 1.0
              if(episodequery.rating >= 0){
                scoresum += episodequery.rating
                numberwithscore += 1
              }
            } 
          }
          const progr = (watchedeps/totaleps)*100
          if(Math.trunc(progr) < 100){
            isuserfinished = false
          }
          season.progress = (progr).toFixed(1) + "%"
          

      }

      const data = {
        id: seriesResponse.data.id,
        title: seriesResponse.data.name,
        seasons: seasons,
        banner: `${tmdb.imagesPath}` + seriesResponse.data.backdrop_path,
        poster: `${tmdb.imagesPath}` + seriesResponse.data.poster_path,
        sinopsis: seriesResponse.data.overview,
        genres: seriesResponse.data.genres,
        networks: seriesResponse.data.networks,
        episode_run_time: seriesResponse.data.episode_run_time,
        first_air_date: formatTMDBdate(seriesResponse.data.first_air_date),
        in_production: seriesResponse.data.in_production,
        last_air_date: formatTMDBdate(seriesResponse.data.last_air_date),
        userId: userId,
        bingeSize: bingeSize,
        seriesId: seriesId,
        serieadded: serieadded,
        userfinished: isuserfinished,
        ongoing: seriesResponse.data.in_production,
        userrating: (scoresum/numberwithscore).toFixed(2)
      }
  
      res.render('tv-series-page', data);

    } catch(error) {
      console.log('getSeries error: ', error);
    }
    
  }

// Add serie
async view(req, res) {
    
  // Recebendo parâmetros trazidos da rota
  const seriesId = req.body.seriesId
  const average_rating = req.body.average_rating
  const userId = req.body.userId

  let list_idtos = 1
  if(req.body.userfinished == "true" && req.body.ongoing == "true"){
    list_idtos = 3
  }else if(req.body.userfinished == "true"){
    list_idtos = 2
  }

  try {

    // Criando o registro no banco de que o usuário o episódio
    const serie = await Series.create({
      user_id: userId, 
      list_id: list_idtos,
      series_id: seriesId,
      average_rating: average_rating,
    });

    // console.log('VIEW: ', view);

    // Retornando o registro cadastrado
    return res.json(serie);

  }catch(error){
    console.log('watchEpisode error: ', error);
  }
  
}

// Remover serie:
async removes(req, res) {
    
  // Recebendo parâmetros trazidos da rota
  const seriesId = req.body.seriesId
  const average_rating = req.body.average_rating
  const userId = req.body.userId

  try {
    // Criando o registro no banco de que o usuário o episódio
    const serie = await Series.destroy({
      where: {
        user_id: userId,
        series_id: seriesId,
      }
    });

    // console.log('VIEW: ', view);

    // Retornando o registro cadastrado
    return res.json(serie);

  }catch(error){
    console.log('watchEpisode error: ', error);
  }
  
}


}

export default new SeriesController();
