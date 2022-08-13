import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DestinosModule } from './destinos/destinos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PaseosModule } from './paseos/paseos.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGO_DB || 'mongodb://localhost:27017/Estadisticas_FriTri',
    ),
    PaseosModule,
    DestinosModule,
    UsuariosModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
