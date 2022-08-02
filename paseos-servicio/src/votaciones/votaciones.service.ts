import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException } from  '@nestjs/common';
import { Paseo, PaseoDocument } from '../paseos/schemas/paseos.schema';
import { VotarSeccionDto } from './dto/votar-seccion';
import { Lugar } from 'src/paseos/schemas/lugares.schema';
import { IResultadoExiste } from './interface/votar-seccion';

@Injectable()
export class VotacionesService {

  private paseoActual: PaseoDocument;
  private resultadoNoExiste = {
    message: 'Paseo no existe',
    statusCode: 404,
  };

  constructor(
    @InjectModel(Paseo.name) private readonly paseoModel: Model<PaseoDocument>,
  ) {}

  async votarSeccion(votarSeccionDto: VotarSeccionDto) {
    let resultado;
    try {
      const { idIntegrante } = votarSeccionDto;
      const respuesta = await this.procesoObtenerInformacion(votarSeccionDto);
      if(!respuesta) {
        return this.resultadoNoExiste;
      }
      const { lugarAVotar, prop, propPaseo, indexLugar } : IResultadoExiste  = respuesta;
      if(lugarAVotar[0]) {
        let resultadoActividadVotar: Lugar = this.votarEnActividad(idIntegrante, lugarAVotar[0]);
        this.paseoActual[propPaseo][prop][indexLugar] = resultadoActividadVotar;
        await this.paseoActual.save();
      }
      resultado = this.paseoActual;
    } catch(error) {
      throw new BadRequestException(`Error al tratar de votarSeccion::${error.message}`);
    }
    return resultado;
  }

  async quitarVotoSeccion(votarSeccionDto: VotarSeccionDto) {
    let resultado;
    try {
      const { idIntegrante } = votarSeccionDto;
      const respuesta = await this.procesoObtenerInformacion(votarSeccionDto);
      if(!respuesta) {
        return this.resultadoNoExiste;
      }
      const { lugarAVotar, prop, propPaseo, indexLugar } : IResultadoExiste  = respuesta;
      if(lugarAVotar[0]) {
        let resultadoActividadVotar: Lugar = this.quitarVotarActividad(idIntegrante, lugarAVotar[0]);
        this.paseoActual[propPaseo][prop][indexLugar] = resultadoActividadVotar;
        await this.paseoActual.save();
      }
      resultado = this.paseoActual;
    } catch(error) {
      throw new BadRequestException(`Error al tratar de quitar votar seccion::${error.message}`);
    }
    return resultado;
  }

  async procesoObtenerInformacion(votarSeccionDto: VotarSeccionDto): Promise<null | IResultadoExiste> {
    try {
      const { tipoSeccion, idPaseo, idSeccion } = votarSeccionDto;
      const resultadoPaseo = await this.paseoModel.findOne({ _id: idPaseo });
      if(!resultadoPaseo) {
        return null;
      }
      this.paseoActual = resultadoPaseo;
      const { seccion, prop, propPaseo } = this.obtenerSeccionPaseo(tipoSeccion);
      let lugarAVotar: Lugar = seccion[prop].filter(x => x['idGoogle'] === idSeccion);
      let indexLugar = seccion[prop].findIndex(x => x['idGoogle'] === idSeccion);
      return {
        lugarAVotar,
        prop,
        propPaseo,
        indexLugar
      }
    } catch(error) {
      throw new BadRequestException(`Error en proceso obtener informacion::${error.message}`);
    }
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

  quitarVotarActividad(idIntegrante, lugarAVotar: Lugar): Lugar {
    const existeVotoUsuario = lugarAVotar.votaciones.findIndex(x => x.idVotante === idIntegrante);
    if(existeVotoUsuario !== -1) {
      lugarAVotar.votaciones.splice(existeVotoUsuario, 1);
    }
    return lugarAVotar;
  }

}
