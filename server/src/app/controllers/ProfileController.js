import axios from 'axios';
import tmdb from '../../config/tmdb';
import user from '../models/User';

class ProfileController{

  async index(req, res){

    const id = req.params.userId;

    try {
      const userResponse = await user.findAll({
        where: {id: id}}
      );
     
      const data = {
        name: userResponse[0].dataValues.name,
        last_name: userResponse[0].dataValues.last_name,
        email : userResponse[0].dataValues.email,
        city : userResponse[0].dataValues.city,
        state : userResponse[0].dataValues.state,
        login : userResponse[0].dataValues.login,
        birth_date : formatDate(userResponse[0].dataValues.birth_date),
        userId : id
      };
  
      res.render('profile-settings', data);

    } catch(error) {
      console.log('error: ', error);
    }
    
  }

  async save(req, res){
    
    const {userId, login, name, last_name, city, state, birth_date} = req.body;

    await user.update({login: login, name: name, last_name: last_name, city: city, state: state, birth_date: birth_date}, {where: {id: userId}});
  } 

}

export default new ProfileController();

function formatDate(value){

  var date = new Date(value);
  var day = date.getDate().toString();
  day = (day.length == 1) ? '0' + day : day;
  var month = (date.getMonth()+1).toString();
  month = (month.length == 1)? '0' + month : month;
  var year = date.getFullYear();

  return day + '/' + month + '/' + year;
}
