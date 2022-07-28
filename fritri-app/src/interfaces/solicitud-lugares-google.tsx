export interface ISolicitudLugaresGoogle {
    latitud: number;
    longitud: number;
    radio: number;
    tokenPaginacion: string;
    tipo: 'restaurantes' | 'atracciones';
}
