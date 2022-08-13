import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Paseo, PaseoSchema } from './schemas/paseos.schema';
import { PaseosController } from './paseos.controller';
import { PaseosService } from './paseos.service';
import { NotificacionesService } from 'src/notificaciones/notificaciones.service';
import { HttpService, HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Paseo.name, schema: PaseoSchema }]),
    HttpModule,
  ],
  controllers: [PaseosController],
  providers: [PaseosService, NotificacionesService],
})
export class PaseosModule {}
