import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsuarioDocument = Usuario & Document;

@Schema()
export class Usuario {

	@Prop({
		required: true,
		enum: ['Google', 'Facebook', 'Email']
	})
	tipoLogin: string;

	@Prop()
	correoElectronico: string;

	@Prop({
		required: true,
	})
	contrasena: Date;

	@Prop({
		required: true,
	})
	nombre: string;

	@Prop({
		required: true,
	})
	apellidos: string;

	@Prop()
	urlFoto: string;

	@Prop({
		required: true,
	})
	genero: string;

	@Prop({
		required: true,
	})
	pais: string;

	@Prop({
		required: true,
		default: new Date()
	})
	fechaCreacion: Date;
}


export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
