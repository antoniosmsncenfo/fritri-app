import { getEstadisticasPaseo } from 'api/estadisticas/EstadisticasDB';
import { IEstadisticaPaseo } from 'interfaces/estadistica-paseo';
import _ from 'lodash';
import paisesLista from './data';

export interface ITripsByCountry { [key: string]: string | number | (string | number)[]; }

export const useEstadisticasPaseo = () => {
  const topPaises = 4;

  const obtenerCodigoPais = (pais: string): string =>
    paisesLista.paises.filter(p => p.name_es === pais)?.map(p => p.code)[0] || 'CR'

  const obtenerEstadisticasPaseo = async (): Promise<IEstadisticaPaseo[]> => getEstadisticasPaseo();

  const obtenerPaisesPorPaseos = async (): Promise<ITripsByCountry[]> => {

    const estadisticas = await obtenerEstadisticasPaseo();
    const paises = _.groupBy(estadisticas, i => i.paisPaseo);
   
    const paisesData = Object.entries(paises).map(([pais, paseos]) => {
      const codigoPais = obtenerCodigoPais(pais)
      return {
        country: [`https://countryflagsapi.com/png/${codigoPais}`, pais],
        trips: paseos.length,
        restaurants: paseos.map(p => p.cantidadRestaurantes).reduce((a, b) => a + b),
        attractions: paseos.map(a => a.cantidadAtracciones).reduce((a, b) => a + b),
      }
    });

    const paisesDataOrdenados = paisesData.sort((a: any, b: any) => b.trips - a.trips)

    return paisesDataOrdenados.slice(0, topPaises)
  }

  return {
    obtenerPaisesPorPaseos,
  };
}