import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CrearUsuariosDto } from './dto/crear-usuarios.dto';
import { Usuario } from './schemas/usuarios.schema';
import { LoginTercerosDto } from './dto/login-terceros.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('crear-usuario')
  async create(@Body() crearUsuariosDto: CrearUsuariosDto) {
    await this.usuariosService.create(crearUsuariosDto);
  }

  @Get('findAll')
  async findAll(): Promise<Usuario[]> {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Usuario> {
    return this.usuariosService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usuariosService.delete(id);
  }

  @Post('login-facebook')
  async loginTerceros(@Body() loginTercerosDto: LoginTercerosDto) {
    await this.usuariosService.loginTerceros(loginTercerosDto);
  }
}
