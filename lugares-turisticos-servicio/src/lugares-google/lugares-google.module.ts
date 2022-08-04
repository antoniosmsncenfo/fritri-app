import { Module } from '@nestjs/common';
import { LugaresGoogleService } from './lugares-google.service';
import { LugaresGoogleController } from './lugares-google.controller';
import { GoogleApiService } from '../google-api/google-api.service';

@Module({
  controllers: [LugaresGoogleController],
  providers: [LugaresGoogleService, GoogleApiService],
})
export class LugaresGoogleModule {}
