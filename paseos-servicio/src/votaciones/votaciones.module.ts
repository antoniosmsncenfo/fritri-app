import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Paseo, PaseoSchema } from '../paseos/schemas/paseos.schema';
import { VotacionesController } from './votaciones.controller';
import { VotacionesService } from './votaciones.service';

@Module({
  imports:  [
    MongooseModule.forFeature([{ name: Paseo.name, schema: PaseoSchema }]),
  ],
  controllers: [VotacionesController],
  providers: [VotacionesService],
})
export class VotacionesModule {}
