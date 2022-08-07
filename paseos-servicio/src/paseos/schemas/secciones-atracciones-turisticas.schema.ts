import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Lugar } from './lugares.schema';

export type SeccionAtraccionesTuristicasDocument =
  SeccionAtraccionesTuristicas & Document;

@Schema()
export class SeccionAtraccionesTuristicas {
  @ApiProperty()
  @Prop({
    required: true,
  })
  esFinalizadasVotaciones: boolean;

  @ApiProperty()
  @Prop()
  fechaFinalizacionVotaciones: Date;

  @ApiProperty()
  @Prop({
    required: true,
  })
  atraccionesturisticas: Lugar[];
}

export const SeccionAtraccionesTuristicasSchema = SchemaFactory.createForClass(
  SeccionAtraccionesTuristicas,
);
