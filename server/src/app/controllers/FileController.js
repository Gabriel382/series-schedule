import axios from 'axios';
import api from '../../config/api';
import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    console.log('req.file: ', req.file);

    const fileResponse = await File.create({
      name,
      path,
    });

    let file = fileResponse.data;

    return res.json(file);
  }
}

export default new FileController();
