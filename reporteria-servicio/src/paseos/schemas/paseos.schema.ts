import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as SchemaM } from 'mongoose';

export type PaseoDocument = Paseo & Document;

@Schema()
export class Paseo {
	@Prop({
		required: true,
	  })
	  idCreador: string;
	
	@Prop({
		required: true,
	  })
	  fechaCreacion: Date;

	  	
	@Prop({
		required: true,
	  })
	  fechaPaseo: Date;
	

	  @Prop({
		required: true,
	  })
	  nombrePaseo: string;
	

	  @Prop({
		required: true,
	  })
	  paisPaseo: string;


	  @Prop({
		required: true,
	  })
	  paisCreador: string;


	  @Prop({
		required: true,
	  })
	  cantidadIntegrantes: string;
	
	  @Prop({
		required: true,
	  })
	  cantidadRestaurantes: string;

	  @Prop({
		required: true,
	  })
	  cantidadAtracciones: string;

}

export const PaseoSchema = SchemaFactory.createForClass(Paseo);
