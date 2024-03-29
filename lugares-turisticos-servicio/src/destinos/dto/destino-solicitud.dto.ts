import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

export class DestinoSolicitudDto {
  @ApiProperty()
  @IsDefined()
  nombre: string;

  @ApiProperty()
  @IsDefined()
  idUsuario: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  idioma?: string;
}
