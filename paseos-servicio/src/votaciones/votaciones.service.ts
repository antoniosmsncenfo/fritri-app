import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException } from  '@nestjs/common';
import axios from 'axios';
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
      const { lugaresAVotar, prop, propPaseo } : IResultadoExiste  = respuesta;
      if(lugaresAVotar.length > 0) {
        for (const lugarAVotar of lugaresAVotar) {
          const indexLugar = this.paseoActual[propPaseo][prop].findIndex(x => x['idLugarGoogle'] === lugarAVotar.idLugarGoogle);
          let resultadoActividadVotar: Lugar = await this.votarEnActividad(idIntegrante, lugarAVotar, lugarAVotar.tipoVoto);
          this.paseoActual[propPaseo][prop][indexLugar] = resultadoActividadVotar;
          await this.paseoActual.save();
        }
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
      const { lugaresAVotar, prop, propPaseo } : IResultadoExiste  = respuesta;
      if(lugaresAVotar.length > 0) {
        for (const lugarAVotar of lugaresAVotar) {
          const indexLugar = this.paseoActual[propPaseo][prop].findIndex(x => x['idLugarGoogle'] === lugarAVotar.idLugarGoogle);
          let resultadoActividadVotar: Lugar = this.quitarVotarActividad(idIntegrante, lugarAVotar);
          this.paseoActual[propPaseo][prop][indexLugar] = resultadoActividadVotar;
          await this.paseoActual.save();
        }
      }
      resultado = this.paseoActual;
    } catch(error) {
      throw new BadRequestException(`Error al tratar de quitar votar seccion::${error.message}`);
    }
    return resultado;
  }

  async procesoObtenerInformacion(votarSeccionDto: VotarSeccionDto): Promise<null | IResultadoExiste> {
    try {
      const { tipoSeccion, idPaseo, idSecciones } = votarSeccionDto;
      const resultadoPaseo = await this.paseoModel.findOne({ _id: idPaseo });
      if(!resultadoPaseo) {
        return null;
      }
      this.paseoActual = resultadoPaseo;
      const { seccion, prop, propPaseo } = this.obtenerSeccionPaseo(tipoSeccion);
      let lugaresAVotar: Lugar[] = [];
      for (const idSeccion of idSecciones) {
        const tempLugarVotar = seccion[prop].find(x => idSeccion.idLugar === x['idLugarGoogle']);
        lugaresAVotar.push({...tempLugarVotar, tipoVoto: idSeccion.tipoVoto});
      }
      return {
        lugaresAVotar,
        prop,
        propPaseo,
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

  async obtenerInfoIntegrante(idIntegrante: string) {
    const request = {
      method: 'get',
      url: `${process.env.USUARIOS_BASE_URL}/obtener-usuario-paseo/${idIntegrante}`,
      headers: {}
    };
    try {
      const resultado = await axios(request);
      if (resultado.status === 200) {
        return resultado.data;
      } else {
        return {};
      }
    } catch(error) {
      throw new BadRequestException(`Error en proceso obtener informacion de integrande::${error.message}`);
    }
  }

  async votarEnActividad(idIntegrante, lugarAVotar: Lugar, tipoVoto: string): Promise<Lugar> {
    if(!lugarAVotar.votaciones) {
      lugarAVotar.votaciones = [];
    }
    const existeVotoUsuario = lugarAVotar.votaciones.findIndex(x => x.idVotante === idIntegrante);
    const dataUsuario = await this.obtenerInfoIntegrante(idIntegrante);
    delete dataUsuario._id;
    delete dataUsuario.correoElectronico;
    if(existeVotoUsuario === -1) {
      lugarAVotar.votaciones.push({
        idVotante: idIntegrante,
        fecha: new Date(),
        resultado: tipoVoto,
        ...dataUsuario
      });
    } else {
      lugarAVotar.votaciones[existeVotoUsuario] = {
        idVotante: idIntegrante,
        fecha: new Date(),
        resultado: tipoVoto,
        ...dataUsuario
      };
    }
    delete lugarAVotar.tipoVoto;
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
