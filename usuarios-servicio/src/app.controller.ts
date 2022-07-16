import { Body, Controller, Get, HttpCode, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { CloudinaryService } from './common/services/cloudinary.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, 
    private readonly authService: AuthService,
    private readonly cloudinaryService: CloudinaryService
    ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  obtenerPerfil(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('perfil-terceros')
  obtenerPerfilTerceros(@Request() req) {
    return req.user;
  }

  @Post('subir-imagen')
  @UseInterceptors(FileInterceptor('imagen', {
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './uploads/')
      },
      filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + '-' + file.originalname)
      }
    })
  }))
  @HttpCode(200)
  async subirImagen(@UploadedFile() image): Promise<any> {
    return await this.cloudinaryService.subirImagen(image);
  }

  @Post('eliminar-imagen')
  @HttpCode(200)
  async eliminaImagen(@Body() imagen): Promise<any> {
    return await this.cloudinaryService.eliminarImagen(imagen.imagenId)
  }

}
