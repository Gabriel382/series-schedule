import Sequelize, { Model } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      last_name: Sequelize.STRING,
      login: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.STRING,
      birth_date: Sequelize.DATE,
      city: Sequelize.STRING,
      state: Sequelize.STRING,
      last_access: Sequelize.DATE,
      profile_picture: Sequelize.STRING,
    }, 
    {
      sequelize,
    });

    return this;
  }
}

export default User;