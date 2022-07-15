import { AtraccionTuristica } from './atraccion-turistica.entity';

export class AtraccionesTuristicasRespuesta {
  atraccionesTuristicas: AtraccionTuristica[];
  tokenPaginacion: string;
}
