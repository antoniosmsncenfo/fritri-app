import axios from 'axios';

export const obtenerNotificacionesUsuario = async (idUsuario:string) => {

    let request = {
        method: 'get',
        url: `${process.env.NOTIFICACIONES_BASE_URL}/obtener-notificaciones-usuario?idUsuario=${idUsuario}`,
        headers: {},
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