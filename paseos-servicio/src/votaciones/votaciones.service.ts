import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException } from  '@nestjs/common';
import { Paseo, PaseoDocument } from '../paseos/schemas/paseos.schema';
import { VotarSeccionDto } from './dto/votar-seccion';
import { Lugar } from 'src/paseos/schemas/lugares.schema';

@Injectable()
export class VotacionesService {

  private paseoActual: PaseoDocument;

  constructor(
    @InjectModel(Paseo.name) private readonly paseoModel: Model<PaseoDocument>,
  ) {}

  async votarSeccion(votarSeccionDto: VotarSeccionDto) {
    let resultado;
    let resultadoPaseo = null;
    const resultadoNoExiste = {
      message: 'Paseo no existe',
      statusCode: 404,
    };
    try {
      const { tipoSeccion, idPaseo, idSeccion, idIntegrante } = votarSeccionDto;
      const resultadoPaseo = await this.paseoModel.findOne({ _id: idPaseo });
      if(!resultadoPaseo) {
        return resultadoNoExiste;
      }
      this.paseoActual = resultadoPaseo;
      const { seccion, prop, propPaseo } = this.obtenerSeccionPaseo(tipoSeccion); // Retorna un array con las secciones
      let lugarAVotar: Lugar = seccion[prop].filter(x => x['idGoogle'] === idSeccion);
      let indexLugar = seccion[prop].findIndex(x => x['idGoogle'] === idSeccion);
      let resultadoActividadVotar: Lugar = this.votarEnActividad(idIntegrante, lugarAVotar[0]);
      this.paseoActual[propPaseo][prop][indexLugar] = resultadoActividadVotar;
      await this.paseoActual.save();
      resultado = this.paseoActual;
    } catch(error) {
      throw new BadRequestException(`Error al tratar de votarSeccion::${error.message}`);
    }
    return resultado;
  }

  obtenerSeccionPaseo(tipoSeccion: string) {
    return tipoSeccion === 'RESTAURANTE' ? { 
      seccion: this.paseoActual.seccionRestaurantes, 
      prop: 'restaurantes',
      propPaseo: 'seccionRestaurantes'
    } : {
      seccion: this.paseoActual.seccionAtraccionesTuristicas,
      prop: 'atraccionesturisticas',
      propPaseo: 'seccionAtraccionesTuristicas'
    };
  }

  votarEnActividad(idIntegrante, lugarAVotar: Lugar): Lugar {
    if(!lugarAVotar.votaciones) {
      lugarAVotar.votaciones = [];
    }
    const existeVotoUsuario = lugarAVotar.votaciones.find(x => x.idVotante === idIntegrante);
    if(!existeVotoUsuario) {
      lugarAVotar.votaciones.push({
        idVotante: idIntegrante,
        fecha: new Date(),
        resultado: true
      });
    }
    return lugarAVotar;
  }

}
