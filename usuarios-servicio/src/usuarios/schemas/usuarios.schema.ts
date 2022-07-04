import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsuarioDocument = Usuario & Document;

@Schema()
export class Usuario {

	@Prop({
		required: true,
		enum: ['Google', 'Facebook', 'Email'],
	})
	tipoLogin: string;

	@Prop()
	correoElectronico: string;

	@Prop()
	contrasena: string;

	@Prop({
		required: true,
	})
	nombreCompleto: string;

	@Prop()
	urlFoto: string;

	@Prop()
	genero: string;

	@Prop()
	pais: string;

	@Prop({
		required: true,
		default: new Date()
	})
	fechaCreacion: Date;

	@Prop()
	idTerceros: string;

	@Prop()
	token: string;
}


export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
