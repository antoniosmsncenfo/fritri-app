import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaseosModule } from './paseos/paseos.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { VotacionesModule } from './votaciones/votaciones.module';
import { NotificacionesService } from './notificaciones/notificaciones.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { EstadisticasService } from './estadisticas/estadisticas.service';
import { UsuariosService } from './usuarios/usuarios.service';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB),
    PaseosModule,
    VotacionesModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    NotificacionesService,
    EstadisticasService,
    UsuariosService,
  ],
})
export class AppModule {}
