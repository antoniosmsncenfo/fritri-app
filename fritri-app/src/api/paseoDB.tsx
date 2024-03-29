import axios from 'axios';
import { IPaseo, IPaseoUpdate, TipoSeccion, EstadoPaseo, EstadoFinal } from '../interfaces/paseo';

export const crearPaseoNuevo = async (paseo: IPaseo, aleatorio: boolean) => {
    let request = {
        method: 'post',
        url: `${process.env.PASEOS_BASE_URL}/crear-paseo`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: { ...paseo, esAleatorio: aleatorio },
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

export const protegerPaseoPorID = async (idPaseo: string) => {

    let request = {
        method: 'patch',
        url: `${process.env.PASEOS_BASE_URL}/proteger-paseo/${idPaseo}`,
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

export const removerPinPaseoPorID = async (idPaseo: string) => {

    let request = {
        method: 'patch',
        url: `${process.env.PASEOS_BASE_URL}/remover-pin-paseo/${idPaseo}`,
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

export const cerrarSeccionDb = async (idPaseo:string, tipo:TipoSeccion) => {

    const data = {
        idPaseo:idPaseo,
        tipoSeccion:tipo,
        cerrarVotaciones:true,
        fechaModificacion:new Date()
    };

    let request = {
        method: 'patch',
        url: `${process.env.PASEOS_BASE_URL}/cerrar-seccion`,
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

export const cambiarEstadoFinalDb = async (idPaseo:string, estadoFinal:EstadoFinal) => {

    const data = {
        idPaseo:idPaseo,
        estadoFinal: estadoFinal
    };

    let request = {
        method: 'patch',
        url: `${process.env.PASEOS_BASE_URL}/cambiar-estado-final`,
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

export const aceptarInvitacionPaseoDb = async (idUsuario: string, idPaseo: string) => {
    let request = {
        method: 'post',
        url: `${process.env.PASEOS_BASE_URL}/aceptar-invitacion`,
        headers: {},
        data: {
            idUsuario,
            idPaseo
        }
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
