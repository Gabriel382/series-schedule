import axios from 'axios';
import tmdb from '../../config/tmdb';
import View from '../models/View';
class EpisodeController{

  async index(req, res) {
    const seriesId = req.params.seriesId;
    const seasonNumber = req.params.seasonNumber;
    const episodeNumber = req.params.episodeNumber;

    try {
      const seriesResponse = await axios.get(
        `${tmdb.baseUrl}/tv/${seriesId}?api_key=${tmdb.apiKey}&language=pt-BR`
      );

      const episodeResponse = await axios.get(
        `${tmdb.baseUrl}/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${tmdb.apiKey}&language=pt-BR`
      );

      if(seriesResponse && episodeResponse) {

        const data = {
          name: episodeResponse.data.name,
          episode_number: episodeResponse.data.episode_number,
          season_number: episodeResponse.data.season_number,
          sinopsis: episodeResponse.data.overview,
          air_date: episodeResponse.data.air_date,
          banner: `${tmdb.imagesPath}` + episodeResponse.data.still_path,
          seriesId: seriesResponse.data.id,
          seriesTitle: seriesResponse.data.name,
          seriesPoster: `${tmdb.imagesPath}` + seriesResponse.data.poster_path,
        }

        console.log('DATA EP: ', data);
  
        res.render('episode-page', data);

      }

    }catch(error){
      console.log('getEpisode error: ', error);
    }

  }

  // Marcar episódio como visto:
  // async view(req, res) {

  //   const view = await View.create({
  //     user_id: 1, 
  //     episode_id: 1234,
  //     series_id: 12,
  //     rating: 8,
  //   });

  //   return res.json(view);
  // }

}

export default new EpisodeController();