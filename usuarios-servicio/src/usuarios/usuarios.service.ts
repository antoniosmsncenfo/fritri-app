import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from './schemas/usuarios.schema';
import { CrearUsuariosDto } from './dto/crear-usuarios.dto';


@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<UsuarioDocument>,
  ) {}

  async create(crearUsuariosDto: CrearUsuariosDto): Promise<Usuario> {
    const createdPaseo = await this.usuarioModel.create(crearUsuariosDto);
    return createdPaseo;
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioModel.find().exec();
  }

  async findOne(id: string): Promise<Usuario> {
    return this.usuarioModel.findOne({ _id: id }).exec();
  }

  async delete(id: string) {
    const deletedPaseo = await this.usuarioModel
      .findByIdAndRemove({ _id: id })
      .exec();
    return deletedPaseo;
  }
}
