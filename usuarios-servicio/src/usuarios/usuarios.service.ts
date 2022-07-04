import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException } from  '@nestjs/common';
import { Usuario, UsuarioDocument } from './schemas/usuarios.schema';
import { CrearUsuariosDto } from './dto/crear-usuarios.dto';
import { LoginTercerosDto } from './dto/login-terceros.dto';
import { HashContrasena } from '../helpers/hash.contrasena';


@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<UsuarioDocument>,
  ) {}

  async create(crearUsuarioDto: CrearUsuariosDto): Promise<Usuario> {
    let resultado;
    try {
      const { hash, salt } = await HashContrasena(crearUsuarioDto.contrasena);
      crearUsuarioDto = {
        ...crearUsuarioDto,
        contrasena: hash
      }
      const guardarUsuario = {
        ...crearUsuarioDto,
        salt
      }
      resultado = await this.usuarioModel.create(guardarUsuario);
    } catch(error) {
      throw new BadRequestException(`Error al tratar de crear el usuario-email::${error.message}`);
    }
    return resultado;
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioModel.find().exec();
  }

  async findOne(id: string): Promise<Usuario> {
    return this.usuarioModel.findOne({ _id: id }).exec();
  }

  async delete(id: string) {
    const deletedPaseo = await this.usuarioModel
      .findByIdAndRemove({ _id: id })
      .exec();
    return deletedPaseo;
  }

  async loginTerceros(loginTercerosDto: LoginTercerosDto): Promise<Usuario> {
    let resultado;
    try {
      const resultadoUsuario = await this.usuarioModel.findOneAndUpdate({ idTerceros: loginTercerosDto.idTerceros }, loginTercerosDto, 
      {
        new: true,
        upsert: true
      }).exec();
      resultado = resultadoUsuario;
    } catch(error) {
      console.log(error);
      throw new BadRequestException(`Error al tratar de crear el usuario::${error.message}`);
    }
    return resultado;
  }

}
