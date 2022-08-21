import { getEstadisticasPaseo } from 'api/estadisticas/EstadisticasDB';
import { IEstadisticaPaseo } from 'interfaces/estadistica-paseo';
import _ from 'lodash';
import paisesLista from './data/countries';

export interface ITripsByCountry { [key: string]: string | number | (string | number)[]; }
export interface ITripsLocations { name: string, latLng: [number, number], trips: number }
export interface IDataEstadisticaDePaseos { tripsByCountry: ITripsByCountry[], tripsLocations: ITripsLocations[] }

export const useEstadisticasPaseo = () => {
  const topPaises = 5;
  
  const obtenerCodigoPais = (pais: string): string =>
    paisesLista.paises.filter(p => p.name_es === pais)?.map(p => p.code)[0] || 'CR'

  const obtenerEstadisticasPaseo = async (): Promise<IEstadisticaPaseo[]> => getEstadisticasPaseo();

  const obtenerPaisesPorPaseos = (estadisticas: IEstadisticaPaseo[]): ITripsByCountry[] => {

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

    const paisesDataOrdenados = paisesData.sort((a: any, b: any) => b.trips - a.trips);
    return paisesDataOrdenados.slice(0, topPaises)
  }

  const obtenerUbicacionesPaseos = (estadisticas: IEstadisticaPaseo[]): ITripsLocations[] => {
    const paises = _.groupBy(estadisticas, i => i.paisPaseo);

    const paisesData = Object.entries(paises).map(([pais, paseos]) => ({
      name: pais,
      latLng: [paseos[0].latitud, paseos[0].longitud],
      trips: paseos.length,
    } as ITripsLocations));

    const paisesDataOrdenados = paisesData.sort((a: any, b: any) => b.trips - a.trips);
    return paisesDataOrdenados.slice(0, topPaises)
  }

  const obtenerDataEstadisticaDePaseos = async (): Promise<IDataEstadisticaDePaseos> => {
    const estadisticas: IEstadisticaPaseo[] = await obtenerEstadisticasPaseo();
    let dataEstadisticaDePaseos: IDataEstadisticaDePaseos;

    dataEstadisticaDePaseos = { ...dataEstadisticaDePaseos, tripsByCountry: obtenerPaisesPorPaseos(estadisticas) };
    dataEstadisticaDePaseos = { ...dataEstadisticaDePaseos, tripsLocations: obtenerUbicacionesPaseos(estadisticas) };

    return dataEstadisticaDePaseos;
  }

  return {
    obtenerDataEstadisticaDePaseos,
  };
}