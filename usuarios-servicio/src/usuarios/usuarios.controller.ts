import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CrearUsuariosDto } from './dto/crear-usuarios.dto';
import { Usuario } from './schemas/usuarios.schema';
import { NoUsuario } from './interface/no-usuario';
import { LoginTercerosDto } from './dto/login-terceros.dto';
import { LoginEmailDto } from './dto/login-email.dto';
import { ActualizarUsuariosDto } from './dto/actualizar-usuarios';

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
    console.log(email)
    return this.usuariosService.findEmail(email);
  }

  @Get('resetPassword')
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

}
