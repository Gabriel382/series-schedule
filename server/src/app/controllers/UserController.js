// import db
import user from '../models/User';

class UserController {

  // Cadastro de Usuários
  async store(req, res) {

    return res.json({response: 'Rota de Cadastro de Usuários.'});
  }

  async delete(req, res){

  	const {userId, admin} = req.body;

  	await user.destroy({where: {id: userId}});

  }
}

export default new UserController();
