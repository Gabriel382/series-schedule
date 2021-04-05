import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', 'public', 'uploads'),
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      var fileName = file.originalname.split('-');
      cb(null, uniqueSuffix + '-' + fileName[1]);
    }
  }),
};
