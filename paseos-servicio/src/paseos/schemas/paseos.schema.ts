import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Destino } from './destinos.schema';
import { SeccionRestaurantes } from './secciones-restaurantes.schema';
import { SeccionAtraccionesTuristicas } from './secciones-atracciones-turisticas.schema';
import { Integrante } from './integrantes.schema';

export type PaseoDocument = Paseo & Document;

@Schema()
export class Paseo {

	@Prop({
		required: true
	})
	idCreador: ObjectId;

	@Prop({
		required: true
	})
	nombre: string;

	@Prop({
    required: true,
		default: () => new Date()
  })
	fechaCreacion: string;

	@Prop({
    required: true,
  })
	fechaPaseo: string;

	@Prop()
	pinPaseo: number;

	@Prop({
    required: true
  })
	esCompartido: boolean;

	@Prop({
    required: true
  })
	destino: Destino;

  @Prop({
    required: true
  })
	seccionRestaurantes: SeccionRestaurantes;
  
  @Prop({
    required: true
  })
	seccionAtraccionesTuristicas: SeccionAtraccionesTuristicas;

  @Prop()
  integrantes: Integrante[]
}

export const PaseoSchema = SchemaFactory.createForClass(Paseo);
