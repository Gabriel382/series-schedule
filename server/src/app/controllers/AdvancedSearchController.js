import axios from 'axios';
import tmdb from '../../config/tmdb';
import user from '../models/User';

class AdvancedSearchController{

  async index(req, res){

    try{

      /*const genre = req.query.genre;
      const year = req.query.year;
      const classification = req.query.classification;
      const orderby = req.query.orderby;*/

      const {genre, year, classification, orderby} = req.query;

      const responseGenres = await axios.get(
        `${tmdb.baseUrl}/genre/tv/list?api_key=${tmdb.apiKey}&language=pt-BR`
      );

      const responseClassifications = await axios.get(
        `${tmdb.baseUrl}/certification/tv/list?api_key=${tmdb.apiKey}`
      );

      var url = `${tmdb.baseUrl}/discover/tv?api_key=${tmdb.apiKey}&language=pt-BR`
      const seriesList = [];

      if(genre|| year||classification){ 

        if(genre) url = url + `&with_genres=${genre}`
        if(year) url = url + `&first_air_date_year=${year}`;
        if(classification) url = url + `&certification_country=BR&certification=${classification}`;
        if(orderby) url = url + `&sort_by=${orderby}`;

        const responseSearch = await axios.get(url);
        
        responseSearch.data.results.forEach((item) => {

          var genre_list = '';
          item.genre_ids.forEach((id)=>{
            genre_list += responseGenres.data.genres.find(genre => genre.id == id).name + ', ';
          });
          if(genre_list.length > 2) genre_list = genre_list.substr(0, (genre_list.length - 2));

          var serie = {
            id: item.id,
            name: item.name,
            genre_list: genre_list,
            first_air_date: formatDate(item.first_air_date),
            poster_path: item.poster_path,
            sinopse: ''
          };

          seriesList.push(serie);         
        });
      }

      const promises = seriesList.map(async(serie) => {
        var responseSerie = await axios.get(`${tmdb.baseUrl}/tv/${serie.id}?api_key=${tmdb.apiKey}&language=pt-BR`);
        serie.sinopse = responseSerie.data.overview;
        return true;
      });
      
      await Promise.all(promises).then(
            responses => {
             console.log(responses); 
           })

      const data = {
          selectGenre: genre,
          selectYear: year,
          selectClassification: classification,
          selectOrderby: orderby,
          genres: responseGenres.data.genres,
          classifications: responseClassifications.data.certifications.BR,
          seriesList: seriesList
      }

      res.render('advanced-search-page', data);    

    } catch(error) {
      console.log('searchName error: ', error);
    }

  }

  async search(req, res){

    try{

      const {genre, air_date_year, classification, orderby} = req.body;      

      const responseGenres = await axios.get(
          `${tmdb.baseUrl}/genre/tv/list?api_key=${tmdb.apiKey}&language=pt-BR`
        );

        const responseClassifications = await axios.get(
          `${tmdb.baseUrl}/certification/tv/list?api_key=${tmdb.apiKey}`
        );

        var url = `${tmdb.baseUrl}/discover/tv?api_key=${tmdb.apiKey}&language=pt-BR`
        if (genre > 0) url = url + `&with_genres=${genre}`

        const responseSearch = await axios.get(url);
        const seriesList = [];

        console.log(responseSearch.data.results);

      const data = {
          genres: responseGenres.data.genres,
          classifications: responseClassifications.data.certifications.BR,
          seriesList: responseSearch.data.results
      }

      console.log
      res.render('advanced-search-page', data);

    } catch(error) {
      console.log('searchName error: ', error);
    }

  }

}

export default new AdvancedSearchController();

function formatDate(value){

  var date = new Date(value);
  var day = date.getDate().toString();
  day = (day.length == 1) ? '0' + day : day;
  var month = (date.getMonth()+1).toString();
  month = (month.length == 1)? '0' + month : month;
  var year = date.getFullYear();

  return day + '/' + month + '/' + year;
}
 
