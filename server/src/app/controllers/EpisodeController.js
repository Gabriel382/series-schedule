import axios from 'axios';
import api from '../../config/api';
import tmdb from '../../config/tmdb';
import UpdateSeriesList from '../../public/js/serieprogress/updateserieslist.js'
import formatSQLdate from '../../utils/formatSQLdate';
import formatTMDBdate from '../../utils/formatTMDBdate';
import formatBrazilianFormatDate from '../../utils/formatTMDBdate';
class EpisodeController{

  // ROTA: /series/:seriesId/season/:seasonNumber/episode/:episodeNumber
  // Função para retornas as informações de um episódio
  async index(req, res) {
    
    // Recebendo parâmetros
    const {exuserId, seriesId, seasonNumber, episodeNumber} = req.params;
    var userId = -1
    if(req.cookies['userId'] != undefined)
      var userId = req.cookies['userId']

    try {

      // Trazendo informações da série do TMDB
      const seriesResponse = await axios.get(
        `${tmdb.baseUrl}/tv/${seriesId}?api_key=${tmdb.apiKey}&language=pt-BR`
      );
      
      // Trazendo informações do episódio do TMDB
      const episodeResponse = await axios.get(
        `${tmdb.baseUrl}/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${tmdb.apiKey}&language=pt-BR`
      );

      if(seriesResponse && episodeResponse) {

        var watched = false; // se já viu ou não o episódio
        var watchDate = ''; // data de visualização do episódio

        var episodeId = episodeResponse.data.id; // id do episódio no TMDB

        // Consulta interna pra trazer informações
        // do registro de visualização do episódio
        const getOneResponse = await axios.get(
          `${api.baseUrl}/table=View/operation=findOne/values=episode_id=${episodeId}&user_id=${userId}`
        );

        var episode = getOneResponse.data;

        // Mudando a variável viewed caso a consulta retorne algo
        // ou seja, caso o usuário tenha visto o episódio
        let rating = -1
        if(episode){
          watched = true;
          watchDate = episode.createdAt;
          rating = episode.rating
        }

        //==================== GetAllEpisodeScores ========================
        const getAllResponse = await axios.get(
          `${api.baseUrl}/table=View/operation=findAll/values=episode_id=${episodeResponse.data.id}`
        );
        
        let allvotes = getAllResponse.data
        let numberofvotes = 0
        let sumofvotes = 0
        
        for(let i = 0; i < allvotes.length; i++){
          if(parseFloat(allvotes[i].rating) >= 0){
            numberofvotes += 1
            sumofvotes += parseFloat(allvotes[i].rating)
          }
        }
        let databasegeralscore = "-.--"
        if(numberofvotes > 0){
          databasegeralscore =  (sumofvotes/numberofvotes).toFixed(2);
        }

        // Dados enviados para o front
        const data = {
          userId: userId,
          name: episodeResponse.data.name,
          watched: watched,
          watchDate: formatSQLdate(watchDate),
          episodeId: episodeResponse.data.id,
          episodeNumber: episodeResponse.data.episode_number,
          seasonNumber: episodeResponse.data.season_number,
          sinopsis: episodeResponse.data.overview,
          airDate: formatTMDBdate(episodeResponse.data.air_date),
          banner: `${tmdb.imagesPath}` + episodeResponse.data.still_path,
          seriesId: seriesResponse.data.id,
          seriesTitle: seriesResponse.data.name,
          seriesPoster: `${tmdb.imagesPath}` + seriesResponse.data.poster_path,
          vote_average: episodeResponse.data.vote_average.toFixed(2),
          databasegeralscore: databasegeralscore,
          userscore : rating.toFixed(0)
        }
        
        // Retornando os dados a serem carregados na página EJS
        res.render('episode-page', data);

      }

    }catch(error){
      console.log('EpisodeController.index error: ', error);
    }

  }

  // Marcar episódio como visto:
  async view(req, res) {
    
    // Recebendo parâmetros trazidos da rota
    const {episodeId, seriesId, rating, userId} = req.body;

    try {
      // Criando o registro no banco de que o usuário o episódio
      const watchResponse = await axios.post(
        `${api.baseUrl}/table=View`, {
          user_id: userId, 
          episode_id: episodeId,
          series_id: seriesId,
          rating: rating,
        }
      );
      
      let watch = watchResponse.data;

      UpdateSeriesList(seriesId,userId)

      // Retornando o registro cadastrado
      return res.json(watch);

    }catch(error){
      console.log('EpisodeController.view error: ', error);
    }
  }

  // Dar nota a episódio visto:
  async episodescore(req, res) {
    
    // Recebendo parâmetros trazidos da rota
    const {episodeId, seriesId, rating, userId} = req.body;

    let userrating = rating
    if(userrating < 0){
      userrating = 0.0
    } else if(userrating > 10){
      userrating = 10.0
    }

    try {
      // Criando o registro no banco de que o usuário o episódio
      const episodeScoreResponse = await axios.put(
        `${api.baseUrl}/table=View/values=user_id=${userId}&episode_id=${episodeId}&series_id=${seriesId}`, {
          rating: userrating,
        }
      );

      let watch = episodeScoreResponse.data;

      // Retornando o registro cadastrado
      return res.json(watch);

    }catch(error){
      console.log('EpisodeController.episodescore error: ', error);
    }
  }

}

export default new EpisodeController();