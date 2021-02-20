import axios from 'axios';
import tmdb from '../../config/tmdb';

class EpisodeController{

  async index(req, res) {
    const seriesId = req.params.seriesId;
    const seasonNumber = req.params.seasonNumber;
    const episodeNumber = req.params.episodeNumber;

    await axios.get(
      `${tmdb.baseUrl}/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${tmdb.apiKey}&language=pt-BR`
    ).then(function (response) {
      const data = {
        name: response.data.name,
        episode_number: response.data.episode_number,
        season_number: response.data.season_number,
        sinopsis: response.data.overview,
        air_date: response.data.air_date,
        banner: `${tmdb.imagesPath}` + response.data.still_path,
      }

      res.render('episode-page', data);
    })
    .catch(error => {
      console.log(error);
    });

  }

}

export default new EpisodeController();