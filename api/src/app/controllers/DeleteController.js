import axios from 'axios';
import View from '../models/View';
import Series from '../models/Series';
import List from '../models/List';
import User from '../models/User';
import File from '../models/File';

var KeyvaluesToValues = function(keyvaluesstring){
  let keyvaluesarray = keyvaluesstring.split('&')
  let objkv = {}
  for(let j = 0; j < keyvaluesarray.length; j++){
    let onekeyvalue = keyvaluesarray[j].split("=")
    objkv[onekeyvalue[0]] = onekeyvalue[1]
  }
  return objkv
}
class DeleteController{

  async index(req, res){

    const {table, keyvaluesstring} = req.params;
    
    try{
      let keyvalues = KeyvaluesToValues(keyvaluesstring);
      switch (table) {
        case 'File':
          
          break;
        case 'User':
          await User.destroy({where: keyvalues});

          res.status(200).json({message: 'User deleted!'});

          break;
        case 'Series':
          await Series.destroy({where: keyvalues});

          res.status(200).json({message: 'Series removed!'});

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
      console.log('DELETE method error: ', error);
    }
    
  }

}

export default new DeleteController();
