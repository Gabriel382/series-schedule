import axios from 'axios';
import View from '../models/View';
import Series from '../models/Series';
import List from '../models/List';
import User from '../models/User';
import File from '../models/File';

class PostController{

  async index(req, res){

    const {table} = req.params;
    
    try{
      switch (table) {
        case 'File':
          const file = await File.create(req.body);

          return res.status(201).json(file);
          
          break;
        case 'User':
          const { id, name, last_name, email, login } = await User.create(req.body);

          return res.json({
            id,
            name,
            last_name,
            email,
            login,
          });  
          break;
        case 'Series':
          const series = await Series.create(req.body);

          return res.status(201).json(series);

          break;
        case 'List':
          // Não temos função de cadastrar listas no nosso banco de dados
          // As listas são fixas
          break;
        case 'View':
          const watch = await View.create(req.body);

          return res.status(201).json(watch);
          break;
        default:
          res.sendStatus(404);
          break;
      }
    } catch(error) {
      console.log('POST method error: ', error);
    }
  }

}

export default new PostController();
