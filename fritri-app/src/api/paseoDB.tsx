import axios from 'axios';
import { EstadoPaseo } from '../../../paseos-servicio/src/paseos/paseos.service';

export const obtenerPaseosUsuarioPorEstado = async (
    idUSuario:string,
    estado:EstadoPaseo,
    limite:number) => {

    let request = {
        method: 'get',
        url: `${process.env.PASEOS_BASE_URL}/obtener-paseos-usuario?idCreador=${idUSuario}&estado=${estado}&limite=${limite}`,
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