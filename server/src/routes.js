import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SeriesController from './app/controllers/SeriesController';
import UserController from './app/controllers/UserController';
import EpisodeController from './app/controllers/EpisodeController';
import ProfileController from './app/controllers/ProfileController';
import SessionController from './app/controllers/SessionController';
import cookieParser from 'cookie-parser';
import HomeController from './app/controllers/HomeController';
import SearchController from './app/controllers/SearchController';
import AdminController from './app/controllers/AdminController';
import FileController from './app/controllers/FileController';
import AdvancedSearchController from './app/controllers/AdvancedSearchController';


const routes = new Router();
const upload = multer(multerConfig);
routes.use(cookieParser());

// Acessar página da série contendo informações 
// e lista de temporadadas e episódios
routes.get('/series/:id', SeriesController.index);

// Adicionar Serie
// routes.post('/userId:/series/:seriesId/season/:seasonNumber/episode/:episodeNumber', EpisodeController.view);
routes.post('/addserie', SeriesController.view);

// Remover Serie
routes.post('/removeserie', SeriesController.removes);

// Acessar página de episódio
routes.get('/series/:seriesId/season/:seasonNumber/episode/:episodeNumber', EpisodeController.index);

// Marcar episódio como visto
// routes.post('/userId:/series/:seriesId/season/:seasonNumber/episode/:episodeNumber', EpisodeController.view);
routes.post('/watch', EpisodeController.view);

// Dar nota a episódio visto
routes.post('/episodescore', EpisodeController.episodescore);


//Acessar página de perfil do usuário
routes.get('/profile', ProfileController.index);

//Salvar perfil
routes.put('/saveprofile', ProfileController.save);

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

//AUTENTICAÇÃO

//Acessar página de Login e Cadastro
routes.get('/authentication', SessionController.index);

//Cadastrar um novo usuário
routes.post('/sign_up', UserController.store);

//Fazer Login
routes.post('/sign_in', SessionController.store);

//Fazer Login
routes.get('/sign_out', SessionController.delete);

//Acessar home
routes.get('/', HomeController.index);

//Busca
routes.get('/advancedSearch', AdvancedSearchController.index);

routes.post('/advancedSearch', AdvancedSearchController.search);

routes.get('/search', SearchController.index);

//Administrador
routes.get('/admin', AdminController.index);

//Excluir usuário
routes.delete('/deleteuser', UserController.delete);

//Upload de imagem
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
