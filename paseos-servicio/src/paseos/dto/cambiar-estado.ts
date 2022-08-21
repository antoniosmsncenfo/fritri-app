import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EstadoFinal } from '../schemas/paseos.schema';

export class CambiarEstadoFinalDto {
  
    @ApiProperty()
    @IsNotEmpty()
    readonly idPaseo: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly estadoFinal: EstadoFinal;
    
}