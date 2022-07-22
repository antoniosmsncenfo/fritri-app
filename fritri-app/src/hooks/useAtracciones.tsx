import axios from 'axios';
import { useState } from 'react';
import { ATRACCION_BASE_URL } from '@env';

export const useAtracciones = () => {

    const buscarAtracciones = async (formData: any) => {
        try {
            let config = {
                method: 'post',
                url: `${ATRACCION_BASE_URL}/buscar-atracciones-turisticas`,
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
    
            };
            const resultado = await axios(config);
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
 
     const obtenerAtracciones = async (idAtraccion: any) => {
        try {
            let config = {
                method: 'get',
                url: `${ATRACCION_BASE_URL}/obtener-atraccion-turistica`,
                data: idAtraccion,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
    
            };
            const resultado = await axios(config);
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



    return {
        buscarAtracciones,
        obtenerAtracciones,

    };

};


