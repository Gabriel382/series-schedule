import * as Yup from 'yup';
import User from '../models/User';

class UserController {

  // Cadastro de Usuários
  async store(req, res) {
    console.log(req.body);

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

    const emailExists = await User.findOne({
      where: { 
        email: req.body.email,
      },
    });

    const loginExists = await User.findOne({
      where: { 
        login: req.body.login,
      },
    });

    if (emailExists || loginExists) {
      return res.status(400).json({
        error: 'Usuário já cadastrado, faça login!',
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

  async delete(req, res){

  	const {userId, admin} = req.body;

  	await User.destroy({where: {id: userId}});

  }
}

export default new UserController();
