import { Injectable } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class AuthService {
  constructor(private usuariosService: UsuariosService) {}

  async validarUsuario(correoElectronico: string, contrasena: string): Promise<any> {
    const usuario = await this.usuariosService.loginEmail({ correoElectronico, contrasena });
    if (!usuario) {
      return null;
    }
    return usuario;
  }
}