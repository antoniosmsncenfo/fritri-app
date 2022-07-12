import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaseosService } from './paseos.service';
import { CrearPaseoDto } from './dto/crear-paseo.dto';

@Controller('paseos')
export class PaseosController {
  constructor(private readonly paseosService: PaseosService) {}

  @Post('crear-paseo')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  async crear(@Body() crearPaseoDto: CrearPaseoDto) {
    return await this.paseosService.crear(crearPaseoDto);
  }

  @Get('obtener-paseo/:idPaseo')
  @HttpCode(200)
  async obtener(@Param('idPaseo') idPaseo: string) {
    return await this.paseosService.obtener(idPaseo);
  }

  @Put('actualizar-paseo')
  @HttpCode(200)
  async actualizar() {
    return await this.paseosService.actualizar();
  }

  @Delete('eliminar-paseo/:idPaseo')
  @HttpCode(200)
  async eliminar(@Param('idPaseo') idPaseo: string) {
    return await this.paseosService.eliminar(idPaseo);
  }

}
