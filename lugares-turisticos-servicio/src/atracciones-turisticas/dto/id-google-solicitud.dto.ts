import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

export class IdGoogleSolicitudDto {
  @ApiProperty()
  @IsDefined()
  idGoogle: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  idioma?: string;
}
