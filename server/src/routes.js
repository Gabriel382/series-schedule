import { Router } from 'express';
import SeriesController from './app/controllers/SeriesController';
import UserController from './app/controllers/UserController';
import EpisodeController from './app/controllers/EpisodeController';
import ProfileController from './app/controllers/ProfileController';
import User from './app/models/User';
import AuthenticationController from './app/controllers/AuthenticationController';
import cookieParser from 'cookie-parser';

const routes = new Router();
routes.use(cookieParser());

// Acessar página da série contendo informações 
// e lista de temporadadas e episódios
routes.get('/:userId/series/:id', SeriesController.index);

// Adicionar Serie
// routes.post('/userId:/series/:seriesId/season/:seasonNumber/episode/:episodeNumber', EpisodeController.view);
routes.post('/addserie', SeriesController.view);

// Remover Serie
routes.post('/removeserie', SeriesController.removes);

// Acessar página de episódio
routes.get('/:userId/series/:seriesId/season/:seasonNumber/episode/:episodeNumber', EpisodeController.index);

// Marcar episódio como visto
// routes.post('/userId:/series/:seriesId/season/:seasonNumber/episode/:episodeNumber', EpisodeController.view);
routes.post('/watch', EpisodeController.view);

//Acessar página de perfil do usuário
routes.get('/profile/:userId', ProfileController.index);

//Salvar perfil
routes.post('/saveprofile', ProfileController.save);

//Acessar página de Login e Cadastro
routes.get('/login', AuthenticationController.auth_page);

//Fazer o cadastro de um novo usuário
routes.post('/sign_up', AuthenticationController.sign_up);
//Login
routes.get('/profilepage', (req, res)=>{ 
    res.cookie("userId", 1); 
    res.send('user data added to cookie');
});

routes.get('/profilepage/:userId', (req, res)=>{ 
    res.cookie("userId", req.params.userId); 
    res.send('user data added to cookie');
});

//Iterate users data from cookie 
routes.get('/getuser', (req, res)=>{ 
    //shows all the cookies 
    res.send('Oi: ' + req.cookies['userId']); 
}); 

export default routes;
