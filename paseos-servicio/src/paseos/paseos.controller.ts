import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PaseosService, EstadoPaseo } from './paseos.service';
import { CrearPaseoDto } from './dto/crear-paseo.dto';
import { ActualizarPaseoDto } from './dto/actualizar-paseo.dto';
import { Paseo } from './schemas/paseos.schema';
import { CerrarSeccionDto } from './dto/cerrar-seccion';
import { AceptarInvitacionDto } from './dto/aceptar-invitacion';
import { CambiarEstadoFinalDto } from './dto/cambiar-estado';

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

  @Patch('proteger-paseo/:idPaseo')
  @HttpCode(200)
  async proteger(@Param('idPaseo') idPaseo: string) {
    return await this.paseosService.proteger(idPaseo);
  }

  @Patch('remover-pin-paseo/:idPaseo')
  @HttpCode(200)
  async removerPin(@Param('idPaseo') idPaseo: string) {
    return await this.paseosService.removerPin(idPaseo);
  }  

  @Patch('cambiar-estado-final')
  @HttpCode(200)
  async cambiarEstadoFinal(@Body() cambiarEstadoFinalDto: CambiarEstadoFinalDto) {
    return await this.paseosService.cambiarEstadoFinal(cambiarEstadoFinalDto);
  }

  @Get('obtener-paseos-usuario')
  @HttpCode(200)
  async obtenerPaseosUsuario(
    @Query('idCreador') idCreador: string,
    @Query('estado') estado: EstadoPaseo,
    @Query('limite') limite: number,
  ): Promise<Paseo[]> {
    return this.paseosService.obtenerPaseosUsuario(idCreador, estado, limite);
  }

  @Put('actualizar-paseo')
  @HttpCode(200)
  async actualizar(@Body() actualizarPaseoDto: ActualizarPaseoDto) {
    return await this.paseosService.actualizar(actualizarPaseoDto);
  }

  @Patch('cerrar-seccion')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  async cerrarSeccion(@Body() cerrarSeccionDto: CerrarSeccionDto) {
    return await this.paseosService.cerrarSeccion(cerrarSeccionDto);
  }

  @Delete('eliminar-paseo/:idPaseo')
  @HttpCode(200)
  async eliminar(@Param('idPaseo') idPaseo: string) {
    return await this.paseosService.eliminar(idPaseo);
  }

  @Post('aceptar-invitacion')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  async aceptarInvitacion(@Body() aceptarInvitaionDto: AceptarInvitacionDto) {
    return await this.paseosService.aceptarInvitaction(aceptarInvitaionDto);
  }
}
