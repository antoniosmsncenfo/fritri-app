import { Controller, Get, Param, Query } from '@nestjs/common';
import { DestinosService } from './destinos.service';
import { DestinoSolicitudDto } from './dto/destino-solicitud.dto';
import { IdGoogleSolicitudDto } from './dto/id-google-solicitud.dto';
import { DestinoPorCoordenadasSolicitudDto } from './dto/destino-por-ubicacion-solicitud.dto';

@Controller('destinos')
export class DestinosController {
  constructor(private readonly destinosService: DestinosService) {}

  @Get('buscar-destinos')
  async buscarDestinos(@Query() destinoDto: DestinoSolicitudDto) {
    return await this.destinosService.buscarDestinos(destinoDto);
  }

  @Get('buscar-destinos-coordenadas')
  async buscarDestinosCoordenadas(
    @Query() destinoDto: DestinoPorCoordenadasSolicitudDto,
  ) {
    return await this.destinosService.buscarDestinosPorCoordenadas(destinoDto);
  }

  @Get('obtener-destino')
  async obternerDestino(@Query() idGoogle: IdGoogleSolicitudDto) {
    return await this.destinosService.obtenerDestino(idGoogle);
  }
}
