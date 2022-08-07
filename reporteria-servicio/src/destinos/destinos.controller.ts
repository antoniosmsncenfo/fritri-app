import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { DestinosService } from './destinos.service';
import { DestinoSolicitudDto } from './dto/crearDestino';
import { Destino, DestinoDocument } from './schemas/destino.schema';

@Controller('destinos')
export class DestinosController {
  constructor(private readonly destinosService: DestinosService) {}

  @Post('crear-destinos')
  @HttpCode(200)
  async create(@Body() crearDestinoosDto:DestinoSolicitudDto ) {
    return await this.destinosService.create(crearDestinoosDto);
  }

  @Get('findAll')
  async findAll(): Promise<Destino[]> {
    return this.destinosService.findAll();
  }

}
