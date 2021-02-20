import Sequelize, { Model } from 'sequelize';

class View extends Model {
  static init(sequelize) {
    super.init({
      episode_id: Sequelize.INTEGER,
      series_id: Sequelize.INTEGER,
      rating: Sequelize.DECIMAL,
    }, 
    {
      sequelize,
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  }
}

export default View;