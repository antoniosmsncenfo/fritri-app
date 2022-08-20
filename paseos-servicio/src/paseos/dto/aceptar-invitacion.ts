import { IsNotEmpty } from 'class-validator';

export class AceptarInvitacionDto {
  
  @IsNotEmpty()
  readonly idUsuario: string;

  @IsNotEmpty()
  readonly idPaseo: string;

}