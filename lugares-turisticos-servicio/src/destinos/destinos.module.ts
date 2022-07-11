import { Module } from '@nestjs/common';
import { DestinosService } from './destinos.service';
import { DestinosController } from './destinos.controller';
import { GoogleApiService } from '../google-api/google-api.service';

@Module({
  controllers: [DestinosController],
  providers: [DestinosService, GoogleApiService],
})
export class DestinosModule {}
