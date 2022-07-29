import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException } from  '@nestjs/common';
import { Paseo, PaseoDocument } from './schemas/paseos.schema';
import { CrearPaseoDto } from './dto/crear-paseo.dto';
import { ActualizarPaseoDto } from './dto/actualizar-paseo.dto';

export enum EstadoPaseo{
  Pendiente=1,
  Completado=2
}

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

  async obtenerPaseosUsuario(idCreador: string, estado: EstadoPaseo, limite: number) {
    let resultadoPaseo = null;
    let today = new Date();
    today.setHours(0,0,0,0);

    try {
      resultadoPaseo = await this.paseoModel.find({
        idCreador: idCreador,
        fechaPaseo: estado===EstadoPaseo.Pendiente
          ? {$gte: today}
          : {$lt: today},
        eliminado: false},
        null,
        {limit:limite}
      ).exec();

    } catch(error) {
      throw new BadRequestException(`Error al tratar de obtener los paseos del usuario::${error.message}`);
    }
    return resultadoPaseo;
  }  

  async actualizar(actualizarPaseoDto: ActualizarPaseoDto): Promise<Paseo> {
    let resultadoPaseo = null;
    let resultado;
    const idPaseo = actualizarPaseoDto.idPaseo;
    try {
      resultadoPaseo = await this.paseoModel.findOneAndUpdate({ _id: idPaseo, eliminado: false }, actualizarPaseoDto , {
        returnOriginal: false
      });
      if(!resultadoPaseo) {
        throw new Error(`No existe el paseo solicitado con el id::${idPaseo}`);
      }
      resultado = {
        statusCode: 200,
        message: `Paseo con el id::${idPaseo} fue actualizado`,
        data: resultadoPaseo
      }
    } catch(error) {
      if(error.message.match(/No existe/)) {
        throw new NotFoundException(`No existe el paseo solicitado con el id::${idPaseo} para actualizar`)
      }
      throw new BadRequestException(`Error al tratar de eliminar el paseo::${error.message}`);
    }
    return resultado;
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
