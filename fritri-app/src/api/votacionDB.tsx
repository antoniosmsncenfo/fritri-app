import axios from 'axios';
import { ITipoVotoEnviar} from '../interfaces/tipo-voto';
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
