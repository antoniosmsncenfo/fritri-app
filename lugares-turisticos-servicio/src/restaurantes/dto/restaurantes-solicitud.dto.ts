import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class RestaurantesSolicitudDto {
  @IsNumber()
  @ApiProperty()
  latitud: number;

  @ApiProperty()
  @IsNumber()
  longitud: number;

  @ApiProperty()
  @Min(1)
  @IsNumber()
  radio: number;

  @ApiProperty()
  @IsDefined()
  tokenPaginacion: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  idioma?: string;
}
