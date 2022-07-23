import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { UsuariosService } from './usuarios.service';
import { CrearUsuariosDto } from './dto/crear-usuarios.dto';
import { Usuario } from './schemas/usuarios.schema';
import { NoUsuario } from './interface/no-usuario';
import { LoginTercerosDto } from './dto/login-terceros.dto';
import { LoginEmailDto } from './dto/login-email.dto';
import { ActualizarUsuariosDto } from './dto/actualizar-usuarios';
import { ActualizarContrasenaDto } from './dto/actualizar-contrasena';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('crear-usuario')
  @HttpCode(200)
  async create(@Body() crearUsuariosDto: CrearUsuariosDto) {
    return await this.usuariosService.create(crearUsuariosDto);
  }

  @Get('findAll')
  async findAll(): Promise<Usuario[]> {
    return this.usuariosService.findAll();
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string): Promise<Usuario> {
  //   return this.usuariosService.findOne(id);
  // }

  @Get('findEmail')
  async findEmail(@Query('email') email: string): Promise<Usuario> {
    return this.usuariosService.findEmail(email);
  }

  @Get('resetPassword')
  @HttpCode(200)
  async resetPassword(@Query('email') email: string): Promise<Usuario | NoUsuario> {
    return this.usuariosService.resetPassword(email);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usuariosService.delete(id);
  }

  @Post('login-terceros')
  @HttpCode(200)
  async loginTerceros(@Body() loginTercerosDto: LoginTercerosDto) {
    return await this.usuariosService.loginTerceros(loginTercerosDto);
  }

  @Post('login-email')
  @HttpCode(200)
  async loginEmail(@Body() loginEmailDto: LoginEmailDto) {
    return await this.usuariosService.loginEmail(loginEmailDto);
  }

  @Put('actualizar-usuario')
  @HttpCode(200)
  async actualizarUsuario(@Body() actualizarUsuariosDto: ActualizarUsuariosDto) {
    return await this.usuariosService.actualizarUsuario(actualizarUsuariosDto);
  }

  @Put('actualizar-contrasenas')
  @HttpCode(200)
  async actualizarContrasenas(@Body() actualizarContrasenaDto: ActualizarContrasenaDto) {
    return await this.usuariosService.actualizarContrasenas(actualizarContrasenaDto);
  }

  @Post('actualizar-imagen-perfil')
  @UseInterceptors(FileInterceptor('imagen', {
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './uploads/')
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
      }
    })
  }))
  @HttpCode(200)
  async actualizarImagen(@UploadedFile() image, @Body('idUsuario') idUsuario: string): Promise<any> {
    return await this.usuariosService.actualizarFotoPerfil(image, idUsuario);
  }

}
