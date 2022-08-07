import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {  DestinosModule } from './destinos/destinos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PaseosModule } from './paseos/paseos.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017/Reporteria_Fritri'),
    PaseosModule,
    DestinosModule,
    UsuariosModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
