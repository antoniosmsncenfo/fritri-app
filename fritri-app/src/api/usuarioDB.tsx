import axios from 'axios';
import { IUsuarioDeTerceros } from '../interfaces/usuario-facebook';
import { IUsuario } from '../constants/types/index';
import { USUARIOS_BASE_URL } from '@env';
import { MESSSAGES } from '../constants/mocks';


export const guardarUsuarioTerceros = async (usuarioTercero: IUsuarioDeTerceros) => {
    let request = {
        method: 'post',
        url: `${USUARIOS_BASE_URL}/login-terceros`,
        headers: {},
        data: usuarioTercero,
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
        console.log('API usuario error:',JSON.stringify(e.message, null, 2));
        return null;
    }
};

export const guardarUsuarioFriTri = async (usuarioNuevo: IUsuario) => {
    let request = {
        method: 'post',
        url: `${USUARIOS_BASE_URL}/crear-usuario`,
        headers: {},
        data: usuarioNuevo,
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
