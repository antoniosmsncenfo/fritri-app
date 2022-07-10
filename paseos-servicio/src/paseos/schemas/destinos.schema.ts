import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DestinoDocument = Destino & Document;

@Schema()
export class Destino {

	@Prop({
		required: true
	})
	nombre: string;

	@Prop({
		required: true
	})
	urlFotosDestino: string[];

	@Prop({
    required: true
  })
	pais: string;

	@Prop({
    required: true,
  })
	idLugarGoogle: string;

	@Prop({
    required: true,
  })
	descripcion: string;

}

export const DestinoSchema = SchemaFactory.createForClass(Destino);