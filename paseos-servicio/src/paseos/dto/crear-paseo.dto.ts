import { IsNotEmpty } from 'class-validator';
import { Destino } from '../schemas/destinos.schema';
import { SeccionRestaurantes } from '../schemas/secciones-restaurantes.schema';
import { SeccionAtraccionesTuristicas } from '../schemas/secciones-atracciones-turisticas.schema';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearPaseoDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  readonly idPaseo?: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly idCreador: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly nombre: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly fechaPaseo: Date;

  @ApiProperty()
  @IsNotEmpty()
  readonly esCompartido: boolean;

  @ApiProperty()
  @IsNotEmpty()
  readonly destino: Destino;

  @ApiProperty()
  @IsNotEmpty()
  readonly seccionRestaurantes: SeccionRestaurantes;

  @ApiProperty()
  @IsNotEmpty()
  readonly seccionAtraccionesTuristicas: SeccionAtraccionesTuristicas;
}
