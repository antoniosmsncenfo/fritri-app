import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DestinosModule } from './destinos/destinos.module';
import { GoogleApiService } from './google-api/google-api.service';
import { LugaresGoogleModule } from './lugares-google/lugares-google.module';

@Module({
  imports: [ConfigModule.forRoot(), DestinosModule, LugaresGoogleModule],
  controllers: [],
  providers: [GoogleApiService],
})
export class AppModule {}
