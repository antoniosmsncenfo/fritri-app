import { Module } from '@nestjs/common';
import { DestinosService } from './destinos.service';
import { DestinosController } from './destinos.controller';
import { GoogleApiService } from '../google-api/google-api.service';
import { EstadisticasService } from 'src/estadisticas/estadisticas.service';
import { HttpModule } from '@nestjs/axios';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Module({
  controllers: [DestinosController],
  imports: [HttpModule],
  providers: [
    DestinosService,
    GoogleApiService,
    EstadisticasService,
    UsuariosService,
  ],
})
export class DestinosModule {}
