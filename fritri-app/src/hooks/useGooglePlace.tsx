import { useState } from 'react';
import { ILugarGoogle } from '../interfaces/lugar-google';
import { getDestinations, getDestinationsByCoordinates, getGooglePlaceByType, getGooglePlaceList, getGooglePlacesByType } from '../api/lugaresTuristicosDB';
import { useTranslation } from './useTranslation';
import { IDestino } from '../interfaces/paseo';
import { ISolicitudDestinosPorCoordenadas, ISolicitudLugaresGoogle } from '../interfaces/solicitud-lugares-google';
import { ILugarGoogleRespuesta } from '../interfaces/restaurante-respuesta';
import { useData } from './useData';

export const useGooglePlace = () => {
  const [googlePlace, setGooglePlace] = useState<ILugarGoogle | null>(null);
  const [googlePlaceReady, setGooglePlaceReady] = useState(false);
  const [googlePlacesList, setGooglePlacesList] = useState<ILugarGoogle[]>([]);
  const [destinations, setDestinations] = useState<IDestino[]>([]);
  const [lugaresGooglePorTipoResponse, setLugaresGooglePorTipoResponse] = useState<ILugarGoogleRespuesta>({ lugaresGoogle: [], tokenPaginacion: '' });
  const { user } = useData();
  const { locale } = useTranslation();

  const destinationsSearchByCoordinates = async (solicitudDestinosPorCoordenadas: ISolicitudDestinosPorCoordenadas) => {
    solicitudDestinosPorCoordenadas = { ...solicitudDestinosPorCoordenadas, idioma: 'es' };/*,idioma: locale}; // descomentar para usar el idioma que seleccionó el usuario*/
    const result = await getDestinationsByCoordinates(solicitudDestinosPorCoordenadas);
    if (result) {
      setDestinations(result);
    }
  };
  const destinationsSearch = async (destination: string) => {
    const result = await getDestinations(destination, user._id!/*, locale*/); // descomentar para usar el idioma que seleccionó el usuario
    if (result) {
      setDestinations(result);
    }
  };

  const getGooglePlace = async (idGoogle: string) => {
    const result = await getGooglePlaceByType(idGoogle);
    if (result) {
      setGooglePlace(result);
      setGooglePlaceReady(true);
    }
  };

  const getLugaresGoogle = async (solicitudLugaresGoogle: ISolicitudLugaresGoogle) => {
    const result = await getGooglePlacesByType(solicitudLugaresGoogle, user._id!/*, locale*/); // descomentar para usar el idioma que seleccionó el usuario
    if (result) {
      setLugaresGooglePorTipoResponse(result);
    }
  };

  const getLugaresGoogleList = async (idsGoogle: string[]) => {
    const result = await getGooglePlaceList(idsGoogle);
    if (result) {
      setGooglePlacesList(result);
    }
  };

  return {
    getGooglePlace,
    googlePlace,
    googlePlaceReady,
    destinations,
    destinationsSearch,
    destinationsSearchByCoordinates,
    getLugaresGoogle,
    getLugaresGoogleList,
    lugaresGooglePorTipoResponse,
    googlePlacesList,
  };

};
