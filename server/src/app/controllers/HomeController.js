import axios from 'axios';
import tmdb from '../../config/tmdb';
import formatTMDBdate from '../../utils/formatTMDBdate';
import formatBrazilianDate from '../../utils/formatBrazilianDate';
import View from '../models/View';
import Series from '../models/Series';
import List from '../models/List';

class HomeController{
  
  // Acessar página de home
  async index(req, res){

    if(req.cookies['userId']){
      // ADM
    	if(req.cookies['userId'] == '1') {
    		res.statusCode = 302;
    		res.setHeader("Location", "/admin");
    		res.end();
    	} // NORMAL USER
      else{
          var data = {
            ultimosassistidos: [],
            assistindo: [],
            emhiato: [],
            completos: []
          }
          //===================== Todas as series ==================================
          var userId = -1
          if(req.cookies['userId'] != undefined)
            userId = req.cookies['userId']
          try {
            let allseries = await Series.findAll({where: {
              user_id: userId
            }})
            
            let series = []
            for(let i = 0; i < allseries.length; i++){
              let oneserie = await axios.get(
                `${tmdb.baseUrl}/tv/${allseries[i].dataValues.series_id}?api_key=${tmdb.apiKey}&language=pt-BR`
              );
              if(oneserie){
                oneserie.data.poster_path = `${tmdb.imagesPath}` + oneserie.data.poster_path
                let dateformated =  allseries[i].dataValues.updatedAt.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(" ")
                if(dateformated.length >= 2){
                  oneserie.data.watcheddate  = formatBrazilianDate(dateformated[0])
                } else{
                  oneserie.data.watcheddate = ""
                }
                series.push(oneserie)
                //===================== Ultimos Assistidos ===================================
                var date = new Date();
                date.setDate(date.getDate() - 7);
                if(date <= allseries[i].dataValues.createdAt){
                  data.ultimosassistidos.push(oneserie)
                }
                //===================== Listas ===============================================
                // Assistindo
                const listserie = await Series.findOne({
                  where: {
                    series_id: oneserie.data.id,
                    user_id: userId,
                  }
                });
                if(listserie){
                  switch(listserie.list_id){
                    case 1:
                      data.assistindo.push(oneserie)
                      break
                    case 2:
                      data.completos.push(oneserie)
                      break
                    case 3:
                      data.emhiato.push(oneserie)
                      break
                  }
                }
                

              }
            }
          

          //===================== Ultimos Assistidos ===================================
          


          

        } catch(error) {
          console.log('getSeries error: ', error);
        }
          res.render('user-home',data);
        } 
    }else{  
      res.render('index');
    }
  }
}

export default new HomeController();
