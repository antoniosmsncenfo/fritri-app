import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException } from  '@nestjs/common';
import { Usuario, UsuarioDocument } from './schemas/usuarios.schema';
import { CrearUsuariosDto } from './dto/crear-usuarios.dto';
import { LoginTercerosDto } from './dto/login-terceros.dto';
import { CompararContrasena, HashContrasena } from '../helpers/hash.contrasena';
import { LoginEmailDto } from './dto/login-email.dto';
import { NoUsuario } from './interface/no-usuario';
import { ActualizarUsuariosDto } from './dto/actualizar-usuarios';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<UsuarioDocument>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async create(crearUsuarioDto: CrearUsuariosDto): Promise<Usuario> {
    let resultado;
    try {
      const { hash } = await HashContrasena(crearUsuarioDto.contrasena);
      crearUsuarioDto = {
        ...crearUsuarioDto,
        contrasena: hash
      }
      const resultadoUsuario = await this.usuarioModel.findOne({ correoElectronico: crearUsuarioDto.correoElectronico }).exec();
      if(!resultadoUsuario) {
        resultado = await this.usuarioModel.create(crearUsuarioDto);
      } else {
        throw new Error('Email duplicado');
      }
      const token = await this.authService.login({ correoElectronico: resultado.correoElectronico, _id: resultado.id });
      resultado = {
        ...resultado.toObject(),
        ...token
      }
    } catch(error) {
      throw new BadRequestException(`Error al tratar de crear el usuario-email::${error.message}`);
    }
    return this.eliminarPropiedades(resultado);
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioModel.find().exec();
  }

  async findOne(id: string): Promise<Usuario> {
    return this.usuarioModel.findOne({ _id: id }).exec();
  }

  async findEmail(email: string): Promise<Usuario> {
    console.log(email);
    return this.usuarioModel.findOne({ correoElectronico: email }).exec();
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
      const token = await this.authService.loginTerceros({ tokenTerceros: resultadoUsuario.token, _id: resultadoUsuario.id });
      resultado = {
        ...resultadoUsuario.toObject(),
        ...token
      }
      resultado = this.eliminarPropiedades(resultado);
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

  async loginEmail(loginEmailDto: LoginEmailDto): Promise<Usuario> | null {
    let resultado;
    try {
      const resultadoUsuario: UsuarioDocument = await this.usuarioModel.findOne({ correoElectronico: loginEmailDto.correoElectronico }).exec();
      if(!resultadoUsuario) {
        return null;
      }
      const compararContrasena = await CompararContrasena(loginEmailDto.contrasena, resultadoUsuario.contrasena);
      resultado = compararContrasena && this.eliminarPropiedades(resultadoUsuario.toObject());
      const token = await this.authService.login({ correoElectronico: resultadoUsuario.correoElectronico, _id: resultadoUsuario.id });
      resultado = {
        ...resultado,
        ...token
      }
    } catch(error) {
      console.log(error);
      throw new BadRequestException(`Error al tratar de iniciar sesión con el email::${error.message}`);
    }
    return resultado;
  }

  async actualizarUsuario(actualizarUsuariosDto: ActualizarUsuariosDto): Promise<Usuario> {
    let resultado;
    try {
      const idUsuario = actualizarUsuariosDto._id;
      resultado = await this.usuarioModel.findOneAndUpdate({ _id: idUsuario }, actualizarUsuariosDto, {
        returnOriginal: false
      });
    } catch(error) {
      throw new BadRequestException(`Error al tratar de actualizar el usuario::${error.message}`);
    }
    return this.eliminarPropiedades(resultado);
  }


}
