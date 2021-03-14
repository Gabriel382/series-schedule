class HomeController{
  
  // Acessar página de home
  async index(req, res){

    if(req.cookies['userId']){
      res.render('user-home');
    }else{  
      res.render('index');
    }
  }
}

export default new HomeController();
