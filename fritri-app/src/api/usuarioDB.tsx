import axios from 'axios';
import { IUsuarioDeTerceros } from '../interfaces/usuario-facebook';
import { IUsuario } from '../constants/types/index';
import { USUARIOS_BASE_URL } from '@env';
import { MESSSAGES } from '../constants/mocks';
import { IUsuarioContrasena } from '../interfaces/usuario-fritri';


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

export const updateUsuarioFriTri = async (usuarioActualizado: IUsuario) => {
    let request = {
        method: 'put',
        url: `${USUARIOS_BASE_URL}/actualizar-usuario`,
        headers: {},
        data: usuarioActualizado,
    };
    try {
        const resultado = await axios(request);
        console.log(resultado.status);

        if (resultado.status === 200) {
            console.log(resultado.data);
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

export const resetearPassword = async (email:string) => {
    let request = {
        method: 'get',
        url: `${USUARIOS_BASE_URL}/resetPassword?email=${email}`,
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

export const cambiarPassword = async (usuarioContrasena:IUsuarioContrasena) => {
    let request = {
        method: 'put',
        url: `${USUARIOS_BASE_URL}/actualizar-contrasenas`,
        headers: {},
        data: usuarioContrasena,
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
