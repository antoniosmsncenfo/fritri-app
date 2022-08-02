import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException } from  '@nestjs/common';
import { Paseo, PaseoDocument } from '../paseos/schemas/paseos.schema';
import { VotarSeccionDto } from './dto/votar-seccion';

@Injectable()
export class VotacionesService {
  constructor(
    @InjectModel(Paseo.name) private readonly paseoModel: Model<PaseoDocument>,
  ) {}

  async votarSeccion(votarSeccionDto: VotarSeccionDto) {
    let resultado;
    let resutadoPaseo = null;
    try {
      
    } catch(error) {
      throw new BadRequestException(`Error al tratar de votarSeccion::${error.message}`);
    }
    return resultado;
  }

}
