import axios from 'axios';
import View from '../models/View';
import Series from '../models/Series';
import List from '../models/List';
import User from '../models/User';
import File from '../models/File';

class PutController{

  async index(req, res){

    const {table, } = req.params;
    
    try{
      switch (table) {
        case 'File':
          
          break;
        case 'User':
          
          break;
        case 'Series':

          break;
        case 'List':

          break;
        case 'View':
            
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

export default new PutController();
