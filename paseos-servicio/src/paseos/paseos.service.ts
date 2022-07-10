import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException } from  '@nestjs/common';
import { Paseo, PaseoDocument } from './schemas/paseos.schema';

@Injectable()
export class PaseosService {
  constructor(
    @InjectModel(Paseo.name) private readonly paseoModel: Model<PaseoDocument>,
  ) {}

  async crearPaseo() {
    return 'crear paseo';
  }
}
