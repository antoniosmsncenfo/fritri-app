export interface ISolicitudLugaresGoogle {
    latitud: number;
    longitud: number;
    radio: number;
    tokenPaginacion: string;
    tipo: TipoLugaresGoogle;
}

export type TipoLugaresGoogle = 'restaurantes' | 'atracciones'

export interface ISolicitudDestinosPorCoordenadas {
    latitud: number;
    longitud: number;
    idioma?: string;
  }
