import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

export class IdGoogleSolicitudDto {
  @ApiProperty()
  @IsDefined()
  idGoogle: string;
}
