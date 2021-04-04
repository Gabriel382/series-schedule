import axios from 'axios';
import api from '../../config/api';
import * as Yup from 'yup';
import User from '../models/User';

class UserController {

  // Cadastro de Usuários
  async store(req, res) {

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      last_name: Yup.string().required(),
      email: Yup.string().required(),
      login: Yup.string().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      console.log('deu erro isValid')
      return res.status(400).json({
        error: 'Verifique os dados digitados e tente novamente.',
      });
    }

    try {

      const emailExistsResponse = await axios.get(
        `${api.baseUrl}/table=User/operation=findOne/values=email=${req.body.email}`
      );

      const loginExistsResponse = await axios.get(
        `${api.baseUrl}/table=User/operation=findOne/values=login=${req.body.login}`
      );

      if (emailExistsResponse.data || loginExistsResponse.data) {
        return res.status(400).json({
          error: 'Usuário já cadastrado, faça login!',
        });
      }

      const createUserResponse = await axios.post(
        `${api.baseUrl}/table=User`, {
          name: req.body.name,
          last_name: req.body.last_name,
          email: req.body.email,
          login: req.body.login,
          password: req.body.password,
        }
      );

      const { id, name, last_name, email, login } = createUserResponse.data;

      res.json({
        id,
        name,
        last_name,
        email,
        login,
      })

    } catch(error) {
      console.log('UserController.store error: ', error);
    }
  
  }

  async delete(req, res){

    const {userId, admin} = req.body;
    
    try {
      
      await axios.delete(
        `${api.baseUrl}/table=User/values=id=${userId}`
      );

    } catch(error) {
      console.log('UserController.delete error: ', error);
    }

  }
  
}

export default new UserController();
