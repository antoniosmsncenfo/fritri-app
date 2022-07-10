import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService
  ) {}

  async validarUsuario(correoElectronico: string, contrasena: string): Promise<any> {
    const usuario = await this.usuariosService.loginEmail({ correoElectronico, contrasena });
    if (!usuario) {
      return null;
    }
    return usuario;
  }

  async login(usuario: any) {
    const payload = { correoElectronico: usuario.correoElectronico, sub: usuario._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

}