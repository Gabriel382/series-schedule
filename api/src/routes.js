import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import DeleteController from './app/controllers/DeleteController';
import GetController from './app/controllers/GetController';
import PostController from './app/controllers/PostController';
import PutController from './app/controllers/PutController';
import cookieParser from 'cookie-parser';


const routes = new Router();
const upload = multer(multerConfig);
routes.use(cookieParser());

// Get All Options Available
routes.get('/', GetController.options);

// GET
routes.get('/table=:table/operation=:operation/values=:keyvaluesstring', GetController.index); // CHAVE=VALOR&CHAVE2=VALOR

// POST
routes.post('/table=:table', PostController.index);

// PUT
routes.put('/table=:table/values=:keyvaluesstring', PutController.index);

// DELETE
routes.delete('/table=:table/values=:keyvaluesstring', DeleteController.index);


export default routes;
