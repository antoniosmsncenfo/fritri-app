import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from './schemas/usuarios.schema';
import { CrearUsuariosDto } from './dto/crear-usuarios.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<UsuarioDocument>,
   ) {}
  async create(crearUsuario: CrearUsuariosDto) {
    let resultado;
    let resutadoUsuario = null;
    try {
      if(crearUsuario.idUsuario) {
        resutadoUsuario = await this.usuarioModel.findOne({ _id: crearUsuario.idUsuario }).exec();
      }
      if(!resutadoUsuario) {
        resultado = await this.usuarioModel.create(crearUsuario);
      } else {
        throw new Error('Usuario duplicado');
      }
    } catch(error) {
      throw new BadRequestException(`Error al tratar de crear el usuario::${error.message}`);
    }
    return resultado;
  }


  async findAll(): Promise<Usuario[]> {
    return this.usuarioModel.find().exec();
  }

}
