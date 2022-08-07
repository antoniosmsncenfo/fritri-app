import { useState } from 'react';
import { ILugarGoogle } from '../interfaces/lugar-google';
import { getDestinations, getDestinationsByCoordinates, getGooglePlaceByType, getGooglePlacesByType } from '../api/lugaresTuristicosDB';
import { useTranslation } from './useTranslation';
import { IDestino } from '../interfaces/paseo';
import { ISolicitudDestinosPorCoordenadas, ISolicitudLugaresGoogle } from '../interfaces/solicitud-lugares-google';
import { ILugarGoogleRespuesta } from '../interfaces/restaurante-respuesta';

export const useGooglePlace = () => {
  const [googlePlace, setGooglePlace] = useState<ILugarGoogle | null>(null);
  const [destinations, setDestinations] = useState<IDestino[]>([]);
  const [lugaresGoogleResponse, setLugaresGoogleResponse] = useState<ILugarGoogleRespuesta>({ lugaresGoogle: [], tokenPaginacion: '' });
  const { locale } = useTranslation();

  const destinationsSearchByCoordinates = async (solicitudDestinosPorCoordenadas: ISolicitudDestinosPorCoordenadas) => {
    solicitudDestinosPorCoordenadas = { ...solicitudDestinosPorCoordenadas, idioma: 'es' };/*,idioma: locale}; // descomentar para usar el idioma que seleccionó el usuario*/
    const result = await getDestinationsByCoordinates(solicitudDestinosPorCoordenadas);
    if (result) {
      setDestinations(result);
    }
  };
  const destinationsSearch = async (destination: string) => {
    const result = await getDestinations(destination/*, locale*/); // descomentar para usar el idioma que seleccionó el usuario
    if (result) {
      setDestinations(result);
    }
  };

  const getGooglePlace = async (idGoogle: string) => {
    const result = await getGooglePlaceByType(idGoogle);
    if (result) {
      setGooglePlace(result);
    }
  };

  const getLugaresGoogle = async (solicitudLugaresGoogle: ISolicitudLugaresGoogle) => {
    const result = await getGooglePlacesByType(solicitudLugaresGoogle/*, locale*/); // descomentar para usar el idioma que seleccionó el usuario
    if (result) {
      setLugaresGoogleResponse(result);
    }
  };

  return {
    getGooglePlace,
    googlePlace,
    destinations,
    destinationsSearch,
    destinationsSearchByCoordinates,
    getLugaresGoogle,
    lugaresGoogleResponse,
  };

};
