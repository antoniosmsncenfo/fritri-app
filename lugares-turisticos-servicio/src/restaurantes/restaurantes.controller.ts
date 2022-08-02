import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { LugaresGoogleService } from '../lugares-google/lugares-google.service';
import { LugaresGoogleSolicitudDto } from '../lugares-google/dto/lugares-google-solicitud.dto';
import { LugarGoogleRespuesta } from '../lugares-google/entities/lugar-google-respuesta.entity';
import { LugarGoogle } from '../lugares-google/entities/lugar-google.entity';
import { IdGoogleSolicitudDto } from '../lugares-google/dto/id-google-solicitud.dto';

@Controller('restaurantes')
export class RestaurantesController {
  constructor(private readonly restaurantesService: LugaresGoogleService) {}

  @Post('buscar-restaurantes')
  @HttpCode(200)
  async buscarRestaurantes(
    @Body() restauranteSolicitud: LugaresGoogleSolicitudDto,
  ): Promise<LugarGoogleRespuesta> {
    return await this.restaurantesService.obtenerLugaresGoogleDelDestino(
      restauranteSolicitud,
    );
  }

  @Get('obtener-restaurante')
  async obtenerRestaurante(
    @Query() idGoogle: IdGoogleSolicitudDto,
  ): Promise<LugarGoogle> {
    return await this.restaurantesService.obtenerLugarGoogle(idGoogle);
  }
}
