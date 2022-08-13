import axios from 'axios';
import { ITipoVotoEnviar, TipoSeccion } from '../interfaces/tipo-voto';
import { VOTACIONES_BASE_URL } from '@env';

export const votarSeccionDb = async (idIntegrante: string, idPaseo: string, idSecciones: ITipoVotoEnviar[], tipoSeccion: string) => {

    const data = {
        idIntegrante,
        idPaseo,
        idSecciones,
        tipoSeccion,
    };

    let request = {
        method: 'post',
        url: `${VOTACIONES_BASE_URL}/votar-seccion`,
        headers: {},
        data,
    };
    try {
        const resultado = await axios(request);
        if (resultado.status === 200) {
            return resultado.data;
        }
        else {
            return null;
        }
    }
    catch (e) {
        throw e;
    }
};

export const cerrarSeccionDb = async (idPaseo:string, tipo:TipoSeccion) => {

    const data = {
        idPaseo:idPaseo,
        tipoSeccion:tipo,
        cerrarVotaciones:true,
        fechaModificacion:new Date()
    };

    let request = {
        method: 'patch',
        url: `${VOTACIONES_BASE_URL}/cerrar-seccion`,
        headers: {},
        data,
    };
    try {
        const resultado = await axios(request);
        if (resultado.status === 200) {
            console.log(JSON.stringify(resultado.data));
            //Al tener un resultado exitoso, debemos notificar a todos los integrantes
            //sobre el cierre de las votaciones.
            return resultado.data;
        }
        else {
            return null;
        }
    }
    catch (e) {
        throw e;
    }
};
