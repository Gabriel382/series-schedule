import axios from 'axios';
import tmdb from '../../config/tmdb';

class SeriesController{

  async index(req, res){

    const id = req.params.id;

    try {
      const seriesResponse = await axios.get(
        `${tmdb.baseUrl}/tv/${id}?api_key=${tmdb.apiKey}&language=pt-BR`
      );

      if(seriesResponse){

        var seriesId = seriesResponse.data.id; 
        var seasonsData = seriesResponse.data.seasons;

        var seasons = [];

        if(seasonsData){
          const promise = seasonsData.map(async season => {

            const getEpisodesUrl = `${tmdb.baseUrl}/tv/${seriesId}/season/${season.season_number}?api_key=${tmdb.apiKey}&language=pt-BR`;
            
            return axios.get(getEpisodesUrl);

            // console.log('EPISÓDIOS: ', episodesResponse.data.episodes);

            seasons.push({
              episode_count: season.episode_count,
              id: season.id,
              poster: season.poster_path,
              season_number: season.season_number,
              episodes: episodesResponse.data.episodes,
            });
          })

          Promise.all(promise).then(
            results => console.log(results.data)
          );

        } 

      }

      const data = {
        title: seriesResponse.data.name,
        seasons: seasons,
        banner: `${tmdb.imagesPath}` + seriesResponse.data.backdrop_path,
        poster: `${tmdb.imagesPath}` + seriesResponse.data.poster_path,
        sinopsis: seriesResponse.data.overview,
        genres: seriesResponse.data.genres,
        networks: seriesResponse.data.networks,
        episode_run_time: seriesResponse.data.episode_run_time,
      }
  
      console.log('DATA FINAL:', data);
  
      res.render('tv-series-page', data);

    } catch(error) {
      console.log('getSeries error: ', error);
    }
    
  }

}

export default new SeriesController();
