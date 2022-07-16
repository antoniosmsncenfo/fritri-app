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
  async create(@Body() crearNotificacionesDto: CrearNotificacionDto) {
    return await this.notificacionesService.create(crearNotificacionesDto);
  }

  @Get('findAll')
  async findAll(): Promise<Notificacion[]> {
    return this.notificacionesService.findAll();
  }

  @Put('actualizar-notificacion')
  @HttpCode(200)
  async actualizarNotificacion(@Body() actualizarNotificacionDto: ActualizarNotificacionDto) {
    return await this.notificacionesService.actualizarNotificacion(actualizarNotificacionDto);
  }

}
