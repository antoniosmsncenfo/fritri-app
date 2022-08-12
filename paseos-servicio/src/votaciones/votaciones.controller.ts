import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CerrarSeccionDto } from './dto/cerrar-seccion';
import { VotarSeccionDto } from './dto/votar-seccion';
import { VotacionesService } from './votaciones.service';

@Controller('votaciones')
export class VotacionesController {
  constructor(private readonly votacionesService: VotacionesService) {}

  @Post('votar-seccion')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  async votarSeccion(@Body() votarSeccionDto: VotarSeccionDto) {
    return await this.votacionesService.votarSeccion(votarSeccionDto);
  }

  @Patch('cerrar-seccion')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  async cerrarSeccion(@Body() cerrarSeccionDto: CerrarSeccionDto) {
    return await this.votacionesService.cerrarSeccion(cerrarSeccionDto);
  }


  @Post('quitar-voto-seccion')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  async quitarVotarSeccion(@Body() votarSeccionDto: VotarSeccionDto) {
    return await this.votacionesService.quitarVotoSeccion(votarSeccionDto);
  }

}
