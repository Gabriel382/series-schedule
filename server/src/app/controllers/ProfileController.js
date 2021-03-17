import axios from 'axios';
import tmdb from '../../config/tmdb';
import User from '../models/User';
import File from '../models/File';

class ProfileController{

  async index(req, res){

    const id = req.cookies['userId'];

    try {
      const {  
        name, 
        last_name,
        email,
        city,
        state,
        login,
        birth_date,
        avatar } = await User.findByPk(id, {
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['id', 'path', 'url'],
          }
        ]
      })
     
      const data = {
        name: name,
        last_name: last_name,
        email: email,
        city: city,
        state: state,
        login: login,
        birth_date: formatDate(birth_date),
        userId: id,
        avatar: avatar ? avatar.url : null,
      };

      console.log(data.avatar);
  
      res.render('profile-settings', data);

    } catch(error) {
      console.log('error: ', error);
    }
    
  }

  async save(req, res){

    console.log('ID: ', req.body.avatar_id);
    
    const {user_id, login, name, last_name, city, state, avatar_id} = req.body;

    const userId = parseInt(user_id, 10);

    await User.update({
      login: login, 
      name: name, 
      last_name: last_name, 
      city: city, 
      state: state, 
      avatar_id: avatar_id
    }, {
      where: {
        id: userId
      }
    });
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
