import axios from 'axios';
import api from '../../config/api';
import tmdb from '../../config/tmdb';

class SearchController{

  async index(req, res){


      try {

        const title = req.query.title;

        var responseSearch;

        if(title){
          responseSearch = await axios.get(
            `${tmdb.baseUrl}/search/tv?api_key=${tmdb.apiKey}&language=pt-BR&query=${title}`
          );
        } 
        else responseSearch = {data: {results: []}};

        const responseGenres = await axios.get(
          `${tmdb.baseUrl}/genre/tv/list?api_key=${tmdb.apiKey}&language=pt-BR`
        );

        const data = {
          title: title,
          seriesList: responseSearch.data.results
        }

        res.render('search-page', data);

      } catch(error) {
      console.log('search page load error: ', error);
    }

  }

  async advancedSearch(req, res){
    try{


      const {titulo} = req.body;

      const responseSearch = await axios.get(
          `${tmdb.baseUrl}/search/tv?api_key=${tmdb.apiKey}&language=pt-BR&query=${titulo}`
        );

      const responseGenres = await axios.get(
          `${tmdb.baseUrl}/genre/tv/list?api_key=${tmdb.apiKey}&language=pt-BR`
        );

        const responseClassifications = await axios.get(
          `${tmdb.baseUrl}/certification/tv/list?api_key=${tmdb.apiKey}`
        );

      const data = {
          seriesList: responseSearch.data.results,
          keySearch: titulo,
          genres: responseGenres.data.genres,
          classifications: responseClassifications.data.certifications.BR
      }


      data.seriesList.forEach((genre) => {
        console.log(genre) })


      res.render('advanced-search-page', data);    

    } catch(error) {
      console.log('searchName error: ', error);
    }

  }

}

export default new SearchController();

function formatDate(value){

  var date = new Date(value);
  var day = date.getDate().toString();
  day = (day.length == 1) ? '0' + day : day;
  var month = (date.getMonth()+1).toString();
  month = (month.length == 1)? '0' + month : month;
  var year = date.getFullYear();

  return day + '/' + month + '/' + year;
}
