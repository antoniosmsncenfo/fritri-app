import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Votacion } from './votaciones.schema';

export type LugarDocument = Lugar & Document;

@Schema()
export class Lugar {
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
  descripcion: string;

  @ApiProperty()
  @Prop()
  rangoPrecios: string;

  @ApiProperty()
  @Prop({
    required: true,
  })
  idLugarGoogle: string;

  @ApiPropertyOptional()
  // Votaciones no puede estar requerido ya que cuando se crea no tiene las votaciones
  votaciones: Votacion[];
}
export const LugarSchema = SchemaFactory.createForClass(Lugar);
