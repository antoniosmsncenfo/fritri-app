import { Controller, Get, Param } from '@nestjs/common';
import { DestinosService } from './destinos.service';
//https://tryapis.com/googlemaps/api/geocode
@Controller('destinos')
export class DestinosController {
  constructor(private readonly destinosService: DestinosService) {}

  @Get('buscar-destinos/:nombre')
  buscarDestinos(@Param('nombre') nombre: string) {
    return this.destinosService.buscarDestinos(nombre);
  }

  @Get('buscar-destino/:id')
  buscarDestino(@Param('id') id: string) {
    return this.destinosService.buscarDestino(id);
  }
}
