import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsDefined, IsNotEmpty } from 'class-validator';

export class DestinoSolicitudDto {
  @ApiProperty()
  @IsDateString()
  @IsDefined()
  @IsNotEmpty()
  readonly fecha: Date;

  @IsDefined()
  @ApiProperty()
  @IsNotEmpty()
  readonly nombre: string;

  @IsDefined()
  @ApiProperty()
  @IsNotEmpty()
  readonly tipo: string;

  @IsDefined()
  @ApiProperty()
  @IsNotEmpty()
  readonly paisDestino: string;

  @IsDefined()
  @ApiProperty()
  @IsNotEmpty()
  readonly estadoDestino: string;

  @IsDefined()
  @ApiProperty()
  @IsNotEmpty()
  readonly paisUsuario: string;

  @IsDefined()
  @ApiProperty()
  @IsNotEmpty()
  readonly idLugarGoogle: string;

  @IsDefined()
  @ApiProperty()
  @IsNotEmpty()
  readonly idUsuario: string;
}
