import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
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
      if (crearPaseo.idPaseo) {
        resutadoPaseo = await this.paseoModel
          .findOne({ _id: crearPaseo.idPaseo })
          .exec();
      }
      if (!resutadoPaseo) {
        resultado = await this.paseoModel.create(crearPaseo);
      } else {
        throw new Error('Paseo duplicado');
      }
    } catch (error) {
      throw new BadRequestException(
        `Error al tratar de crear el paseo::${error.message}`,
      );
    }
    return resultado;
  }

  async findAll(): Promise<Paseo[]> {
    return this.paseoModel.find().exec();
  }
}
