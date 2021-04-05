import axios from 'axios';
import api from '../../../config/api';
import tmdb from '../../../config/tmdb';
// import View from '../../../app/models/View';
// import Series from '../../../app/models/Series';
// import List from '../../../app/models/List';

var UpdateSeriesList = async function UpdateSeriesList(seriesId, userId){
    
    var serieadded = false;
    let seasons = [];
    let isuserfinished = true
    // try
    try {
        const seriesResponse = await axios.get(
          `${tmdb.baseUrl}/tv/${seriesId}?api_key=${tmdb.apiKey}&language=pt-BR`
        );
        
        // If TMDB returned values
        if(seriesResponse){
            var seasonsData = seriesResponse.data.seasons;
    
            if(seasonsData){
              const promises = seasonsData.map(season => {
    
                const getEpisodesUrl = `${tmdb.baseUrl}/tv/${seriesId}/season/${season.season_number}?api_key=${tmdb.apiKey}&language=pt-BR`;
                
                return axios.get(getEpisodesUrl);
              })
    
              await Promise.all(promises).then(
                responses => {
                  // console.log('Response: ', response);
    
                    responses.forEach((response) => {
                      // console.log(response.data);
    
                      const episodesTMDB = response.data.episodes;
                      const episodes = [];
    
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
    
                        episodes.push({...episodeTMDB, watched: watched ? true : false});
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
      const seriesEntryResponse = await axios.get(
        `${api.baseUrl}/table=Series/operation=findOne/values=series_id=${seriesId}&user_id=${userId}`
      );
      let serieentry = seriesEntryResponse.data;

      // const serieentry = await Series.findOne({
      //   where: {
      //     series_id: seriesId,
      //     user_id: userId
      //   }
      // });

      // Saber se serie ja foi adicionada
      if(serieentry){
        serieadded = true;
      }

      // Somente se a serie estiver adicionada que faz a mudanca de lista se necessario
      if(serieadded){
          // ============== Check Progess =============================================
          // For each season, each episode
            let isuserfinished = true
            for(let i = 0; i < seasons.length; i++){
                let season = seasons[i]
                let totaleps = season.episodes.length
                let watchedeps = 0.0
                for(let j = 0; j < season.episodes.length; j++){  
                    let episode = season.episodes[j]

                    const episodeQueryResponse = await axios.get(
                      `${api.baseUrl}/table=View/operation=findOne/values=episode_id=${episode.id}&user_id=${userId}&series_id=${seriesId}`
                    );
        
                    let episodequery = episodeQueryResponse.data;

                    // const episodequery = await View.findOne({
                    // where: {
                    //     episode_id: episode.id,
                    //     user_id: userId,
                    //     series_id: seriesId,
                    // }
                    // });
                
                    if(episodequery){
                      watchedeps += 1.0
                    } 
                }
                const progr = (watchedeps/totaleps)*100
                if(Math.trunc(progr) < 100){
                    isuserfinished = false
                }
                season.progress = (progr).toFixed(1) + "%"

            }
        // ====================Change list if necessary=======================
        if(isuserfinished.toString() == "true" && seriesResponse.data.in_production.toString() == "true"){

            const seriesd = await axios.delete(
              `${api.baseUrl}/table=Series/values=user_id=${userId}&series_id=${seriesId}`
            );

            // const seriesd = await Series.destroy({
            //     where: {
            //       user_id: userId,
            //       series_id: seriesId,
            //     }
            // });

            const seriesc = await axios.post(
              `${api.baseUrl}/table=Series`,{
                user_id: userId, 
                list_id: 3,
                series_id: seriesId,
                average_rating: -1,
              }
            );

            // const seriec = await Series.create({
            //     user_id: userId, 
            //     list_id: 3,
            //     series_id: seriesId,
            //     average_rating: -1,
            //   });

        }else if(isuserfinished.toString() == "true"){

            const seriesd = await axios.delete(
              `${api.baseUrl}/table=Series/values=user_id=${userId}&series_id=${seriesId}`
            );

            // const seriesd = await Series.destroy({
            //     where: {
            //       user_id: userId,
            //       series_id: seriesId,
            //     }
            // });

            const seriesc = await axios.post(
              `${api.baseUrl}/table=Series`,{
                user_id: userId, 
                list_id: 2,
                series_id: seriesId,
                average_rating: -1,
              }
            );

            // const seriec = await Series.create({
            //     user_id: userId, 
            //     list_id: 2,
            //     series_id: seriesId,
            //     average_rating: -1,
            //   });
        }
      }

    } catch(error) {
        console.log('getSeries error: ', error);
    }
}

module.exports = UpdateSeriesList