import axios from 'axios';
import api from '../../config/api';
import FormData from 'form-data';
import fs from 'fs';

class FileController {
  async store(req, res) {

    const { originalname: name, filename: path } = req.file;

    // console.log('req.file: ', req.file);

    const form = new FormData();
    form.append('name', `${name}`);
    form.append('path', `${path}`);
    form.append('file', fs.createReadStream(`${req.file.path}`));

    const fileResponse = await axios.post(
      `${api.baseUrl}/table=File`, form, {
        headers: form.getHeaders(),
      }
    );

    // const fileResponse = await axios.post(
    //   `${api.baseUrl}/table=File`,{
    //     name,
    //     path,
    //   }, {
    //     headers: 'Content-Type: multipart/form-data;'
    //   }
    // );

    let file = fileResponse.data;

    return res.json(file);
  }
}

export default new FileController();
