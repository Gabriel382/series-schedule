import Sequelize, { Model } from 'sequelize';

class List extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      description: Sequelize.STRING,
    }, 
    {
      sequelize,
    });

    return this;
  }
}

export default List;