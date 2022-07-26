import { useState } from 'react';
import { ILugarGoogle } from '../interfaces/lugar-google';
import { IBuscarLugarGoogle } from '../interfaces/buscar-lugar-google';
import { getDestinations, getGooglePlaceByType } from '../api/lugaresTuristicosDB';
import { useTranslation } from './useTranslation';
import { IDestino } from '../interfaces/paseo';

export const useGooglePlace = () => {
  const [googlePlace, setGooglePlace] = useState<ILugarGoogle | null>(null);
  const [destinations, setDestinations] = useState<IDestino[]>([]);
  const { locale } = useTranslation();

  const destinationsSearch = async (destination: string) => {
    const result = await getDestinations(destination/*, locale*/); // descomentar para usar el idioma que seleccionó el usuario
    if (result) {
      setDestinations(result);
    }
  };

  const getGooglePlace = async (buscarLugar: IBuscarLugarGoogle) => {
    const result = await getGooglePlaceByType(buscarLugar);
    if (result) {
      setGooglePlace(result);
    }
  };

  return {
    getGooglePlace,
    googlePlace,
    destinations,
    destinationsSearch,
  };

};
