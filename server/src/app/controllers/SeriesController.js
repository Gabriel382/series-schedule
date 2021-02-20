import axios from 'axios';
import tmdb from '../../config/tmdb';

class SeriesController{

  async index(req, res){

    const id = req.params.id;
    let seasons = [];

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
                  seasons.push({
                    // episode_count: response.data.episode_count,
                    id: response.data.id,
                    poster: response.data.poster_path,
                    season_number: response.data.season_number,
                    episodes: response.data.episodes,
                  });
                })
            }
          );

        } 

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
        first_air_date: seriesResponse.data.first_air_date,
        in_production: seriesResponse.data.in_production,
        last_air_date: seriesResponse.data.last_air_date,
      }
  
      // console.log('DATA FINAL:', data);
  
      res.render('tv-series-page', data);

    } catch(error) {
      console.log('getSeries error: ', error);
    }
    
  }

}

export default new SeriesController();
