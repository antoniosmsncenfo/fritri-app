import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CrearUsuariosDto } from './dto/crear-usuarios.dto';
import { Usuario } from './schemas/usuarios.schema';
import { LoginTercerosDto } from './dto/login-terceros.dto';
import { LoginEmailDto } from './dto/login-email.dto';

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

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Usuario> {
    return this.usuariosService.findOne(id);
  }

  @Get(':email')
  async findEmail(@Param('email') email: string): Promise<Usuario> {
    return this.usuariosService.findEmail(email);
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

}
