import { useState, useEffect } from 'react';
import axios from 'axios';
import { LUGARES_TURISTICOS_BASE_URL } from '@env';
import { ILugarGoogle } from '../interfaces/lugar-google';
import { IBuscarLugarGoogle } from '../interfaces/buscar-lugar-google';

export const useGooglePlace = () => {
  const [googlePlace, setGooglePlace] = useState<ILugarGoogle | null>(null);

  const getGooglePlace = async (buscarLugar: IBuscarLugarGoogle) => {
    try {
      const type = getTypePlace(buscarLugar?.tipoLugar);
      let request = {
        method: 'get',
        url: `${LUGARES_TURISTICOS_BASE_URL}${type?.url}/${type?.endpoint}`,
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          idGoogle: buscarLugar.idGoogle
        }
      };
      const resultado = await axios(request);
      if (resultado.status === 200) {
        setGooglePlace(resultado?.data || null);
      }
    } catch (error) {
    }
  };

  const getTypePlace = (typeOfPlace) => {
    switch(typeOfPlace) {
      case 'restaurante': 
        return {
          url: 'restaurantes',
          endpoint: 'obtener-restaurante'
        }
      case 'atraccion': 
      return {
        url: 'atracciones-turisticas',
        endpoint: 'obtener-atraccion-turistica'
      }
    }
  }

  return {
    getGooglePlace,
    googlePlace
  };

};
