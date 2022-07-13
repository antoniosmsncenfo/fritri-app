import { IsNotEmpty } from 'class-validator';
import { Destino } from "../schemas/destinos.schema";
import { SeccionRestaurantes } from "../schemas/secciones-restaurantes.schema";
import { SeccionAtraccionesTuristicas } from '../schemas/secciones-atracciones-turisticas.schema';

export class CrearPaseoDto {

  readonly idPaseo?: string;

  @IsNotEmpty()
  readonly idCreador: string;
  
  @IsNotEmpty()
  readonly nombre: string;
  
  @IsNotEmpty()
  readonly fechaPaseo: Date;
  
  @IsNotEmpty()
  readonly esCompartido: boolean;
  
  @IsNotEmpty()
  readonly destino: Destino;
  
  @IsNotEmpty()
  readonly seccionRestaurantes: SeccionRestaurantes;
  
  @IsNotEmpty()
  readonly seccionAtraccionesTuristicas: SeccionAtraccionesTuristicas;
}