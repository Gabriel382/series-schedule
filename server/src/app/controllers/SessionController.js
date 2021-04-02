import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';

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

    const user = await User.findOne({
      where: { email },
      include: [
              {
                model: File,
                as: 'avatar',
                attributes: ['id', 'path', 'url'],
              }
            ]
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

    const { id, name, avatar } = user;

    res.cookie("userId", id);
    res.cookie("userName", name);
    res.cookie("userPicture", avatar ? avatar.url : null );

    return res.json({
      user: {
        id,
        name,
      },
    });
  }

  async delete(req, res) {
    res.clearCookie("userId");
    res.clearCookie("userName");
    res.clearCookie("userPicture");

    return res.render('index');
  }
  
}

export default new SessionController();