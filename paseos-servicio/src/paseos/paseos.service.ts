import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { Paseo, PaseoDocument, TipoSeccion } from './schemas/paseos.schema';
import { CrearPaseoDto } from './dto/crear-paseo.dto';
import { ActualizarPaseoDto } from './dto/actualizar-paseo.dto';
import { GenerarPinProteger } from '../helpers/generador-codigo';
import { NotificacionesService } from 'src/notificaciones/notificaciones.service';
import { NotificacionPaseoActualizado } from 'src/notificaciones/dto/notificacion-paseo-actualizado.dto';
import { Notificacion } from 'src/notificaciones/dto/notificacion.dto';
import { CerrarSeccionDto } from './dto/cerrar-seccion';

export enum EstadoPaseo {
  Pendiente = 1,
  Completado = 2,
}

@Injectable()
export class PaseosService {
  constructor(
    @InjectModel(Paseo.name) private readonly paseoModel: Model<PaseoDocument>,
    private notificacionesService: NotificacionesService,
  ) {}

  async crear(crearPaseo: CrearPaseoDto) {
    let resultado;
    let resutadoPaseo = null;
    try {
      if (crearPaseo.idPaseo) {
        resutadoPaseo = await this.paseoModel
          .findOne({ _id: crearPaseo.idPaseo })
          .exec();
      }
      if (!resutadoPaseo) {
        resultado = await this.paseoModel.create(crearPaseo);
      } else {
        throw new Error('Paseo duplicado');
      }
    } catch (error) {
      throw new BadRequestException(
        `Error al tratar de crear el paseo::${error.message}`,
      );
    }
    return resultado;
  }

  async obtener(idPaseo: string) {
    let resultadoPaseo = null;
    try {
      resultadoPaseo = await this.paseoModel
        .findOne({ _id: idPaseo, eliminado: false })
        .exec();
      if (!resultadoPaseo) {
        throw new Error(`No existe el paseo solicitado con el id::${idPaseo}`);
      }
    } catch (error) {
      if (error.message.match(/No existe/)) {
        throw new NotFoundException(
          `No existe el paseo solicitado con el id::${idPaseo}`,
        );
      }
      throw new BadRequestException(
        `Error al tratar de obtener el paseo::${error.message}`,
      );
    }
    return resultadoPaseo;
  }

  async proteger(idPaseo: string): Promise<Paseo> {
    let resultadoPaseo = null;
    let resultado;

    const pin = await GenerarPinProteger();

    try {
      resultadoPaseo = await this.paseoModel.findOneAndUpdate(
        { _id: idPaseo },
        { pinPaseo: pin },
        {
          returnOriginal: false,
        },
      );
      if (!resultadoPaseo) {
        throw new Error(`No existe el paseo solicitado con el id::${idPaseo}`);
      }
      resultado = {
        statusCode: 200,
        message: `Paseo con el id::${idPaseo} fue protegido`,
        data: resultadoPaseo,
      };
    } catch (error) {
      if (error.message.match(/No existe/)) {
        throw new NotFoundException(
          `No existe el paseo con el id::${idPaseo} para actualizar`,
        );
      }
      throw new BadRequestException(
        `Error al tratar de proteger el paseo::${error.message}`,
      );
    }
    return resultado;
  }

  async removerPin(idPaseo: string): Promise<Paseo> {
    let resultadoPaseo = null;
    let resultado;

    try {
      resultadoPaseo = await this.paseoModel.findOneAndUpdate(
        { _id: idPaseo },
        { pinPaseo: null },
        {
          returnOriginal: false,
        },
      );
      if (!resultadoPaseo) {
        throw new Error(`No existe el paseo con el id::${idPaseo}`);
      }
      resultado = {
        statusCode: 200,
        message: `El pin de proteccion fue removido del Paseo con el id::${idPaseo}`,
        data: resultadoPaseo,
      };
    } catch (error) {
      if (error.message.match(/No existe/)) {
        throw new NotFoundException(
          `No existe el paseo solicitado con el id::${idPaseo}`,
        );
      }
      throw new BadRequestException(
        `Error al tratar de remover el pin del paseo::${error.message}`,
      );
    }
    return resultado;
  }

  async obtenerPaseosUsuario(
    idCreador: string,
    estado: EstadoPaseo,
    limite: number,
  ) {
    let resultadoPaseo = null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      resultadoPaseo = await this.paseoModel
        .find(
          {
            idCreador: idCreador,
            fechaPaseo:
              estado === EstadoPaseo.Pendiente
                ? { $gte: today }
                : { $lt: today },
            eliminado: false,
          },
          null,
          { limit: limite, sort: { fechaPaseo: 'asc' } },
        )
        .exec();
    } catch (error) {
      throw new BadRequestException(
        `Error al tratar de obtener los paseos del usuario::${error.message}`,
      );
    }
    return resultadoPaseo;
  }

  async actualizar(actualizarPaseoDto: ActualizarPaseoDto): Promise<Paseo> {
    let resultadoPaseo = null;
    let resultado;
    const idPaseo = actualizarPaseoDto.idPaseo;
    try {
      resultadoPaseo = await this.paseoModel.findOneAndUpdate(
        { _id: idPaseo, eliminado: false },
        actualizarPaseoDto,
        {
          returnOriginal: false,
        },
      );
      if (!resultadoPaseo) {
        throw new Error(`No existe el paseo solicitado con el id::${idPaseo}`);
      }
      resultado = {
        statusCode: 200,
        message: `Paseo con el id::${idPaseo} fue actualizado`,
        data: resultadoPaseo,
      };
      console.log(JSON.stringify(resultadoPaseo));

      const notificacionPaseoActualizado: NotificacionPaseoActualizado = {
        idPaseo: idPaseo,
        nombrePaseo: resultadoPaseo.nombre,
        integrantes: resultadoPaseo.integrantes,
        modificacionesRealizadas: actualizarPaseoDto.modificacionesRealizadas,
      };

      await this.notificarPaseoActualizado(notificacionPaseoActualizado);
    } catch (error) {
      if (error.message.match(/No existe/)) {
        throw new NotFoundException(
          `No existe el paseo solicitado con el id::${idPaseo} para actualizar`,
        );
      }
      throw new BadRequestException(
        `Error al tratar de eliminar el paseo::${error.message}`,
      );
    }
    return resultado;
  }

  async cerrarSeccion(cerrarSeccionDto: CerrarSeccionDto) {
    let resultadoPaseo;
    try {
      const { idPaseo, tipoSeccion, cerrarVotaciones, fechaModificacion } = cerrarSeccionDto;
      resultadoPaseo = await this.paseoModel.findOne({ _id: idPaseo });
      if(!resultadoPaseo) {
        throw new Error(`No existe el paseo con el id::${idPaseo}`);
      }

      let filter;
      let update
      let seccion;
      if (tipoSeccion===TipoSeccion.RESTAURANTE) {
        seccion = "Restaurantes";
        filter = { _id: idPaseo };
        update = { 'seccionRestaurantes.esFinalizadasVotaciones':cerrarVotaciones, 
                    'seccionRestaurantes.fechaFinalizacionVotaciones': fechaModificacion}; 
      } else {
        seccion = "Atracciones Turísticas";
        filter = { _id: idPaseo };
        update = { 'seccionAtraccionesTuristicas.esFinalizadasVotaciones':cerrarVotaciones, 
                    'seccionAtraccionesTuristicas.fechaFinalizacionVotaciones': fechaModificacion};
      }
      
      resultadoPaseo = await this.paseoModel.findOneAndUpdate(filter,update, {
        returnOriginal: false
      });  

      const notificacionPaseoActualizado: NotificacionPaseoActualizado = {
        idPaseo: idPaseo,
        nombrePaseo: resultadoPaseo.nombre,
        integrantes: resultadoPaseo.integrantes,
        modificacionesRealizadas: [ `Se cerraron las votaciones en la sección de ${seccion}.` ]
      };

      console.log("Notificacion Paseo: " + JSON.stringify(notificacionPaseoActualizado));

      await this.notificarPaseoActualizado(notificacionPaseoActualizado);

    } catch(error) {
      throw new BadRequestException(`Error al tratar de cerrar sección de votos::${error.message}`);
    }
    return resultadoPaseo;
  }

  async eliminar(idPaseo: string) {
    let resultadoPaseo = null;
    let resultado;
    try {
      resultadoPaseo = await this.paseoModel.findOneAndUpdate(
        { _id: idPaseo, eliminado: false },
        { eliminado: true },
        {
          returnOriginal: false,
        },
      );
      if (!resultadoPaseo) {
        throw new Error(`No existe el paseo solicitado con el id::${idPaseo}`);
      }
      resultado = {
        statusCode: 200,
        message: `Paseo con el id::${idPaseo} fue eliminado`,
      };
    } catch (error) {
      if (error.message.match(/No existe/)) {
        throw new NotFoundException(
          `No existe el paseo solicitado con el id::${idPaseo} para eliminar`,
        );
      }
      throw new BadRequestException(
        `Error al tratar de eliminar el paseo::${error.message}`,
      );
    }
    return resultado;
  }

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
            idUsuario: integrante.idIntegrante.toString(),
            fechaCreacion: new Date(),
            fechaModificacion: new Date(),
            esArchivada: false,
            esLeida: false,
          };

          await this.notificacionesService.CrearNotificacion(notificacion);
        },
      );
    });
  }
}
