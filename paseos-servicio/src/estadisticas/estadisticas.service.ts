import { Injectable, Logger } from '@nestjs/common';
import { EstadisticaPaseo } from './dto/estadistica-paseo';
import { HttpService } from '@nestjs/axios';
import { UsuariosService } from '../usuarios/usuarios.service';
import { CrearPaseoDto } from 'src/paseos/dto/crear-paseo.dto';

@Injectable()
export class EstadisticasService {
  constructor(
    private readonly httpService: HttpService,
    private usuariosService: UsuariosService,
  ) {}

  enviarEstadisticaServicio = async (estadistica: EstadisticaPaseo) => {
    try {
      return (
        await this.httpService.axiosRef.post(
          `${process.env.ESTADISTICAS_BASE_URL}/crear-paseo`,
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

  async crearEstadisticaPaseo(paseo: CrearPaseoDto) {
    const usuario = await this.usuariosService.ObtenerUsuario(paseo.idCreador);
    const estadistica: EstadisticaPaseo = {
      nombrePaseo: paseo.nombre,
      idCreador: paseo.idCreador,
      idPaseo: paseo._id,
      destino: paseo.destino.nombre,
      fechaCreacion: new Date(),
      fechaPaseo: paseo.fechaPaseo,
      paisPaseo: paseo.destino.pais,
      paisCreador: usuario?.pais || 'No definido',
      cantidadAtracciones:
        paseo.seccionAtraccionesTuristicas.atraccionesturisticas.length,
      cantidadRestaurantes: paseo.seccionRestaurantes.restaurantes.length,
      cantidadIntegrantes: 0,
      latitud: paseo.destino.latitud,
      longitud: paseo.destino.longitud,
    };
    await this.enviarEstadisticaServicio(estadistica);
  }
}
