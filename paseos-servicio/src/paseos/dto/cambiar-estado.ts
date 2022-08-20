import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EstadoPaseo } from '../schemas/paseos.schema';

export class CambiarEstadoDto {
  
    @ApiProperty()
    @IsNotEmpty()
    readonly idPaseo: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly estadoPaseo: EstadoPaseo;
    
}