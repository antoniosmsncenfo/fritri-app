import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { TipoLugar } from 'src/google-api/google-api.service';

export class LugaresGoogleSolicitudDto {
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

  @ApiProperty({ enum: TipoLugar })
  @IsNotEmpty()
  @IsDefined()
  tipo: TipoLugar;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  idioma?: string;

  @ApiProperty()
  @IsDefined()
  idUsuario: string;
}
