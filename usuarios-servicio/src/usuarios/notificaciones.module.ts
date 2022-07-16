import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { EmailsService } from './emails.service';
import { NotificacionesController } from './notificaciones.controller';
import { NotificacionesService } from './notificaciones.service';
import { Notificacion, NotificacionSchema } from './schemas/notificaciones.schema';

@Module({
  imports:  [
    MongooseModule.forFeature([{ name: Notificacion.name, schema: NotificacionSchema }]),
    forwardRef(() => AuthModule)
  ],
  controllers: [NotificacionesController],
  providers: [NotificacionesService, EmailsService],
  exports: [NotificacionesService]
})
export class NotificacionesModule {}
