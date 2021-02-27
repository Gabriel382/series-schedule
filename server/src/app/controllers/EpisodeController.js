import axios from 'axios';
import tmdb from '../../config/tmdb';
import View from '../models/View';
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
        const episode = await View.findOne({
          where: {
            episode_id: episodeId,
            user_id: userId,
          }
        });

        // Mudando a variável viewed caso a consulta retorne algo
        // ou seja, caso o usuário tenha visto o episódio
        if(episode){
          watched = true;
          watchDate = episode.createdAt;
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
        }
        
        // Retornando os dados a serem carregados na página EJS
        res.render('episode-page', data);

      }

    }catch(error){
      console.log('getEpisode error: ', error);
    }

  }

  // Marcar episódio como visto:
  async view(req, res) {
    
    // Recebendo parâmetros trazidos da rota
    const {episodeId, seriesId, rating, userId} = req.body;

    try {
      // Criando o registro no banco de que o usuário o episódio
      const watch = await View.create({
        user_id: userId, 
        episode_id: episodeId,
        series_id: seriesId,
        rating: rating,
      });

      // console.log('VIEW: ', view);

      // Retornando o registro cadastrado
      return res.json(watch);

    }catch(error){
      console.log('watchEpisode error: ', error);
    }
  }

}

export default new EpisodeController();