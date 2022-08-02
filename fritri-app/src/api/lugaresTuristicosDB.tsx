import axios from 'axios';
import { LUGARES_TURISTICOS_BASE_URL } from '@env';
import { IDestino } from '../interfaces/paseo';
import { ISolicitudLugaresGoogle } from '../interfaces/solicitud-lugares-google';
import { ILugarGoogleRespuesta } from '../interfaces/restaurante-respuesta';

export const getDestinations = async (destination: string, language: string = 'es'): Promise<IDestino[]> => {
    if (destination) {
        let request = {
            method: 'get',
            url: `${LUGARES_TURISTICOS_BASE_URL}destinos/buscar-destinos`,
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                nombre: destination,
                idioma: language,
            },
        };

        try {
            const resultado = await axios(request);
            if (resultado.status === 200) {
                return resultado.data;
            }
            else {
                return [];
            }
        }
        catch (e) {
            return [];
        }
    }
    else {
        return [];
    }
};

export const getGooglePlaceByType = async (idGoogle: string) => {
    let request = {
        method: 'get',
        url: `${LUGARES_TURISTICOS_BASE_URL}lugares-google/obtener-lugar`,
        headers: {
            'Content-Type': 'application/json',
        },
        params: {
            idGoogle: idGoogle,
        },
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

export const getGooglePlacesByType = async (solicitudLugaresGoogle: ISolicitudLugaresGoogle, language: string = 'es'): Promise<ILugarGoogleRespuesta> => {

    let request = {
        method: 'post',
        url: `${LUGARES_TURISTICOS_BASE_URL}lugares-google/buscar-lugares`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: { ...solicitudLugaresGoogle, idioma: language },
    };

    try {
        const result = await axios(request);
        if (result.status === 200) {
            return result.data;
        }
        else {
            return {
                lugaresGoogle: [],
                tokenPaginacion: '',
            };
        }
    }
    catch (e) {
        return {
            lugaresGoogle: [],
            tokenPaginacion: '',
        };
    }
};


