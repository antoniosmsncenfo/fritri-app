import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DestinoDocument = Destino & Document;

@Schema()
export class Destino {
  @Prop({
    required: true,
  })
  fecha: Date;

  @Prop({
    required: true,
  })
  nombre: string;

  @Prop({
    required: true,
  })
  tipo: string;

  @Prop({
    required: true,
  })
  paisDestino: string;

  @Prop({
    required: true,
  })
  estadoDestino: string;

  @Prop({
    required: true,
  })
  paisUsuario: string;

  @Prop({
    required: true,
  })
  idLugarGoogle: string;

  @Prop({
    required: true,
  })
  idUsuario: string;
}

export const DestinoSchema = SchemaFactory.createForClass(Destino);
