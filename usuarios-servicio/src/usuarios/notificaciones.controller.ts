import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import { Notificacion } from './schemas/notificaciones.schema';
import { NotificacionesService } from './notificaciones.service';
import { CrearNotificacionDto } from './dto/crear-notificacion';
import { ActualizarNotificacionDto } from './dto/actualizar-notificacion';

@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Post('crear-notificacion')
  @HttpCode(200)
  async create(@Body() crearNotificacionDto: CrearNotificacionDto) {
    return await this.notificacionesService.create(crearNotificacionDto);
  }

  @Get('findAll')
  async findAll(): Promise<Notificacion[]> {
    return this.notificacionesService.findAll();
  }

  @Get('obtener-notificaciones-usuario')
  async obtenerNotificacionesUsuario(@Query('idUsuario') idUSuario: string): Promise<Notificacion[]> {
    return this.notificacionesService.obtenerNotificacionesUsuario(idUSuario);
  }

  @Put('actualizar-notificacion')
  @HttpCode(200)
  async actualizarNotificacion(@Body() actualizarNotificacionDto: ActualizarNotificacionDto) {
    return await this.notificacionesService.actualizarNotificacion(actualizarNotificacionDto);
  }

}
