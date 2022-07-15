import { Restaurante } from './restaurante.entity';

export class RestauranteRespuesta {
  restaurantes: Restaurante[];
  tokenPaginacion: string;
}
