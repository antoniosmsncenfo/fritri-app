import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsuariosService))
    private usuariosService: UsuariosService,
    private jwtService: JwtService
  ) {}

  async validarUsuario(correoElectronico: string, contrasena: string): Promise<any> {
    const usuario = await this.usuariosService.loginEmail({ correoElectronico, contrasena });
    if (usuario['message'] === 'Credenciales no válidas') {
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

  async loginTerceros(usuario: any) {
    const payload = { tokenTerceros: usuario.tokenTerceros, sub: usuario._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

}