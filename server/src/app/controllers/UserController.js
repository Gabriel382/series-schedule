// import db

class UserController {

  // Cadastro de Usuários
  async store(req, res) {

    return res.json({response: 'Rota de Cadastro de Usuários.'});
  }
}

export default new UserController();
