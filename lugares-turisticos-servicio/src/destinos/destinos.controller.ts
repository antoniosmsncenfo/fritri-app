import { Controller, Get, Param, Query } from '@nestjs/common';
import { DestinosService } from './destinos.service';
//https://tryapis.com/googlemaps/api/geocode
@Controller('destinos')
export class DestinosController {
  constructor(private readonly destinosService: DestinosService) {}

  @Get('buscar-destinos')
  async buscarDestinos(
    @Query('nombre') nombre: string,
    @Query('idioma') idioma?: string, //es opcional
  ) {
    return await this.destinosService.buscarDestinos(nombre, idioma);
  }

  @Get('buscar-destino/:id')
  buscarDestino(@Param('id') id: string) {
    return this.destinosService.buscarDestino(id);
  }
}
