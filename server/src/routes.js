import { Router } from 'express';
import SeriesController from './app/controllers/SeriesController';
import UserController from './app/controllers/UserController';
import EpisodeController from './app/controllers/EpisodeController';

const routes = new Router();

// Acessar página da série contendo informações 
// e lista de temporadadas e episódios
routes.get('/series/:id', SeriesController.index);

routes.get('/series/:seriesId/season/:seasonNumber/episode/:episodeNumber', EpisodeController.index);

export default routes;
