import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException } from  '@nestjs/common';
import { Usuario, UsuarioDocument } from './schemas/usuarios.schema';
import { CrearUsuariosDto } from './dto/crear-usuarios.dto';
import { LoginTercerosDto } from './dto/login-terceros.dto';
import { CompararContrasena, HashContrasena } from '../helpers/hash.contrasena';
import { LoginEmailDto } from './dto/login-email.dto';
import { NoUsuario } from './interface/no-usuario';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<UsuarioDocument>,
  ) {}

  async create(crearUsuarioDto: CrearUsuariosDto): Promise<Usuario> {
    let resultado;
    try {
      const { hash } = await HashContrasena(crearUsuarioDto.contrasena);
      crearUsuarioDto = {
        ...crearUsuarioDto,
        contrasena: hash
      }
      resultado = await this.usuarioModel.create(crearUsuarioDto);
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
      resultado = this.eliminarPropiedades(resultadoUsuario.toObject());
    } catch(error) {
      console.log(error);
      throw new BadRequestException(`Error al tratar de crear el usuario::${error.message}`);
    }
    return resultado;
  }

  private eliminarPropiedades(usuario: UsuarioDocument): UsuarioDocument {
    const propiedadesEliminar = ['contrasena'];
    for (const propiedadEliminar of propiedadesEliminar) {
      delete usuario[propiedadEliminar];
    }
    return usuario;
  }

  async loginEmail(loginEmailDto: LoginEmailDto): Promise<Usuario | NoUsuario> {
    let resultado;
    let resultadoNoExiste = {
      message: 'No existe usuario',
      statusCode: 200
    };
    try {
      const resultadoUsuario: UsuarioDocument = await this.usuarioModel.findOne({ correoElectronico: loginEmailDto.correoElectronico }).exec();
      if(!resultadoUsuario) {
        return resultadoNoExiste;
      }
      const compararContrasena = await CompararContrasena(loginEmailDto.contrasena, resultadoUsuario.contrasena);
      resultado = compararContrasena ? this.eliminarPropiedades(resultadoUsuario.toObject()) : resultadoNoExiste;
    } catch(error) {
      console.log(error);
      throw new BadRequestException(`Error al tratar de iniciar sesión con el email::${error.message}`);
    }
    return resultado;
  }

}
