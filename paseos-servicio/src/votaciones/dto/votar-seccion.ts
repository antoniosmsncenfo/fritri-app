import { IsNotEmpty } from 'class-validator';
import { Schema as SchemaM} from 'mongoose';

enum TipoSeccion {
  RESTAURANTE = 'RESTAURANTE',
  ATRACCION_TURISTICA = 'ATRACCION_TURISTICA' 
}

export class VotarSeccionDto {

  @IsNotEmpty()
  readonly idIntegrante: SchemaM.Types.ObjectId;
  
  @IsNotEmpty()
  readonly idPaseo: string;
  
  @IsNotEmpty()
  readonly idSecciones: string[];

  @IsNotEmpty()
  readonly tipoSeccion: TipoSeccion;
}