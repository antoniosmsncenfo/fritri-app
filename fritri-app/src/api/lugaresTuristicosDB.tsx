import axios from 'axios';
import { LUGARES_TURISTICOS_BASE_URL } from '@env';
import { IDestino } from '../interfaces/paseo';
import { ISolicitudDestinosPorCoordenadas, ISolicitudLugaresGoogle } from '../interfaces/solicitud-lugares-google';
import { ILugarGoogleRespuesta } from '../interfaces/restaurante-respuesta';

export const getDestinationsByCoordinates = async (solicitudDestinosPorCoordenadas: ISolicitudDestinosPorCoordenadas): Promise<IDestino[]> => {

    const request = {
        method: 'get',
        url: `${LUGARES_TURISTICOS_BASE_URL}destinos/buscar-destinos-coordenadas`,
        headers: {
            'Content-Type': 'application/json',
        },
        params: {
            latitud: solicitudDestinosPorCoordenadas.latitud,
            longitud: solicitudDestinosPorCoordenadas.longitud,
            idioma: solicitudDestinosPorCoordenadas.idioma,
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
};

export const getDestinations = async (destination: string, idUsuario: string, language: string = 'es'): Promise<IDestino[]> => {
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
                idUsuario,
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

export const getGooglePlaceList = async (idsGoogle: string[]) => {

    const requestList = idsGoogle.map((id) => {
        const request = {
            method: 'get',
            url: `${LUGARES_TURISTICOS_BASE_URL}lugares-google/obtener-lugar`,
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                idGoogle: id,
            },
        };
        return axios(request);
    });

    try {
        const resultado = await axios.all(requestList);

        if (resultado.length > 0) {
            const lugares = resultado.map(r => {
                if (r.status === 200) {
                    return r.data;
                }
                else {
                    return null;
                }
            });
            return lugares.filter(lugar => lugar !== null);
        }
        else {
            return [];
        }
    }
    catch (e) {
        return [];
    }
};

export const getGooglePlacesByType = async (solicitudLugaresGoogle: ISolicitudLugaresGoogle, idUsuario: string, language: string = 'es'): Promise<ILugarGoogleRespuesta> => {

    let request = {
        method: 'post',
        url: `${LUGARES_TURISTICOS_BASE_URL}lugares-google/buscar-lugares`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: { ...solicitudLugaresGoogle, idioma: language, idUsuario },
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


