import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Lugar } from './lugares.schema';

export type SeccionAtraccionesTuristicasDocument = SeccionAtraccionesTuristicas & Document;

@Schema()
export class SeccionAtraccionesTuristicas {

	@Prop({
		required: true
	})
	esFinalizadasVotaciones: boolean;

  @Prop()
	fechaFinalizacionVotaciones: Date;

	@Prop({
		required: true
	})
	atraccionesturisticas: Lugar[];

}

export const SeccionAtraccionesTuristicasSchema = SchemaFactory.createForClass(SeccionAtraccionesTuristicas);
