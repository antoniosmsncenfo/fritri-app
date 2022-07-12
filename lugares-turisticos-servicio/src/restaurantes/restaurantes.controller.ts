import { Controller, Get } from '@nestjs/common';
import { RestaurantesService } from './restaurantes.service';

@Controller('restaurantes')
export class RestaurantesController {
  constructor(private readonly restaurantesService: RestaurantesService) {}
}
