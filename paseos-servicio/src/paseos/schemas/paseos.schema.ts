import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as SchemaM } from 'mongoose';
import { Destino } from './destinos.schema';
import { SeccionRestaurantes } from './secciones-restaurantes.schema';
import { SeccionAtraccionesTuristicas } from './secciones-atracciones-turisticas.schema';
import { Integrante } from './integrantes.schema';

export type PaseoDocument = Paseo & Document;

export enum TipoSeccion {
	RESTAURANTE = 'RESTAURANTE',
	ATRACCION_TURISTICA = 'ATRACCION_TURISTICA' 
  }

export enum EstadoPaseo {
  PROGRAMADO = 'PROGRAMADO',
  CANCELADO = 'CANCELADO',
  REALIZADO = 'REALIZADO' 
  }

@Schema()
export class Paseo {
  @Prop({
    required: true,
  })
  idCreador: SchemaM.Types.ObjectId;

  @Prop({
    required: true,
  })
  nombre: string;

  @Prop({
    default: () => new Date(),
  })
  fechaCreacion: string;

  @Prop({
    required: true,
  })
  fechaPaseo: Date;

  @Prop()
  pinPaseo: number;

  @Prop({
    default: EstadoPaseo.PROGRAMADO,
  })
  estado: EstadoPaseo;

  @Prop({
    required: true,
  })
  esCompartido: boolean;

  @Prop({
    required: true,
  })
  destino: Destino;

  @Prop({
    required: true,
  })
  seccionRestaurantes: SeccionRestaurantes;

  @Prop({
    required: true,
  })
  seccionAtraccionesTuristicas: SeccionAtraccionesTuristicas;

  @Prop()
  integrantes: Integrante[];

  @Prop({
    default: false,
  })
  eliminado: boolean;

  @Prop({
    default: false,
  })
  esAleatorio: boolean;
}

export const PaseoSchema = SchemaFactory.createForClass(Paseo);
