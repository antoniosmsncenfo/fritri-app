import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CrearUsuariosDto } from './dto/crear-usuarios.dto';
import { Usuario } from './schemas/usuarios.schema';

@Controller('estadisticas')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('crear-usuario')
  @HttpCode(200)
  async create(@Body() crearUsuariosDto: CrearUsuariosDto) {
    return await this.usuariosService.create(crearUsuariosDto);
  }

  @Get('obtener-todos-usuarios')
  async findAll(): Promise<Usuario[]> {
    return this.usuariosService.findAll();
  }
}
