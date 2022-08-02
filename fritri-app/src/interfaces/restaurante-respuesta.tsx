import { ILugarGoogle } from './lugar-google';

export interface ILugarGoogleRespuesta {
    lugaresGoogle: ILugarGoogle[];
    tokenPaginacion: string;
}
