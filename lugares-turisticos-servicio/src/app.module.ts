import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DestinosModule } from './destinos/destinos.module';
import { RestaurantesModule } from './restaurantes/restaurantes.module';
import { AtraccionesTuristicasModule } from './atracciones-turisticas/atracciones-turisticas.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DestinosModule,
    RestaurantesModule,
    AtraccionesTuristicasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
