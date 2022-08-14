import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DestinosModule } from './destinos/destinos.module';
import { GoogleApiService } from './google-api/google-api.service';
import { LugaresGoogleModule } from './lugares-google/lugares-google.module';
import { HttpModule } from '@nestjs/axios';
import { EstadisticasService } from './estadisticas/estadisticas.service';
import { UsuariosService } from './usuarios/usuarios.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DestinosModule,
    LugaresGoogleModule,
    HttpModule,
  ],
  controllers: [],
  providers: [GoogleApiService, EstadisticasService, UsuariosService],
})
export class AppModule {}
