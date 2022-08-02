export interface ISolicitudLugaresGoogle {
    latitud: number;
    longitud: number;
    radio: number;
    tokenPaginacion: string;
    tipo: TipoLugaresGoogle;
}

export type TipoLugaresGoogle = 'restaurantes' | 'atracciones'
