import { Injectable, Logger } from '@nestjs/common';
import { Estadistica } from './dto/estadistica-destino';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class EstadisticasService {
  constructor(private readonly httpService: HttpService) {}

  CrearEstadistica = async (estadistica: Estadistica) => {
    try {
      return (
        await this.httpService.axiosRef.post(
          `${process.env.ESTADISTICAS_BASE_URL}/crear-notificacion`,
          estadistica,
        )
      ).data;
    } catch (error) {
      Logger.error(
        `Error CrearEstadistica: ${error.response?.data?.message}`,
        'EstadisticasService',
      );
    }
  };
}
