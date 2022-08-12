import { Lugar } from "src/paseos/schemas/lugares.schema";

export interface IResultadoExiste {
  lugaresAVotar: Lugar[],
  prop: string,
  propPaseo: string,
}

export enum TipoSeccion {
  RESTAURANTE = 'RESTAURANTE',
  ATRACCION_TURISTICA = 'ATRACCION_TURISTICA' 
}