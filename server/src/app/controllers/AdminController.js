import axios from 'axios';
import api from '../../config/api';
import tmdb from '../../config/tmdb';

class AdminController{

  async index(req, res){


    try {

        const name = req.query.name;
        var response;

        if(name){

          response = await axios.get(
            `${api.baseUrl}/table=Admin/operation=search/values=name=${name}`
          )


        } else {
          response = await axios.get(
            `${api.baseUrl}/table=Admin/operation=listAll/values=name=${name}`
          )

        }

        const listUsers = [];

        response.data.forEach((user) => {
          listUsers.push({
            id: user.id,
            name: user.name,
            last_name: user.last_name,
            login: user.login,
            email: user.email,
            last_acess: formatDate(user.last_acess),
            profile_picture: (user.profile_picture == null? 'user.jpg': user.profile_picture),
            createdAt: formatDate(user.createdAt)
          })
        });

        const data = {
          listUsers: listUsers
        }
        res.render('admin-page', data);

      } catch(error) {
      console.log('admin page load error: ', error);
    }

  }

}

export default new AdminController();

function formatDate(value){

  if (value) 
  {
    var date = new Date(value);
    var day = date.getDate().toString();
    day = (day.length == 1) ? '0' + day : day;
    var month = (date.getMonth()+1).toString();
    month = (month.length == 1)? '0' + month : month;
    var year = date.getFullYear();

    return day + '/' + month + '/' + year;
  }
  else return '';
}
