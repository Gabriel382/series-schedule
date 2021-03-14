import axios from 'axios';
import tmdb from '../../config/tmdb';
import user from '../models/User';
const { Op } = require("sequelize");

class AdminController{

  async index(req, res){


    try {

        const name = req.query.name;
        console.log(name);
        var response;

        if(name) response = await user.findAll({where: {[Op.or]:[{name:{[Op.iLike]: `%${name}%`}}, {last_name:{[Op.iLike]: `%${name}%`}}]},
                                  order:['name']});
        else response = await user.findAll({order:['name']});

        const listUsers = [];

        response.forEach((user) => {
          listUsers.push({
            id: user.dataValues.id,
            name: user.dataValues.name,
            last_name: user.dataValues.last_name,
            login: user.dataValues.login,
            email: user.dataValues.email,
            last_acess: formatDate(user.dataValues.last_acess),
            profile_picture: (user.dataValues.profile_picture == null? 'user.jpg': user.dataValues.profile_picture),
            createdAt: formatDate(user.dataValues.createdAt)
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
