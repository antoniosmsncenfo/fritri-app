import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Destino, DestinoSchema } from './schemas/destino.schema';
import { DestinosService } from './destinos.service';
import { DestinosController } from './destinos.controller';
@Module({
  imports:  [
    MongooseModule.forFeature([{ name: Destino.name, schema: DestinoSchema }]),
  ],
  controllers: [DestinosController],
  providers: [DestinosService],
})

export class DestinosModule {}
