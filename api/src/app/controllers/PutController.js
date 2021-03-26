import axios from 'axios';
import View from '../models/View';
import Series from '../models/Series';
import List from '../models/List';
import User from '../models/User';
import File from '../models/File';

class PutController{

  async index(req, res){

    const {table, operation, keyvalues} = req.params;
    


    // Retornando o resultado
    return res.json({});
    
  }

}

export default new PutController();
