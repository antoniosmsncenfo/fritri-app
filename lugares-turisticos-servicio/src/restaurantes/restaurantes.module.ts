import { Module } from '@nestjs/common';
import { LugaresGoogleService } from '../lugares-google/lugares-google.service';
import { RestaurantesController } from './restaurantes.controller';
import { GoogleApiService } from '../google-api/google-api.service';

@Module({
  controllers: [RestaurantesController],
  providers: [LugaresGoogleService, GoogleApiService],
})
export class RestaurantesModule {}
