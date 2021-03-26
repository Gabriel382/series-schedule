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
routes.post('/', PostController.index); // '/table=:table/operation=:op/values=:keyvalues'

// PUT
routes.put('/', PutController.index); // /table=:table/values=:keyvalues

// DELETE
routes.delete('/', DeleteController.index); // /table=:table/values=:keyvalues


export default routes;
