import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { LugaresGoogleService } from './lugares-google.service';
import { LugaresGoogleSolicitudDto } from './dto/lugares-google-solicitud.dto';
import { LugarGoogleRespuesta } from './entities/lugar-google-respuesta.entity';
import { LugarGoogle } from './entities/lugar-google.entity';
import { IdGoogleSolicitudDto } from './dto/id-google-solicitud.dto';

@Controller('lugares-google')
export class LugaresGoogleController {
  constructor(private readonly lugaresGoogleService: LugaresGoogleService) {}

  @Post('buscar-lugares')
  @HttpCode(200)
  async buscarLugares(
    @Body() lugarGoogleSolicitud: LugaresGoogleSolicitudDto,
  ): Promise<LugarGoogleRespuesta> {
    return await this.lugaresGoogleService.obtenerLugaresGoogleDelDestino(
      lugarGoogleSolicitud,
    );
  }

  @Get('obtener-lugar')
  async obtenerLugar(
    @Query() idGoogle: IdGoogleSolicitudDto,
  ): Promise<LugarGoogle> {
    return await this.lugaresGoogleService.obtenerLugarGoogle(idGoogle);
  }
}
