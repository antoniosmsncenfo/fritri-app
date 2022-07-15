import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { RestaurantesService } from './restaurantes.service';
import { RestaurantesSolicitudDto } from './dto/restaurantes-solicitud.dto';
import { ApiBody } from '@nestjs/swagger';
import { RestauranteRespuesta } from './entities/restaurante-respuesta.entity';
import { Restaurante } from './entities/restaurante.entity';
import { IdGoogleSolicitudDto } from './dto/id-google-solicitud.dto';

@Controller('restaurantes')
export class RestaurantesController {
  constructor(private readonly restaurantesService: RestaurantesService) {}

  @Post('buscar-restaurantes')
  async buscarRestaurantes(
    @Body() restauranteSolicitud: RestaurantesSolicitudDto,
  ): Promise<RestauranteRespuesta> {
    return await this.restaurantesService.obtenerRestaurantesDelDestino(
      restauranteSolicitud,
    );
  }

  @Get('obtener-restaurante')
  async obtenerRestaurante(
    @Query() idGoogle: IdGoogleSolicitudDto,
  ): Promise<Restaurante> {
    return await this.restaurantesService.obtenerRestaurante(idGoogle);
  }
}
