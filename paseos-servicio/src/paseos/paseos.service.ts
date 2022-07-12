import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException } from  '@nestjs/common';
import { Paseo, PaseoDocument } from './schemas/paseos.schema';
import { CrearPaseoDto } from './dto/crear-paseo.dto';

@Injectable()
export class PaseosService {
  constructor(
    @InjectModel(Paseo.name) private readonly paseoModel: Model<PaseoDocument>,
  ) {}

  async crear(crearPaseo: CrearPaseoDto) {
    let resultado;
    let resutadoPaseo = null;
    try {
      if(crearPaseo.idPaseo) {
        resutadoPaseo = await this.paseoModel.findOne({ _id: crearPaseo.idPaseo }).exec();
      }
      if(!resutadoPaseo) {
        resultado = await this.paseoModel.create(crearPaseo);
      } else {
        throw new Error('Paseo duplicado');
      }
    } catch(error) {
      throw new BadRequestException(`Error al tratar de crear el paseo::${error.message}`);
    }
    return resultado;
  }

  async obtener(idPaseo: string) {
    let resultadoPaseo = null;
    try {
      resultadoPaseo = await this.paseoModel.findOne({ _id: idPaseo, eliminado: false }).exec();
      if(!resultadoPaseo) {
        throw new Error(`No existe el paseo solicitado con el id::${idPaseo}`);
      }
    } catch(error) {
      if(error.message.match(/No existe/)) {
        throw new NotFoundException(`No existe el paseo solicitado con el id::${idPaseo}`)
      }
      throw new BadRequestException(`Error al tratar de obtener el paseo::${error.message}`);
    }
    return resultadoPaseo;
  }

  async actualizar() {
    return 'actualizar paseo';
  }

  async eliminar(idPaseo: string) {
    let resultadoPaseo = null;
    let resultado;
    try {
      resultadoPaseo = await this.paseoModel.findOneAndUpdate({ _id: idPaseo, eliminado: false }, { eliminado: true }, {
        returnOriginal: false
      });
      if(!resultadoPaseo) {
        throw new Error(`No existe el paseo solicitado con el id::${idPaseo}`);
      }
      resultado = {
        statusCode: 200,
        message: `Paseo con el id::${idPaseo} fue eliminado`
      }
    } catch(error) {
      if(error.message.match(/No existe/)) {
        throw new NotFoundException(`No existe el paseo solicitado con el id::${idPaseo} para eliminar`)
      }
      throw new BadRequestException(`Error al tratar de eliminar el paseo::${error.message}`);
    }
    return resultado;
  }
}
