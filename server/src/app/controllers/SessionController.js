import * as Yup from 'yup';
import User from '../models/User';

class SessionController{
  
  // Acessar página de Login e Cadastro
  async index(req, res){

    res.render('login');
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Verifique os dados digitados e tente novamente.',
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        error: 'Usuário não encontrado!',
      });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({
        error: 'A senha está errada, por favor, tente novamente.',
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