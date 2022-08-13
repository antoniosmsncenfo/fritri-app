import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaseosModule } from './paseos/paseos.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { VotacionesModule } from './votaciones/votaciones.module';
import { NotificacionesService } from './notificaciones/notificaciones.service';
import { HttpModule, HttpService } from '@nestjs/axios';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017/Paseos_FriTri'),
    PaseosModule,
    VotacionesModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService, NotificacionesService],
})
export class AppModule {}
