import { Injectable, Logger } from '@nestjs/common';
import { Notificacion } from './dto/notificacion.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class NotificacionesService {
  constructor(private readonly httpService: HttpService) {}

  CrearNotificacion = async (notificacion: Notificacion) => {
    try {
      return (
        await this.httpService.axiosRef.post(
          `${process.env.NOTIFICACIONES_BASE_URL}/crear-notificacion`,
          notificacion,
        )
      ).data;
    } catch (error) {
      Logger.error(
        `Error CrearNotificacion: ${error.response?.data?.message}`,
        'NotificacionesService',
      );
    }
  };
}
