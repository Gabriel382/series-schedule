import { Router } from 'express';
import SeriesController from './app/controllers/SeriesController';
import UserController from './app/controllers/UserController';
import EpisodeController from './app/controllers/EpisodeController';
import ProfileController from './app/controllers/ProfileController';
import User from './app/models/User';

const routes = new Router();

// Acessar página da série contendo informações 
// e lista de temporadadas e episódios
routes.get('/:userId/series/:id', SeriesController.index);

// Acessar página de episódio
routes.get('/:userId/series/:seriesId/season/:seasonNumber/episode/:episodeNumber', EpisodeController.index);

// Marcar episódio como visto
// routes.post('/userId:/series/:seriesId/season/:seasonNumber/episode/:episodeNumber', EpisodeController.view);
routes.post('/watch', EpisodeController.view);

//Acessar página de perfil do usuário
routes.get('/profile/:userId', ProfileController.index);

//Salvar perfil
routes.post('/saveprofile', ProfileController.save);

export default routes;
