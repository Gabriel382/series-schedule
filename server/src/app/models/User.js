import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      last_name: Sequelize.STRING,
      login: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.VIRTUAL,
      password_hash: Sequelize.STRING,
      birth_date: Sequelize.DATE,
      city: Sequelize.STRING,
      state: Sequelize.STRING,
      last_access: Sequelize.DATE,
      profile_picture: Sequelize.STRING,
    }, 
    {
      sequelize,
    });

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;