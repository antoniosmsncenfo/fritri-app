import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Lugar } from './lugares.schema';

export type SeccionRestaurantesDocument = SeccionRestaurantes & Document;

@Schema()
export class SeccionRestaurantes {

	@Prop({
		required: true
	})
	esFinalizadasVotaciones: boolean;

  @Prop()
	fechaFinalizacionVotaciones: Date;

	@Prop({
		required: true
	})
	restaurantes: Lugar[];

}

export const SeccionRestaurantesSchema = SchemaFactory.createForClass(SeccionRestaurantes);
