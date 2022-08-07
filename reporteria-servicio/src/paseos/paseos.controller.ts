import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { PaseosService } from './paseos.service';
import { CrearPaseoDto } from './dto/crear-paseo.dto';
import { Paseo } from './schemas/paseos.schema';

@Controller('paseos')
export class PaseosController {
  constructor(private readonly paseosService: PaseosService) {}

  @Post('crear-paseo')
  @HttpCode(200)
  async crear(@Body() crearPaseoDto: CrearPaseoDto) {
    return await this.paseosService.crear(crearPaseoDto);
  }

 
  @Get('findAll')
  async findAll(): Promise<Paseo[]> {
    return this.paseosService.findAll();
  }
}
