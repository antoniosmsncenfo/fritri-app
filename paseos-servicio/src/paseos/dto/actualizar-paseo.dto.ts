import { IsNotEmpty } from 'class-validator';
import { Destino } from "../schemas/destinos.schema";
import { SeccionRestaurantes } from "../schemas/secciones-restaurantes.schema";
import { SeccionAtraccionesTuristicas } from '../schemas/secciones-atracciones-turisticas.schema';

export class ActualizarPaseoDto {

  @IsNotEmpty()
  readonly idPaseo: string;

  readonly nombre: string;
  
  readonly fechaPaseo: Date;
  
  readonly esCompartido: boolean;
  
  readonly destino: Destino;
  
  readonly seccionRestaurantes: SeccionRestaurantes;
  
  readonly seccionAtraccionesTuristicas: SeccionAtraccionesTuristicas;
}