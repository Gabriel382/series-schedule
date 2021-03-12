import * as Yup from 'yup';
import User from '../models/User';

class AuthenticationController{
  
  // Acessar página de Login e Cadastro
  async auth_page(req, res){

    res.render('login');
  }
  
  // Realizar cadastro
  async sign_up(req, res) {
    console.log(req.body);

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      last_name: Yup.string().required(),
      email: Yup.string().email().required(),
      login: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    // if (!(await schema.isValid(req.body))) {
    //   console.log('deu erro isValid')
    //   return res.status(400).json({
    //     error: 'Validation failed',
    //   });
    // }

    const userExists = await User.findOne({
      where: { email: req.body.email },
    });

    if (userExists) {
      return res.status(400).json({
        error: 'User already exists',
      });
    }

    const { id, name, last_name, email, login } = await User.create(req.body);

    return res.json({
      id,
      name,
      last_name,
      email,
      login,
    });
  }
}

export default new AuthenticationController();