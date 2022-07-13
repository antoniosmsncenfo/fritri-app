import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException } from  '@nestjs/common';
import { Usuario, UsuarioDocument } from './schemas/usuarios.schema';
import { CrearUsuariosDto } from './dto/crear-usuarios.dto';
import { LoginTercerosDto } from './dto/login-terceros.dto';
import { CompararContrasena, GenerarContrasenaTemporal, HashContrasena, LongitudPassword } from '../helpers/hash.contrasena';
import { LoginEmailDto } from './dto/login-email.dto';
import { NoUsuario } from './interface/no-usuario';
import { ActualizarUsuariosDto } from './dto/actualizar-usuarios';
import { AuthService } from 'src/auth/auth.service';
import { EmailsService } from './emails.service';
import { ActualizarContrasenaDto } from './dto/actualizar-contrasena';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<UsuarioDocument>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private mailService: EmailsService,
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
    const propiedadesEliminar = ['contrasena','contrasenaTemporal'];
    
    for (const propiedadEliminar of propiedadesEliminar) {
      if (propiedadEliminar in usuario){
        delete usuario[propiedadEliminar]
      }
    }
    return usuario;
  }

  async loginEmail(loginEmailDto: LoginEmailDto): Promise<Usuario | NoUsuario> {
    let resultado;
    let resultadoNoExiste = {
      message: 'Credenciales no válidas',
      statusCode: 404
    };
    //Se asume inicialmente que las credenciales no son validas
    resultado = resultadoNoExiste;

    try {
      //Primero se valida si existe un usuario con el correo recibido
      const resultadoUsuario: UsuarioDocument = await this.usuarioModel.findOne({ correoElectronico: loginEmailDto.correoElectronico }).exec();
      //Si no se encontró el correo se retorna credenciales no válidas: status 404
      if(!resultadoUsuario) {
        return resultadoNoExiste;
      }
      console.log("Usuario encontrado: " + resultadoUsuario);
      //Primero se valida si la contrasena recibida es la principal
      const compararContrasena = await CompararContrasena(loginEmailDto.contrasena, resultadoUsuario.contrasena);
      //Si la contrasena de login es igual a la principal se procede a retornar el resultado
      if (compararContrasena) {
        console.log("La contrasena es igual a la principal");
        //Se eliminan las contrasenas
        resultado = this.eliminarPropiedades(resultadoUsuario.toObject());
        //Se obtiene el token de seguridad
        const token = await this.authService.login({ correoElectronico: resultadoUsuario.correoElectronico, _id: resultadoUsuario.id });
        //Se descompone el objeto para agregarle la propiedad del token
        resultado = {
          ...resultado,
          ...token
        }
      //Si la contrasena de login no era igual a la principal entonces se valida si es igual a la temporal
      } else {
        console.log("La contrasena NO era igual a la principal");
        //Se define una bandera apagada para la comparacion
        let compararContrasenaTemporal = false;

        //Se valida si el resultado contiene contrasena temporal
        if ('contrasenaTemporal' in resultadoUsuario){
          //Se valida si está vacía
          if (resultadoUsuario.contrasenaTemporal.trim().length>0) {
            //Se compara la contrasena recibida con la temporal
            compararContrasenaTemporal = await CompararContrasena(loginEmailDto.contrasena, resultadoUsuario.contrasenaTemporal);            
          }
        }

        //Esta variable es true si el resultado contiene contrasena temporal y es igual a la de login 
        if (compararContrasenaTemporal){
            console.log("La temporal era igual a la recibida");

            //Cambiar el tipo de login
            resultadoUsuario.tipoLogin = 'Temporal';
            //Se eliminan las contrasenas
            resultado = this.eliminarPropiedades(resultadoUsuario.toObject());
            //Se obtiene el token de seguridad
            const token = await this.authService.login({ correoElectronico: resultadoUsuario.correoElectronico, _id: resultadoUsuario.id });
            //Se descompone el objeto para agregarle la propiedad del token y definir que el login es de tipo Temporal
            resultado = {
              ...resultado,
              ...token
            }
        }
        //Entra en esta condicion si la temporal no era igual a la de login. Se retorna credenciales no válidas: status 404 
        else {
          console.log(resultadoNoExiste);
          return resultadoNoExiste;
        }
      }
    } catch(error) {
      console.log(error);
      throw new BadRequestException(`Error al tratar de iniciar sesión con el email::${error.message}`);
    }
    console.log("Usuario retornado: " + resultado);
    return resultado;
  }

  async resetPassword(email: string): Promise<Usuario | NoUsuario> {
    let resultado;
    let resultadoNoExiste = {
      message: 'No existe usuario',
      statusCode: 404
    };
    try {
      //Esperar el resultado de la busqueda de usuario por email
      let resultadoUsuario = await this.usuarioModel.findOne({ correoElectronico: email }).exec();
      if(!resultadoUsuario) {
        //si no lo encontró retorna que no existe un usuario
        return resultadoNoExiste;
      }
      else{

        //Como si se encontró un usuario con ese correo, se procede a generar un password temporal
        const contrasenaTemporal = await GenerarContrasenaTemporal(LongitudPassword.Ocho);
        console.log("Temporal: " + contrasenaTemporal);

        //Esperar el resultado del envío por correo, si se produce un error es capturado
        //y elevado al cliente de este servicio
        const resultadoEmail = await this.mailService.postHTMLEmail({
          nombreCompleto: resultadoUsuario.nombreCompleto,
          correoElectronico: resultadoUsuario.correoElectronico,
          contrasenaTemporal: contrasenaTemporal
        });

        //Si llegó a este punto significa que se envió el correo
        //se procede a hashar la contraseña y a guardarla en el campo
        //de contrasena temporal
        const { hash } = await HashContrasena(contrasenaTemporal);

        //Se le actualiza la propiedad de contrasena temporal
        resultadoUsuario.contrasenaTemporal = hash;

        console.log("Usuario obtenido:" + resultadoUsuario);

        const actualizado = await this.actualizarContrasenasEncriptadas({
          _id: resultadoUsuario._id,
          contrasena: resultadoUsuario.contrasena,
          contrasenaTemporal: resultadoUsuario.contrasenaTemporal
        })

        resultado = actualizado;

      }
    } catch(error) {
      throw (error);
    }
    return this.eliminarPropiedades(resultado.toObject());
  }

  // TODO: Obtener el idUsuario del JWT token
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

    // TODO: Obtener el idUsuario del JWT token
    async actualizarContrasenasEncriptadas(actualizarContrasenaDto: ActualizarContrasenaDto): Promise<Usuario> {
      let resultado;
      try {
        console.log ("Usuario final:" + JSON.stringify(actualizarContrasenaDto));

        const idUsuario = actualizarContrasenaDto._id;
        resultado = await this.usuarioModel.findOneAndUpdate({ _id: idUsuario }, actualizarContrasenaDto, {
          returnOriginal: false
        });
      } catch(error) {
        throw new BadRequestException(`Error al tratar de actualizar las contrasenas encriptadas::${error.message}`);
      }
      return this.eliminarPropiedades(resultado);
    }

    async actualizarContrasenas(actualizarContrasenaDto: ActualizarContrasenaDto): Promise<Usuario> {
      let resultado;
      let hash1 = "";
      let hash2 = "";
      try {

        console.log ("Usuario recibido:" + JSON.stringify(actualizarContrasenaDto));

        if ('contrasena' in actualizarContrasenaDto){
          hash1 = (await HashContrasena(actualizarContrasenaDto.contrasena)).hash;
        }
        if ('contrasenaTemporal' in actualizarContrasenaDto){
          hash2 = (await HashContrasena(actualizarContrasenaDto.contrasenaTemporal)).hash;
        }

        console.log("Hash1: " + hash1 + ", Hash2: " + hash2);

        resultado = await this.actualizarContrasenasEncriptadas({
          _id: actualizarContrasenaDto._id,
          contrasena: hash1,
          contrasenaTemporal: hash2
        });

      } catch(error) {
        throw new BadRequestException(`Error al tratar de actualizar las contrasenas::${error.message}`);
      }
      if (resultado) {
        this.eliminarPropiedades(resultado);
      }
      return resultado;
    }

}
