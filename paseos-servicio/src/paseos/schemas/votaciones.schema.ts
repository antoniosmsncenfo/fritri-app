import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as SchemaM } from 'mongoose';

export type VotacionDocument = Votacion & Document;

@Schema()
export class Votacion {
  @ApiProperty()
  @Prop({
    required: true,
  })
  idVotante: SchemaM.Types.ObjectId;

  @ApiProperty()
  @Prop({
    required: true,
  })
  fecha: Date;

  @ApiProperty()
  @Prop({
    required: true,
  })
  resultado: boolean;
}
export const VotacionSchema = SchemaFactory.createForClass(Votacion);
