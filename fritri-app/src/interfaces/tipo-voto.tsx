export interface ITipoVoto {
  tipoVoto: string;
  posicion: number;
}

export interface ITipoVotoEnviar {
  tipoVoto: string;
  idLugar: string;
}

export enum TipoSeccion {
  RESTAURANTE = 'RESTAURANTE',
  ATRACCION_TURISTICA = 'ATRACCION_TURISTICA' 
}
