import { ApiProperty } from '@nestjs/swagger';

export class CrearUsuariosDto {
  @ApiProperty()
  readonly idUsuario: string;
  @ApiProperty()
  readonly pais: string;
  @ApiProperty()
  readonly nombreCompleto: string;
  @ApiProperty()
  readonly fechaRegistro: Date;
}
