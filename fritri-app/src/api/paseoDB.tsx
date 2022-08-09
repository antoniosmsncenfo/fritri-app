import axios from 'axios';
import { EstadoPaseo } from '../../../paseos-servicio/src/paseos/paseos.service';
import { IPaseo, IPaseoUpdate } from '../interfaces/paseo';

export const crearPaseoNuevo = async (paseo: IPaseo) => {
    let request = {
        method: 'post',
        url: `${process.env.PASEOS_BASE_URL}/crear-paseo`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: paseo,
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
        return null;
    }
};

export const actualizarPaseoExistente = async (paseo: IPaseoUpdate) => {
    let request = {
        method: 'put',
        url: `${process.env.PASEOS_BASE_URL}/actualizar-paseo`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: paseo,
    };
    try {
        const resultado = await axios(request);
        if (resultado.status === 200) {
            return resultado.data.data;
        }
        else {
            return null;
        }
    }
    catch (e) {
        return null;
    }
};

export const obtenerPaseosUsuarioPorEstado = async (
    idUSuario: string,
    estado: EstadoPaseo,
    limite: number) => {

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

export const obtenerPaseoPorID = async (idPaseo: string) => {

    let request = {
        method: 'get',
        url: `${process.env.PASEOS_BASE_URL}/obtener-paseo/${idPaseo}`,
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
