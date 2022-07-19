import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AtraccionesTuristicasService } from './atracciones-turisticas.service';
import { AtraccionesTuristicasSolicitudDto } from './dto/atracciones-turisticas-solicitud.dto';
import { AtraccionesTuristicasRespuesta } from './entities/atracciones-turisticas-respuesta.entity';
import { AtraccionTuristica } from './entities/atraccion-turistica.entity';
import { IdGoogleSolicitudDto } from './dto/id-google-solicitud.dto';

@Controller('atracciones-turisticas')
export class AtraccionesTuristicasController {
  constructor(
    private readonly atraccionesTuristicasService: AtraccionesTuristicasService,
  ) {}

  @Post('buscar-atracciones-turisticas')
  async buscarAtraccionesTuristicas(
    @Body() atraccionesTuristicasSolicitud: AtraccionesTuristicasSolicitudDto,
  ): Promise<AtraccionesTuristicasRespuesta> {
    return await this.atraccionesTuristicasService.obtenerAtraccionesTuristicasDelDestino(
      atraccionesTuristicasSolicitud,
    );
  }

  @Get('obtener-atraccion-turistica')
  async obtenerAtraccionTuristica(
    @Query() idGoogle: IdGoogleSolicitudDto,
  ): Promise<AtraccionTuristica> {
    return await this.atraccionesTuristicasService.obtenerAtraccionTuristica(
      idGoogle,
    );
  }
}
