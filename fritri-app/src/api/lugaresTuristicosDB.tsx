import axios from 'axios';
import { LUGARES_TURISTICOS_BASE_URL } from '@env';
import { IBuscarLugarGoogle } from '../interfaces/buscar-lugar-google';
import { IDestino } from '../interfaces/paseo';
import { ISolicitudLugaresGoogle } from '../interfaces/solicitud-lugares-google';
import { ILugarGoogle } from '../interfaces/lugar-google';
import { RestauranteRespuesta } from '../interfaces/restaurante-respuesta';

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

export const getGooglePlaceByType = async (buscarLugar: IBuscarLugarGoogle) => {
    const type = getTypePlace(buscarLugar?.tipoLugar);
    let request = {
        method: 'get',
        url: `${LUGARES_TURISTICOS_BASE_URL}${type?.url}/${type?.endpoint}`,
        headers: {
            'Content-Type': 'application/json',
        },
        params: {
            idGoogle: buscarLugar.idGoogle,
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

export const getGooglePlacesByType = async (solicitudLugaresGoogle: ISolicitudLugaresGoogle, language: string = 'es'): Promise<RestauranteRespuesta> => {
    const type = getTypePlace(solicitudLugaresGoogle.tipo);
    let request = {
        method: 'post',
        url: `${LUGARES_TURISTICOS_BASE_URL}${type?.url}/${type?.endpoint}`,
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
                restaurantes: [],
                tokenPaginacion: '',
            };
        }
    }
    catch (e) {
        return {
            restaurantes: [],
            tokenPaginacion: '',
        };
    }
};

const getTypePlace = (typeOfPlace) => {
    switch (typeOfPlace) {
        case 'restaurante':
            return {
                url: 'restaurantes',
                endpoint: 'obtener-restaurante',
            };
        case 'atraccion':
            return {
                url: 'atracciones-turisticas',
                endpoint: 'obtener-atraccion-turistica',
            };
        case 'restaurantes':
            return {
                url: 'restaurantes',
                endpoint: 'buscar-restaurantes',
            };
        case 'atracciones':
            return {
                url: 'atracciones-turisticas',
                endpoint: 'buscar-atracciones-turisticas',
            };
    }
};


