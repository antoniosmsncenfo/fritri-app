import { IsNotEmpty } from 'class-validator';
import { Schema as SchemaM} from 'mongoose';
import { ITipoVoto } from '../interface/tipo-voto';
import { TipoSeccion } from '../interface/votar-seccion';

export class VotarSeccionDto {

  @IsNotEmpty()
  readonly idIntegrante: SchemaM.Types.ObjectId;
  
  @IsNotEmpty()
  readonly idPaseo: string;
  
  @IsNotEmpty()
  readonly idSecciones: ITipoVoto[];

  @IsNotEmpty()
  readonly tipoSeccion: TipoSeccion;
}