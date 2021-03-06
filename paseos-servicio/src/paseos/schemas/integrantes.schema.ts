import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as SchemaM} from 'mongoose';

export type IntegranteDocument = Integrante & Document;

@Schema()
export class Integrante {

	@Prop({
		required: true
	})
	idIntegrante: SchemaM.Types.ObjectId;

  @Prop({
    required: true
  })
	fechaIntegracion: Date;

	@Prop({
		required: true
	})
	esConfirmadaAsistencia: boolean;

}


export const IntegranteSchema = SchemaFactory.createForClass(Integrante);
