import Sequelize from 'sequelize';

import User from './models/User.js';
import List from './models/List.js';
import View from './models/View.js';
import Series from './models/Series.js';
import File from './models/File.js';

import databaseConfig from '../config/database.js';

const models = [User, List, View, Series, File];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
