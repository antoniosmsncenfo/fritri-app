import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as SchemaM } from 'mongoose';

export type PaseoDocument = Paseo & Document;

@Schema()
export class Paseo {
  @Prop({
    required: true,
  })
  idPaseo: string;

  @Prop({
    required: true,
  })
  idCreador: string;

  @Prop({
    required: true,
  })
  destino: string;

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
  cantidadIntegrantes: number;

  @Prop({
    required: true,
  })
  cantidadRestaurantes: number;

  @Prop({
    required: true,
  })
  cantidadAtracciones: number;

  @Prop({
    required: true,
  })
  latitud: number;

  @Prop({
    required: true,
  })
  longitud: number;
}

export const PaseoSchema = SchemaFactory.createForClass(Paseo);
