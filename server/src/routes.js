import { Router } from 'express';
import SeriesController from './app/controllers/SeriesController';
import UserController from './app/controllers/UserController';
import EpisodeController from './app/controllers/EpisodeController';
import User from './app/models/User';

const routes = new Router();

// routes.get('/', async (req, res) => {
//   return res.json('');
// })

// Acessar página da série contendo informações 
// e lista de temporadadas e episódios
routes.get('/series/:id', SeriesController.index);

// Acessar página de episódio
routes.get('/:userId/series/:seriesId/season/:seasonNumber/episode/:episodeNumber', EpisodeController.index);

// Marcar episódio como visto
// routes.post('/userId:/series/:seriesId/season/:seasonNumber/episode/:episodeNumber', EpisodeController.view);
routes.post('/watch', EpisodeController.view);

export default routes;
