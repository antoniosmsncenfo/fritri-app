import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Destino, DestinoDocument } from './schemas/destino.schema';
import { DestinoSolicitudDto } from './dto/crearDestino';

@Injectable()
export class DestinosService {
  constructor(
    @InjectModel(Destino.name)
    private readonly destinoModel: Model<DestinoDocument>,
  ) {}

  //  constructor(
  //   @InjectModel(Paseo.name) private readonly paseoModel: Model<PaseoDocument>,
  // ) {}
  async create(crearDestino: DestinoSolicitudDto) {
    let resultado;
    try {
      resultado = await this.destinoModel.create(crearDestino);
    } catch (error) {
      throw new BadRequestException(
        `Error al tratar de crear estadística de destino::${error.message}`,
      );
    }
    return resultado;
  }

  async findAll(): Promise<Destino[]> {
    return this.destinoModel.find().exec();
  }
}
