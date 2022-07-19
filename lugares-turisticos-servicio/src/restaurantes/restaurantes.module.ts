import { Module } from '@nestjs/common';
import { RestaurantesService } from './restaurantes.service';
import { RestaurantesController } from './restaurantes.controller';
import { GoogleApiService } from '../google-api/google-api.service';

@Module({
  controllers: [RestaurantesController],
  providers: [RestaurantesService, GoogleApiService],
})
export class RestaurantesModule {}
