import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type DestinoDocument = Destino & Document;

@Schema()
export class Destino {
  @ApiProperty()
  @Prop({
    required: true,
  })
  nombre: string;

  @ApiProperty()
  @Prop({
    required: true,
  })
  urlFotos: string[];

  @ApiProperty()
  @Prop({
    required: true,
  })
  pais: string;

  @ApiProperty()
  @Prop({
    required: true,
  })
  idLugarGoogle: string;

  @ApiProperty()
  @Prop({
    required: true,
  })
  descripcion: string;
}

export const DestinoSchema = SchemaFactory.createForClass(Destino);
