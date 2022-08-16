import { IsNotEmpty } from 'class-validator';
import { TipoSeccion } from '../schemas/paseos.schema';

export class CerrarSeccionDto {
  
  @IsNotEmpty()
  readonly idPaseo: string;

  @IsNotEmpty()
  readonly tipoSeccion: TipoSeccion;

  @IsNotEmpty()
  readonly cerrarVotaciones: boolean;

  @IsNotEmpty()
  readonly fechaModificacion: Date;
}