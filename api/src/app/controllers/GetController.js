import axios from 'axios';
import View from '../models/View';
import Series from '../models/Series';
import List from '../models/List';
import User from '../models/User';
import File from '../models/File';

var FindOneOperation = function(model, opt ,whereparams, res){
  if(opt == 'findOne'){
    model.findOne({where: whereparams}).then(function(value){
      return res.json(value)
    }).catch(function (err) {
      // handle error;
      console.log(err)
    });
  } else if(opt == 'findAll'){
    model.findAll({where: whereparams}).then(function(value){
      return res.json(value)
    }).catch(function (err) {
      // handle error;
      console.log(err)
    });
  }

}

var KeyvaluesToValues = function(keyvaluesstring){
  let keyvaluesarray = keyvaluesstring.split('&')
  let objkv = {}
  for(let j = 0; j < keyvaluesarray.length; j++){
    let onekeyvalue = keyvaluesarray[j].split("=")
    objkv[onekeyvalue[0]] = onekeyvalue[1]
  }
  return objkv
}

class GetController{

  index(req, res){

    const {table, operation, keyvaluesstring} = req.params;
    
    try{
      let keyvalues = KeyvaluesToValues(keyvaluesstring)
      switch (table) {
        case 'File':
          FindOneOperation(File, operation, keyvalues, res);
          break;
        case 'User':
          FindOneOperation(User, operation, keyvalues, res);
          break;
        case 'Series':
          FindOneOperation(Series, operation, keyvalues,res);
          break;
        case 'List':
            FindOneOperation(List, operation, keyvalues, res);
            break;
        case 'View':
            FindOneOperation(View, operation, keyvalues, res);
            break;
        default:
          res.sendStatus(404);
          break;
      }
    } catch(error) {
      console.log('getSeries error: ', error);
    }
  }

  async options(req, res){

    const opt = {
        'Methods' : ['GET','POST','PUT','DELETE'],
        'Tables' : ['File','List','Series','User','Views'],
        'Operations' : {'GET' : ['findOne','findAll']}
    }
    
    // Retornando as informacoes
    return res.json(opt);
  }


}

export default new GetController();
