import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException } from  '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { EmailsService } from './emails.service';
import { Notificacion, NotificacionDocument } from './schemas/notificaciones.schema';
import { ActualizarNotificacionDto } from './dto/actualizar-notificacion';
import { CrearNotificacionDto } from './dto/crear-notificacion';

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectModel(Notificacion.name) private readonly notificacionModel: Model<NotificacionDocument>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private mailService: EmailsService,
  ) {}

  async create(crearNotificacionDto: CrearNotificacionDto): Promise<Notificacion> {
    let resultado;
    try {
      resultado = await this.notificacionModel.create(crearNotificacionDto);
    } catch(error) {
      throw new BadRequestException(`Error al tratar de crear la notificación::${error.message}`);
    }
    return resultado;
  }

  async findAll(): Promise<Notificacion[]> {
    return this.notificacionModel.find().exec();
  }

  async findOne(id: string): Promise<Notificacion> {
    return this.notificacionModel.findOne({ _id: id }).exec();
  }

  async obtenerNotificacionesUsuario(idUsuario: string): Promise<Notificacion[]> {
    return this.notificacionModel.find({ idUsuario: idUsuario }).exec();
  }

  async actualizarNotificacion(actualizarNotificacionDto: ActualizarNotificacionDto): Promise<Notificacion> {
    let resultado;
    try {
      const idNotificacion = actualizarNotificacionDto.id;
      resultado = await this.notificacionModel.findOneAndUpdate({ _id: idNotificacion }, actualizarNotificacionDto, {
        returnOriginal: false
      });
    } catch(error) {
      throw new BadRequestException(`Error al tratar de actualizar la notificacion::${error.message}`);
    }
    return resultado;
  }

}
