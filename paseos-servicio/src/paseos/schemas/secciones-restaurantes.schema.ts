import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Lugar } from './lugares.schema';

export type SeccionRestaurantesDocument = SeccionRestaurantes & Document;

@Schema()
export class SeccionRestaurantes {
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
  restaurantes: Lugar[];
}

export const SeccionRestaurantesSchema =
  SchemaFactory.createForClass(SeccionRestaurantes);
