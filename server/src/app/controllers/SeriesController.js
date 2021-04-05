import axios from 'axios';
import api from '../../config/api';
import tmdb from '../../config/tmdb';
import formatTMDBdate from '../../utils/formatTMDBdate';
import formatBrazilianDate from '../../utils/formatBrazilianDate';

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

// var checkMarkedEpisode = async function(userId, episode_id, series_id){

//   // Consulta interna pra trazer informações
//   // do registro de visualização do episódio
//   const episode = await View.findOne({
//     where: {
//       episode_id: episode_id,
//       user_id: userId,
//       series_id: series_id,
//     }
//   });

//   if(episode){
//     return true;
//   } else {
//     return false
//   }
// }

class SeriesController{

  async index(req, res){

    const {exuserId, id} = req.params;
    var userId = -1
    if(req.cookies['userId'] != undefined)
      var userId = req.cookies['userId']
    let seasons = [];
    let seasonsScores = []
    let seasonsIMDBScores = []

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
                  let avgscore = 0.0
                  let avgscorenumber = 0
                  let seasonScore = 0
                  let tmdbscore = 0
                  let tmdbscorenumber = 0

                  const episodesTMDB = response.data.episodes;
                  const episodes = [];

                  let itemsProcessed = 0
                  episodesTMDB.forEach(async (episodeTMDB) => {

                    const viewResponse = await axios.get(
                      `${api.baseUrl}/table=View/operation=findOne/values=episode_id=${episodeTMDB.id}&user_id=${userId}`
                    );

                    let watched = viewResponse.data;

                    // const watched = await View.findOne({
                    //   where: {
                    //     episode_id: episodeTMDB.id,
                    //     user_id: userId,
                    //   }
                    // });

                    if(watched){
                      if(watched.rating >= 0){
                        episodeTMDB.myrating = watched.rating
                        avgscore += episodeTMDB.myrating
                        avgscorenumber += 1
                        episodeTMDB.myrating = episodeTMDB.myrating.toFixed(0)
                      } else{
                        episodeTMDB.myrating = "-"
                      }
                    } else{
                      episodeTMDB.myrating = "-"
                    }
                    
                    if(episodeTMDB){
                      if(!isNaN(episodeTMDB.vote_average) && !Number.isNaN(parseFloat(episodeTMDB.vote_average)) && 
                      parseFloat(episodeTMDB.vote_average) > 0.0){
                        tmdbscore += parseFloat(episodeTMDB.vote_average)
                        tmdbscorenumber += 1
                        // console.log(parseFloat(episodeTMDB.vote_average))
                      } else {
                        // console.log(-1)
                      }
                    }
                    
                    let tmdbscoremean = 0
                    episodes.push({...episodeTMDB, watched: watched ? true : false});
                    // console.log('EP adicionado: ', episodeTMDB.episode_number);
                    itemsProcessed += 1
                    if(itemsProcessed == episodesTMDB.length){
                      if(avgscorenumber > 0){
                        seasonScore = (avgscore/avgscorenumber).toFixed(2)
                      } else{
                        seasonScore = "-"
                      }
                      if(tmdbscorenumber > 0){
                        tmdbscoremean = (tmdbscore/tmdbscorenumber).toFixed(2)
                      } else{
                        tmdbscoremean = "-"
                      }

                      seasonsScores.push(seasonScore)
                      seasonsIMDBScores.push(tmdbscoremean)
                    }
                  });
                  seasons.push({
                    id: response.data.id,
                    poster: response.data.poster_path,
                    season_number: response.data.season_number,
                    episodes: episodes.sort(),
                    vote_average: "-",
                    seasonScore: "-"
                  });
                })
            }
          );

        } 

      }

      // Consulta interna pra trazer informações
      // do registro de visualização do episódio
      const seriesAddedResponse = await axios.get(
        `${api.baseUrl}/table=Series/operation=findOne/values=series_id=${seriesId}&user_id=${userId}`
      );

      let serieentry = seriesAddedResponse.data;

      // const serieentry = await Series.findOne({
      //   where: {
      //     series_id: seriesId,
      //     user_id: userId
      //   }
      // });

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
        seasons[i].seasonScore = seasonsScores[i]
        seasons[i].imdbSeasonScore = seasonsIMDBScores[i]
        let season = seasons[i]
        let totaleps = season.episodes.length
          let watchedeps = 0.0
          for(let j = 0; j < season.episodes.length; j++){  
            let episode = season.episodes[j]
            episode.air_date = formatBrazilianDate(episode.air_date)

            const episodeQueryResponse = await axios.get(
              `${api.baseUrl}/table=View/operation=findOne/values=episode_id=${episode.id}&user_id=${userId}&series_id=${seriesId}`
            );

            let episodequery = episodeQueryResponse.data;

            // const episodequery = await View.findOne({
            //   where: {
            //     episode_id: episode.id,
            //     user_id: userId,
            //     series_id: seriesId,
            //   }
            // });
          
            if(episodequery){
              watchedeps += 1.0
              if(episodequery.rating >= 0){
                scoresum += episodequery.rating
                numberwithscore += 1
              }
            } 
          }
          const progr = (watchedeps/season.episodes.length)*100
          if(Math.trunc(progr) < 100){
            isuserfinished = false
          }
          season.progress = (progr).toFixed(1) + "%"
          

      }

      let myrate = ""
      let updatevalue = -1
      if(numberwithscore > 0){
        myrate = (scoresum/numberwithscore).toFixed(0)
        updatevalue = (scoresum/numberwithscore)
      } else{
        myrate = "-.--"
      }
      //==================== UpdateAverageRate ========================
      // Criando o registro no banco de que o usuário o episódio

      const watch = await axios.put(
        `${api.baseUrl}/table=Series/values=user_id=${userId}&series_id=${seriesResponse.data.id}`, {
          average_rating: updatevalue
        }
      )
      
      // const watch = await Series.update({average_rating: updatevalue}, {
      //   where: {user_id: userId,
      //     series_id: seriesResponse.data.id}
      // })


      //==================== GetAllUserOverAllRate ========================
      // Criando o registro no banco de que o usuário o episódio
      
      const allSeriesResponse = await axios.get(
        `${api.baseUrl}/table=Series/operation=findAll/values=null`
      );

      // let allvotes = Series.findAll();
      let allvotes = allSeriesResponse.data;

      let numberofvotes = 0
      let sumofvotes = 0
      
      for(let i = 0; i < allvotes.length; i++){
        if(parseFloat(allvotes[i].average_rating) >= 0){
          numberofvotes += 1
          sumofvotes += parseFloat(allvotes[i].average_rating)
        }
      }
      let databasegeralscore = "-.--"
      if(numberofvotes > 0){
        databasegeralscore =  (sumofvotes/numberofvotes).toFixed(2);
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
        vote_average: seriesResponse.data.vote_average.toFixed(2),
        databascore: databasegeralscore,
        userrating: myrate
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
    const addSeriesResponse = await axios.post(
      `${api.baseUrl}/table=Series`, {
        user_id: userId, 
        list_id: list_idtos,
        series_id: seriesId,
        average_rating: average_rating,
      }
    );

    // Retornando o registro cadastrado
    return res.json(addSeriesResponse.data);

  }catch(error){
    console.log('SeriesController.view error: ', error);
  }
  
}

// Remover serie:
async removes(req, res) {
    
  // Recebendo parâmetros trazidos da rota
  const seriesId = req.body.seriesId
  const average_rating = req.body.average_rating
  const userId = req.body.userId

  try {
      
    const removeSeriesResponse = await axios.delete(
      `${api.baseUrl}/table=Series/values=user_id=${userId}&series_id=${seriesId}`
    );

    if(removeSeriesResponse) {
      res.json({message: 'Série removida com sucesso'});
    }

  } catch(error) {
    console.log('SeriesController.removes error: ', error);
  }
  
}


}

export default new SeriesController();
