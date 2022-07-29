import { ILugarGoogle } from './lugar-google';

export interface LugarGoogleRespuesta {
    restaurantes: ILugarGoogle[];
    tokenPaginacion: string;
}
