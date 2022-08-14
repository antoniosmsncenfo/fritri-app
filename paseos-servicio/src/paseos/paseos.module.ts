import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Paseo, PaseoSchema } from './schemas/paseos.schema';
import { PaseosController } from './paseos.controller';
import { PaseosService } from './paseos.service';
import { NotificacionesService } from 'src/notificaciones/notificaciones.service';
import { HttpModule } from '@nestjs/axios';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { EstadisticasService } from '../estadisticas/estadisticas.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Paseo.name, schema: PaseoSchema }]),
    HttpModule,
  ],
  controllers: [PaseosController],
  providers: [
    PaseosService,
    NotificacionesService,
    UsuariosService,
    EstadisticasService,
  ],
})
export class PaseosModule {}
