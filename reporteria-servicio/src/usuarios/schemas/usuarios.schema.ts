import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsuarioDocument = Usuario & Document;

@Schema()
export class Usuario {


	  @Prop({
		required: true,
	  })
	  pais: string;


	  @Prop({
		required: true,
	  })
	  nombreCompleto: string;

	@Prop({
		required: true,
	  })
	  fechaRegistro: Date;
	
	
}


export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
