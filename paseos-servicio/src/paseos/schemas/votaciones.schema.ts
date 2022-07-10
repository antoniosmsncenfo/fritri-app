import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type VotacionDocument = Votacion & Document;

@Schema()
export class Votacion {
  
  @Prop({
    required: true,
  })
	idVotante: ObjectId;

  @Prop({
    required: true,
  })
	fecha: Date;

  @Prop({
    required: true,
  })
	resultado: Boolean;

}
export const VotacionSchema = SchemaFactory.createForClass(Votacion);