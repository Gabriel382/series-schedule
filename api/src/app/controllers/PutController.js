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
class PutController{

  async index(req, res){

    const {table, keyvaluesstring} = req.params;
    
    try{
      let keyvalues = KeyvaluesToValues(keyvaluesstring)
      switch (table) {
        case 'File':
          
          break;
        case 'User':
          const user = await User.update(req.body, {where: keyvalues});
          
          return res.status(200).json(user);
          break;
        case 'Series':
          const series = await Series.update(req.body, {where: keyvalues})

          return res.status(200).json(series);
          break;
        case 'List':

          break;
        case 'View':
          const watch = await View.update(req.body, {where: keyvalues});
    
          return res.status(200).json(watch);
          break;
        default:
          res.sendStatus(404);
          break;
      }
    } catch(error) {
      console.log('PUT method error: ', error);
    }
    
  }

}

export default new PutController();
