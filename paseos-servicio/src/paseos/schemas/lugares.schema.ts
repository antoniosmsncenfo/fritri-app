import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Votacion } from './votaciones.schema';

export type LugarDocument = Lugar & Document;

@Schema()
export class Lugar {

	@Prop({
		required: true
	})
	nombre: string;

  @Prop({
		required: true
	})
	urlFotos: string[];

  @Prop({
		required: true
	})
	descripcion: string;

  @Prop()
	rangoPrecios: string;

  @Prop({
		required: true
	})
	idLugarGoogle: string;

  // Votaciones no puede estar requerido ya que cuando se crea no tiene las votaciones
	votaciones: Votacion[];

}
export const LugarSchema = SchemaFactory.createForClass(Lugar);