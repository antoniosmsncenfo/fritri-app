import axios from 'axios';

export const votarSeccionDb = async (idIntegrante:string, idPaseo: string, idSecciones:(string|undefined)[], tipoSeccion: string) => {

    const data = {
        idIntegrante,
        idPaseo,
        idSecciones,
        tipoSeccion
    };

    let request = {
        method: 'post',
        url: `${process.env.VOTACIONES_BASE_URL}/votar-seccion`,
        headers: {},
        data
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