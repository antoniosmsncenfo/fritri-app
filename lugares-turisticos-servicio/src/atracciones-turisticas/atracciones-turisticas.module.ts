import { Module } from '@nestjs/common';
import { AtraccionesTuristicasService } from './atracciones-turisticas.service';
import { AtraccionesTuristicasController } from './atracciones-turisticas.controller';

@Module({
  controllers: [AtraccionesTuristicasController],
  providers: [AtraccionesTuristicasService],
})
export class AtraccionesTuristicasModule {}
