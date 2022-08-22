import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber } from 'class-validator';

export class CrearPaseoDto {
  @ApiProperty()
  readonly idPaseo: string;
  @ApiProperty()
  readonly idCreador: string;
  @ApiProperty()
  readonly destino: string;
  @ApiProperty()
  @IsDateString()
  readonly fechaCreacion: Date;
  @ApiProperty()
  @IsDateString()
  readonly fechaPaseo: Date;
  @ApiProperty()
  readonly nombrePaseo: string;
  @ApiProperty()
  readonly paisPaseo: string;
  @ApiProperty()
  readonly paisCreador: string;
  @ApiProperty()
  @IsNumber()
  readonly cantidadIntegrantes: number;
  @ApiProperty()
  @IsNumber()
  readonly cantidadRestaurantes: number;
  @ApiProperty()
  @IsNumber()
  readonly cantidadAtracciones: number;
  @ApiProperty()
  @IsNumber()
  latitud: number;
  @ApiProperty()
  @IsNumber()
  longitud: number;
  @ApiProperty()
  readonly esAleatorio: boolean;
}
