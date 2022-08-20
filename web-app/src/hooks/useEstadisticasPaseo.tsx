import { getEstadisticasPaseo } from 'api/estadisticas/EstadisticasDB';
import { IEstadisticaPaseo } from 'interfaces/estadistica-paseo';
import _, { random } from 'lodash';
import { useState } from 'react';

export interface ITripsByCountry { [key: string]: string | number | (string | number)[]; }

export const useEstadisticasPaseo = () => {
  const topPaises = 4;

  const obtenerEstadisticasPaseo = async (): Promise<IEstadisticaPaseo[]> => getEstadisticasPaseo();

  const obtenerPaisesPorPaseos = async (): Promise<ITripsByCountry[]> => {

    const estadisticas = await obtenerEstadisticasPaseo();
    const paises = _.groupBy(estadisticas, i => i.paisPaseo);

    const paisesData = Object.entries(paises).map(([pais, paseos]) => ({
      country: [`https://countryflagsapi.com/png/${pais}`, pais],
      trips: paseos.length,
      restaurants: paseos.map(p => p.cantidadRestaurantes).reduce((a, b) => a + b),
      attractions: paseos.map(a => a.cantidadAtracciones).reduce((a, b) => a + b),
    }));

    const paisesDataOrdenados = paisesData.sort((a: any, b: any) => b.trips - a.trips)

    return paisesDataOrdenados.slice(0, topPaises)
  }

  return {
    obtenerPaisesPorPaseos,
  };
}