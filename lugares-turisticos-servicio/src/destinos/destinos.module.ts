import { Module } from '@nestjs/common';
import { DestinosService } from './destinos.service';
import { DestinosController } from './destinos.controller';

@Module({
  controllers: [DestinosController],
  providers: [DestinosService],
})
export class DestinosModule {}
