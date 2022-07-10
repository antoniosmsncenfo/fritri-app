import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import { PaseosService } from './paseos.service';
import { CrearPaseoDto } from './dto/crear-paseo.dto';

@Controller('paseos')
export class PaseosController {
  constructor(private readonly paseosService: PaseosService) {}

  @Post('crear-paseo')
  @HttpCode(200)
  async create() {
    return await this.paseosService.crearPaseo();
  }


}
