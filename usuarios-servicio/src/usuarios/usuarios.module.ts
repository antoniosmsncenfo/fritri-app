import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { CloudinaryService } from '../common/services/cloudinary.service';
import { EmailsService } from './emails.service';
import { Usuario, UsuarioSchema } from './schemas/usuarios.schema';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

@Module({
  imports:  [
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
    forwardRef(() => AuthModule)
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService, EmailsService, CloudinaryService],
  exports: [UsuariosService]
})
export class UsuariosModule {}
