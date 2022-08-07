import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaseosModule } from './paseos/paseos.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { VotacionesModule } from './votaciones/votaciones.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017/Paseos_FriTri'),
    PaseosModule,
    VotacionesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
