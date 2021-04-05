import axios from 'axios';
import api from '../../config/api';
import tmdb from '../../config/tmdb';
import formatSQLdate from '../../utils/formatSQLdate';
import formatBrazilianDate from '../../utils/formatBrazilianDate';
import formatTMDBdate from '../../utils/formatTMDBdate';

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

          var userId = -1
          if(req.cookies['userId'] != undefined)
            userId = req.cookies['userId']

          
          const userResponse = await axios.get(
            `${api.baseUrl}/table=User/operation=findOne/values=id=${userId}`
          );
      
          var user = userResponse.data;
          const {  
            name, 
            birth_date,
            avatar_id,
            last_access,
          } = user;

          const fileResponse = await axios.get(
            `${api.baseUrl}/table=File/operation=findOne/values=id=${avatar_id}`
          );
      
          var avatar = fileResponse.data;

          var data = {
            ultimosassistidos: [],
            assistindo: [],
            emhiato: [],
            completos: [],
            name: name,
            avatar: avatar ? avatar.url : null,
            age: getAge(birth_date),
            totalSeries: 0,
            usuarioUltimoAcesso: last_access ? formatDate(last_access) : '',
          }

          console.log(data.avatar);
          //===================== Todas as series ==================================
          
          try {
            const allSeriesResponse = await axios.get(
              `${api.baseUrl}/table=Series/operation=findAll/values=user_id=${userId}`
            );

            let allseries = allSeriesResponse.data;
            data.totalSeries = allseries.length;

            let series = []
            for(let i = 0; i < allseries.length; i++){
              let oneserie = await axios.get(
                `${tmdb.baseUrl}/tv/${allseries[i].series_id}?api_key=${tmdb.apiKey}&language=pt-BR`
              );

              if(oneserie){
                oneserie.data.poster_path = `${tmdb.imagesPath}` + oneserie.data.poster_path
                
                let dateformated =  formatSQLdate(allseries[i].updatedAt);
                oneserie.data.watcheddate = dateformated;


                series.push(oneserie)

                //===================== Ultimos Assistidos ===================================
                var date = new Date();
                date.setDate(date.getDate() - 7)

                var createdAt = Date.parse(allseries[i].createdAt);

                if(date <= createdAt){
                  data.ultimosassistidos.push(oneserie)
                }
                //===================== Listas ===============================================
                // Assistindo
                const listseriesResponse = await axios.get(
                  `${api.baseUrl}/table=Series/operation=findOne/values=user_id=${userId}&series_id=${oneserie.data.id}`
                );

                let listserie = listseriesResponse.data;

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
          console.log('HomeController.index error: ', error);
        }
          res.render('user-home',data);
        } 
    }else{  
      res.render('index');
    }
  }
}

export default new HomeController();

function getAge(dateString) 
{
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
    {
        age--;
    }
    return age;
}

function formatDate(value){

  var date = new Date(value);
  var day = date.getDate().toString();
  day = (day.length == 1) ? '0' + day : day;
  var month = (date.getMonth()+1).toString();
  month = (month.length == 1)? '0' + month : month;
  var year = date.getFullYear();
  var hour = date.getHours().toString();
  var minute = date.getMinutes().toString();
  return day + '/' + month + '/' + year + ' ' + hour + ':' + minute;
}