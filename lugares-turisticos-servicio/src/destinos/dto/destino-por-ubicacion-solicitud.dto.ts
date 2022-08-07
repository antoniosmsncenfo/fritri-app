import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class DestinoPorCoordenadasSolicitudDto {
  //@IsNumber()
  @ApiProperty()
  latitud: number;

  @ApiProperty()
  //@IsNumber()
  longitud: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  idioma?: string;
}
