import { Module } from '@nestjs/common';
import { LugaresGoogleService } from './lugares-google.service';
import { LugaresGoogleController } from './lugares-google.controller';
import { GoogleApiService } from '../google-api/google-api.service';
import { EstadisticasService } from '../estadisticas/estadisticas.service';
import { HttpModule } from '@nestjs/axios';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Module({
  controllers: [LugaresGoogleController],
  imports: [HttpModule],
  providers: [
    LugaresGoogleService,
    GoogleApiService,
    EstadisticasService,
    UsuariosService,
  ],
})
export class LugaresGoogleModule {}
