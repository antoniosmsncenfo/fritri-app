import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { IdGoogleSolicitudDto } from 'src/lugares-google/dto/id-google-solicitud.dto';
import { LugaresGoogleSolicitudDto } from 'src/lugares-google/dto/lugares-google-solicitud.dto';
import { LugarGoogle } from 'src/lugares-google/entities/lugar-google.entity';
import { LugaresGoogleService } from 'src/lugares-google/lugares-google.service';
import { LugarGoogleRespuesta } from '../lugares-google/entities/lugar-google-respuesta.entity';

@Controller('atracciones-turisticas')
export class AtraccionesTuristicasController {
  constructor(
    private readonly atraccionesTuristicasService: LugaresGoogleService,
  ) {}

  @Post('buscar-atracciones-turisticas')
  async buscarAtraccionesTuristicas(
    @Body() atraccionesTuristicasSolicitud: LugaresGoogleSolicitudDto,
  ): Promise<LugarGoogleRespuesta> {
    return await this.atraccionesTuristicasService.obtenerLugaresGoogleDelDestino(
      atraccionesTuristicasSolicitud,
    );
  }

  @Get('obtener-atraccion-turistica')
  async obtenerAtraccionTuristica(
    @Query() idGoogle: IdGoogleSolicitudDto,
  ): Promise<LugarGoogle> {
    return await this.atraccionesTuristicasService.obtenerLugarGoogle(idGoogle);
  }
}
