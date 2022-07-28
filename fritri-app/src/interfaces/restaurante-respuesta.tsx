import { ILugarGoogle } from './lugar-google';

export interface RestauranteRespuesta {
    restaurantes: ILugarGoogle[];
    tokenPaginacion: string;
}
