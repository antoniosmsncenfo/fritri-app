import { Injectable, Logger } from '@nestjs/common';
import { Estadistica } from './dto/estadistica-destino';
import { HttpService } from '@nestjs/axios';
import { LugarGoogle } from 'src/lugares-google/entities/lugar-google.entity';
import { UsuariosService } from '../usuarios/usuarios.service';
import { Destino } from 'src/destinos/entities/destino.entity';

@Injectable()
export class EstadisticasService {
  constructor(
    private readonly httpService: HttpService,
    private usuariosService: UsuariosService,
  ) {}

  enviarEstadisticaServicio = async (estadistica: Estadistica) => {
    try {
      return (
        await this.httpService.axiosRef.post(
          `${process.env.ESTADISTICAS_BASE_URL}/crear-destinos`,
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

  async crearEstadisticaLugar(
    lugares: LugarGoogle[],
    idUsuario: string,
    tipo: string,
  ) {
    if (lugares.length > 0) {
      const usuario = await this.usuariosService.ObtenerUsuario(idUsuario);

      lugares.forEach(async (lugar) => {
        const estadistica: Estadistica = {
          nombre: lugar.nombre,
          paisDestino: lugar.vecindario || 'No definido',
          estadoDestino: lugar.vecindario || 'No definido',
          tipo,
          fecha: new Date(),
          idLugarGoogle: lugar.idGoogle,
          idUsuario,
          paisUsuario: usuario?.pais || 'No definido',
          genero: usuario?.genero || 'No definido',
        };

        await this.enviarEstadisticaServicio(estadistica);
      });
    }
  }

  async crearEstadisticaDestino(destinos: Destino[], idUsuario: string) {
    if (destinos.length > 0) {
      const usuario = await this.usuariosService.ObtenerUsuario(idUsuario);
      destinos.forEach(async (destino) => {
        const estadistica: Estadistica = {
          nombre: destino.nombre,
          paisDestino: destino.pais,
          estadoDestino: destino.estado,
          tipo: 'Destino',
          fecha: new Date(),
          idLugarGoogle: destino.idGoogle,
          idUsuario,
          paisUsuario: usuario?.pais || 'No definido',
          genero: usuario?.genero || 'No definido',
        };

        await this.enviarEstadisticaServicio(estadistica);
      });
    }
  }
}
