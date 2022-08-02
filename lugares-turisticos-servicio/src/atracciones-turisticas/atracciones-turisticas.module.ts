import { Module } from '@nestjs/common';
import { AtraccionesTuristicasController } from './atracciones-turisticas.controller';
import { GoogleApiService } from '../google-api/google-api.service';
import { LugaresGoogleService } from '../lugares-google/lugares-google.service';

@Module({
  controllers: [AtraccionesTuristicasController],
  providers: [LugaresGoogleService, GoogleApiService],
})
export class AtraccionesTuristicasModule {}
