import { Restaurante } from './restaurante.entity';

export class RestauranteRespuesta {
  lugaresGoogle: Restaurante[];
  tokenPaginacion: string;
}
