// import db

class UserController {

  // Cadastro de Usuários
  async store(req, res) {

    return res.json({response: 'Rota de Cadastro de Usuário.'});
  }
}

export default new UserController();
