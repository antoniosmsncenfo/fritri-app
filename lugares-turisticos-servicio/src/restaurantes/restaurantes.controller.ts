import { Body, Controller, Get, Post } from '@nestjs/common';
import { RestaurantesService } from './restaurantes.service';
import { RestauranteSolicitudDto } from './dto/restaurante-solicitud.dto';
import { ApiBody } from '@nestjs/swagger';
import { RestauranteRespuesta } from './entities/restaurante-respuesta.entity';

@Controller('restaurantes')
export class RestaurantesController {
  constructor(private readonly restaurantesService: RestaurantesService) {}

  @ApiBody({ type: RestauranteSolicitudDto })
  @Post('buscar-restaurantes')
  async buscarRestaurantes(
    @Body() restauranteSolicitud: RestauranteSolicitudDto,
  ): Promise<RestauranteRespuesta> {
    return await this.restaurantesService.obtenerRestaurantesDelDestino(
      restauranteSolicitud,
    );
  }
}
