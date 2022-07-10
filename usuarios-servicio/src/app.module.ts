import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuariosModule } from './usuarios/usuarios.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017/Usuarios_FriTri'),
    UsuariosModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.sendgrid.net',
        auth: {
          user: 'apikey',
          pass: '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',
        },
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
