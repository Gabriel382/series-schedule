class HomeController{
  
  // Acessar página de home
  async index(req, res){

    if(req.cookies['userId']){
    	if(req.cookies['userId'] == '1') {
    		res.statusCode = 302;
    		res.setHeader("Location", "/admin");
    		res.end();
    	}
      	else res.render('user-home');
    }else{  
      res.render('index');
    }
  }
}

export default new HomeController();
