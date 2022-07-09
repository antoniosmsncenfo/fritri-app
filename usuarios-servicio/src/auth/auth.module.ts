import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { TercerosStrategy } from './terceros.strategy';

@Module({
  imports: [UsuariosModule, PassportModule],
  controllers: [],
  providers: [AuthService, LocalStrategy, TercerosStrategy],
})
export class AuthModule {}
