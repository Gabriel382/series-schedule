import axios from 'axios';
import api from '../../config/api';
import tmdb from '../../config/tmdb';
import formatSQLdate from '../../utils/formatSQLdate';
import formatBrazilianDate from '../../utils/formatBrazilianDate';

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
            usuarioUltimoAcesso: ''
          }

          console.log(data.avatar);
          //===================== Todas as series ==================================
          
          try {
            const allSeriesResponse = await axios.get(
              `${api.baseUrl}/table=Series/operation=findAll/values=user_id=${userId}`
            );

            // let allseries = await Series.findAll({where: {
            //   user_id: userId
            // }})

            let allseries = allSeriesResponse.data;
            
            let series = []
            for(let i = 0; i < allseries.length; i++){
              let oneserie = await axios.get(
                `${tmdb.baseUrl}/tv/${allseries[i].series_id}?api_key=${tmdb.apiKey}&language=pt-BR`
              );

              if(oneserie){
                oneserie.data.poster_path = `${tmdb.imagesPath}` + oneserie.data.poster_path
                
                // .toISOString().replace(/T/, ' ').replace(/\..+/, '').split(" ")
                let dateformated =  formatSQLdate(allseries[i].updatedAt);
                oneserie.data.watcheddate = dateformated;

                // if(dateformated.length >= 2){
                //   oneserie.data.watcheddate  = formatBrazilianDate(dateformated[0])
                // } else{
                //   oneserie.data.watcheddate = ""
                // }

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
                
                // const listserie = await Series.findOne({
                //   where: {
                //     series_id: oneserie.data.id,
                //     user_id: userId,
                //   }
                // });

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