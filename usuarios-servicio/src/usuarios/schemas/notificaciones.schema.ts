import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificacionDocument = Notificacion & Document;

@Schema()
export class Notificacion {

	@Prop({
		required: true,
	})
	idUsuario: string;

	@Prop()
	idPaseo: string;

	@Prop({
		required: true,
	})
	titulo: string;

	@Prop({
		required: true,
	})
	detalle: string;

    @Prop({
		required: true,
		default: false
	})
	esLeida: boolean;

    @Prop({
		required: true,
		default: false
	})
	esArchivada: boolean;

	@Prop({
		required: true,
		default: () => new Date() 
	})
	fechaCreacion: Date;

    @Prop({
		required: true,
		default: () => new Date() 
	})
	fechaModificacion: Date;
}


export const NotificacionSchema = SchemaFactory.createForClass(Notificacion);