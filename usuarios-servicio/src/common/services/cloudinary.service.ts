import * as cloudinary from 'cloudinary';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
  }

  async subirImagen(imagen, borrarArchivo = true) {
    try {
      const rutaImagen = imagen['path'];
      const upload = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(rutaImagen, { folder: process.env.FOLDER_PASEOS_TEST }, (error, result) => {
          if(error) reject(error);
          resolve(result);
        })
      });
      if(borrarArchivo) {
        fs.unlinkSync(rutaImagen);
      }
      return upload;
    } catch(error) {
      console.error('Error en servicio de cloudinary::', error);
      throw error;
    }
  }

  async eliminarImagen(filePublicId) {
    try {
      const upload = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.destroy(filePublicId, (error, result) => {
          if(error) reject(error);
          resolve(result);
        })
      });
      return upload;
    } catch(error) {
      console.error('Error on cloudinary service::', error);
      throw error;
    }
  }
}
