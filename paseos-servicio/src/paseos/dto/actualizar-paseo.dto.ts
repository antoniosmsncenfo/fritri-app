import { IsNotEmpty } from 'class-validator';
import { Destino } from '../schemas/destinos.schema';
import { SeccionRestaurantes } from '../schemas/secciones-restaurantes.schema';
import { SeccionAtraccionesTuristicas } from '../schemas/secciones-atracciones-turisticas.schema';
import { ApiProperty } from '@nestjs/swagger';

export class ActualizarPaseoDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly idPaseo: string;

  @ApiProperty()
  readonly nombre: string;

  @ApiProperty()
  readonly fechaPaseo: Date;

  @ApiProperty()
  readonly esCompartido: boolean;

  @ApiProperty()
  readonly destino: Destino;

  @ApiProperty()
  readonly seccionRestaurantes: SeccionRestaurantes;

  @ApiProperty()
  readonly seccionAtraccionesTuristicas: SeccionAtraccionesTuristicas;
}
