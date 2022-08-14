import { Injectable, Logger } from '@nestjs/common';
import { Notificacion } from './dto/notificacion.dto';
import { HttpService } from '@nestjs/axios';
import { NotificacionPaseoActualizado } from './dto/notificacion-paseo-actualizado.dto';

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

  async notificarPaseoActualizado(
    notificacionPaseoActualizado: NotificacionPaseoActualizado,
  ) {
    notificacionPaseoActualizado.integrantes.forEach(async (integrante) => {
      notificacionPaseoActualizado.modificacionesRealizadas.forEach(
        async (modificacionRealizada) => {
          const notificacion: Notificacion = {
            titulo: `Paseo ${notificacionPaseoActualizado.nombrePaseo} actualizado`,
            detalle: modificacionRealizada,
            idPaseo: notificacionPaseoActualizado.idPaseo,
            idUsuario: integrante,
            fechaCreacion: new Date(),
            fechaModificacion: new Date(),
            esArchivada: false,
            esLeida: false,
          };

          await this.CrearNotificacion(notificacion);
        },
      );
    });
  }
}
