import axios from 'axios';
import { LUGARES_TURISTICOS_BASE_URL } from '@env';
import { IDestino } from '../interfaces/destino';
import { IBuscarLugarGoogle } from '../interfaces/buscar-lugar-google';

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
                idioma: language
            },
        };
        console.log(request);
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
    }
};


