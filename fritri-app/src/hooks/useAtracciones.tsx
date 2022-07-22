import axios from 'axios';
import { useState } from 'react';
import { ATRACCION_BASE_URL } from '@env';

export const useLogin = () => {

    const buscarAtracciones = async () => {
        try {
            let request = {
                method: 'post',
                url: `${ATRACCION_BASE_URL}/buscar-atracciones-turisticas`,
                headers: {},
                //data: atracciones,
            };
            const resultado = await axios(request);
            if (resultado.status === 200) {


            }
            else if (resultado.data.statusCode === 404) {

            }



        } catch (error) {
        }
    };

    const obtenerAtracciones = async () => {
        try {
            let request = {
                method: 'get',
                url: `${ATRACCION_BASE_URL}/obtener-atraccion-turistica`,
                headers: {},
                //data: atracciones,
            };
            const resultado = await axios(request);
            if (resultado.status === 200) {


            }
            else if (resultado.data.statusCode === 404) {

            }
        } catch (error) {
        }
    };


    return {
        buscarAtracciones,
        obtenerAtracciones,

    };

};


