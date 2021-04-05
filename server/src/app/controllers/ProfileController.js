import axios from 'axios';
import api from '../../config/api';

class ProfileController{

  async index(req, res){

    const id = req.cookies['userId'];

    try {
      const userResponse = await axios.get(
        `${api.baseUrl}/table=User/operation=findOne/values=id=${id}`
      );

      var avatar_id = userResponse.data.avatar_id;

      if(avatar_id){
        const fileResponse = await axios.get(
          `${api.baseUrl}/table=File/operation=findOne/values=id=${avatar_id}`
        );

        var avatar = fileResponse.data;
      }else{
        var avatar = null;
      }
     
      const data = {
        name: userResponse.data.name,
        last_name: userResponse.data.last_name,
        email: userResponse.data.email,
        city: userResponse.data.city,
        state: userResponse.data.state,
        login: userResponse.data.login,
        birth_date: formatDate(userResponse.data.birth_date),
        avatarId: userResponse.data.avatar_id,
        userId: userResponse.data.id,
        avatar: avatar ? avatar.url : null,
      };
  
      res.render('profile-settings', data);

    } catch(error) {
      console.log('ProfileController.index error: ', error);
    }
    
  }

  async save(req, res){
    
    const {user_id, login, name, last_name, city, state, avatar_id, birth_date} = req.body;

      try {

        console.log('req.body: ', req.body);

        var sp = birth_date.split('/');
        var formattedDate = `${sp[2]}-${sp[1]}-${sp[0]} 00:00:00-03`

        const updateUserResponse = await axios.put(
          `${api.baseUrl}/table=User/values=id=${user_id}`, {
            login: login, 
            name: name, 
            last_name: last_name, 
            city: city, 
            state: state, 
            avatar_id: avatar_id,
            birth_date: formattedDate,
          }
        );

        res.clearCookie("userName");
        res.clearCookie("userPicture");

        const fileResponse = await axios.get(`${api.baseUrl}/table=File/operation=findOne/values=id=${avatar_id}`);

        var avatar = fileResponse.data;

        res.cookie("userName", name);
        res.cookie("userPicture", avatar ? avatar.url : null );

        let user = updateUserResponse.data;

        res.json(user);

    } catch(error) {
      console.log('ProfileController.save error:', error);
    }
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
