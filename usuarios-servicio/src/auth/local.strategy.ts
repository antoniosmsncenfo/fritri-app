
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

  constructor(private authService: AuthService) {
    super({
        usernameField: 'correoElectronico',
        passwordField: 'contrasena'
      });
  }

  async validate(correoElectronico: string, contrasena: string): Promise<any> {
    const usuario = await this.authService.validarUsuario(correoElectronico, contrasena);
    if (!usuario) {
      throw new UnauthorizedException();
    }
    return usuario;
  }
}