import Sequelize from 'sequelize';

import User from '../app/models/User';
import List from '../app/models/List';
import View from '../app/models/View';
import Series from '../app/models/Series';
import File from '../app/models/File';

import databaseConfig from '../config/database';

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
