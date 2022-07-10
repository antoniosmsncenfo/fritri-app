import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    let props = {};
    if(!payload.correoElectronico) {
      props = {
        tokenTerceros: payload.tokenTerceros
      }
    } else {
      props = {
        correoElectronico: payload.correoElectronico
      }
    }
    props = {
      ...props,
      userId: payload.sub, 
    }
    return props
  }
}