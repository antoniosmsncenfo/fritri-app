import axios from 'axios';
import { INotificacion } from '../interfaces/notificacion';

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

export const actualizarNotificacionEnBD = async (notificacion:INotificacion) => {
    try {
        let request = {
            method: 'put',
            url: `${process.env.NOTIFICACIONES_BASE_URL}/actualizar-notificacion`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                id:notificacion._id,
                esArchivada:notificacion.esArchivada,
                esLeida:notificacion.esLeida,
                fechaModificacion: new Date(),
            },
        };
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