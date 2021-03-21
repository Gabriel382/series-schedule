import Sequelize, { Model } from 'sequelize';

class Series extends Model {
  static init(sequelize) {
    super.init({
      series_id: Sequelize.INTEGER,
      average_rating: Sequelize.DECIMAL,
    }, 
    {
      sequelize,
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.List, {
      foreignKey: 'list_id',
      as: 'list',
    });

    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  }
}

export default Series;