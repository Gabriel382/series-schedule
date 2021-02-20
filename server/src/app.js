import express from 'express';
import bodyParser from 'body-parser'; 
import routes from './routes';
import path from 'path';

import './database';

class App {
  constructor() {

    this.server = express();

    this.middlewares();
    this.routes();

    this.server.use(express.static(__dirname + '/public'));
    this.server.use(bodyParser.urlencoded({ extended: true }));
    this.server.set('view engine', 'ejs') 
    this.server.set('views', path.join(__dirname, 'app/views'));
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
