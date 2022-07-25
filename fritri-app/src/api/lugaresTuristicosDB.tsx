import axios from 'axios';
import { LUGARES_TURISTICOS_URL } from '@env';
import { IDestino } from '../interfaces/destino';


export const getDestinations = async (destination: string, language: string = 'en'): Promise<IDestino[]> => {
    if (destination) {
        let request = {
            method: 'get',
            url: `${LUGARES_TURISTICOS_URL}/destinos/buscar-destinos?nombre=${destination}&idioma=${language}`,
            headers: {},
            data: '',
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


