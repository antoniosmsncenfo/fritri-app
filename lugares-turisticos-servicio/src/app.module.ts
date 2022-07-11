import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AtraccionesTuristicasModule } from './atracciones-turisticas/atracciones-turisticas.module';
import { DestinosModule } from './destinos/destinos.module';
import { GoogleApiService } from './google-api/google-api.service';
import { RestaurantesModule } from './restaurantes/restaurantes.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DestinosModule,
    RestaurantesModule,
    AtraccionesTuristicasModule,
  ],
  controllers: [],
  providers: [GoogleApiService],
})
export class AppModule {}
