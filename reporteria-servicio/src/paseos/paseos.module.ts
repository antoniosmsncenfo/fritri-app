import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Paseo, PaseoSchema } from './schemas/paseos.schema';
import { PaseosController } from './paseos.controller';
import { PaseosService } from './paseos.service';

@Module({
  imports:  [
    MongooseModule.forFeature([{ name: Paseo.name, schema: PaseoSchema }]),
  ],
  controllers: [PaseosController],
  providers: [PaseosService],
})
export class PaseosModule {}
