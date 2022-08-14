import { Injectable, Logger } from '@nestjs/common';
import { Usuario } from './dto/usuarios';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class UsuariosService {
  constructor(private readonly httpService: HttpService) {}

  ObtenerUsuario = async (idUsuario: string) => {
    try {
      const result = await this.httpService.axiosRef.get(
        `${process.env.USUARIOS_BASE_URL}/obtener-usuario-paseo/${idUsuario}`,
      );

      if (result.status === 200) {
        return result.data as Usuario;
      } else {
        return null;
      }
    } catch (error) {
      Logger.error(
        `Error ObtenerUsuario: ${error.response?.data?.message}`,
        'UsuariosService',
      );
      return null;
    }
  };
}
