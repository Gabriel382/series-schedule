import axios from 'axios';
import api from '../../config/api';
import * as Yup from 'yup';
// import User from '../models/User';

class SessionController{
  
  // Acessar página de Login e Cadastro
  async index(req, res){

    res.render('login');
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Verifique os dados digitados e tente novamente.',
      });
    }

    const { email, password } = req.body;

    const emailExistsResponse = await axios.get(
      `${api.baseUrl}/table=User/operation=findOne/values=email=${req.body.email}`
    );

    const user = emailExistsResponse.data;

    if (!user) {
      return res.status(401).json({
        error: 'Usuário não encontrado!',
      });
    }

    const { id, name } = user;

    res.cookie("userId", id);

    return res.json({
      user: {
        id,
        name,
      },
    });
  }

  async delete(req, res) {
    res.clearCookie("userId");

    return res.json({msg: 'Usuário deslogado com sucesso'});
  }
  
}

export default new SessionController();