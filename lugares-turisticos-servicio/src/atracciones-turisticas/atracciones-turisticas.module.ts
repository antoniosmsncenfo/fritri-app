import { Module } from '@nestjs/common';
import { AtraccionesTuristicasService } from './atracciones-turisticas.service';
import { AtraccionesTuristicasController } from './atracciones-turisticas.controller';
import { GoogleApiService } from '../google-api/google-api.service';

@Module({
  controllers: [AtraccionesTuristicasController],
  providers: [AtraccionesTuristicasService, GoogleApiService],
})
export class AtraccionesTuristicasModule {}
