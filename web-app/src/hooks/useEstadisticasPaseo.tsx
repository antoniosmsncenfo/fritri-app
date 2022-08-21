import { getEstadisticasPaseo } from 'api/estadisticas/EstadisticasDB';
import { IEstadisticaPaseo } from 'interfaces/estadistica-paseo';
import _ from 'lodash';
import paisesLista from './data/countries';

export interface ITripsByCountry { [key: string]: string | number | (string | number)[]; }
export interface ITripsLocations { name: string, latLng: [number, number], trips: number }
export interface IChartsSeries { labels: string[]; datasets: { label: string, data: number[] } };
export interface ITotalsTrips { restaurants: number; attractions: number; countries: number; trips: number; };

export interface IDataEstadisticaDePaseos {
  topTrips: number;
  tripsByCountry?: ITripsByCountry[],
  tripsLocations?: ITripsLocations[],
  tripsPerDay?: IChartsSeries,
  tripsPlannedPerMonth?: IChartsSeries,
  tripsCreatedPerMonth?: IChartsSeries,
  totalsTrips?: ITotalsTrips
}

export const useEstadisticasPaseo = () => {
  const topPaises = 5;
  const days: string[] = ["M", "T", "W", "T", "F", "S", "S"];
  const months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

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

  const obtenerPaseosPlaneadosPorDia = (estadisticas: IEstadisticaPaseo[]): IChartsSeries => {
    const dataPordia = [0, 0, 0, 0, 0, 0, 0];

    const diasAgrupados = _.groupBy(estadisticas, i => new Date(i.fechaPaseo).getDay());

    Object.entries(diasAgrupados).forEach(([dia, paseos]) => {
      dataPordia[parseInt(dia, 10)] = paseos.length;
    });

    const paseosPordia: IChartsSeries = {
      labels: days,
      datasets: { label: 'trips', data: dataPordia }
    }
    return paseosPordia;
  }

  const obtenerPaseosPlaneadoPorMes = (estadisticas: IEstadisticaPaseo[]): IChartsSeries => {
    const dataPorMes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    const mesesAgrupados = _.groupBy(estadisticas, i => new Date(i.fechaPaseo).getMonth());

    Object.entries(mesesAgrupados).forEach(([mes, paseos]) => {
      dataPorMes[parseInt(mes, 10)] = paseos.length;
    });

    const paseosPorMes: IChartsSeries = {
      labels: months,
      datasets: { label: 'trips', data: dataPorMes }
    }
    return paseosPorMes;
  }

  const obtenerPaseosCreadosPorMes = (estadisticas: IEstadisticaPaseo[]): IChartsSeries => {
    const dataPorMes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    const mesesAgrupados = _.groupBy(estadisticas, i => new Date(i.fechaCreacion).getMonth());

    Object.entries(mesesAgrupados).forEach(([mes, paseos]) => {
      dataPorMes[parseInt(mes, 10)] = paseos.length;
    });

    const paseosPorMes: IChartsSeries = {
      labels: months,
      datasets: { label: 'trips', data: dataPorMes }
    }
    return paseosPorMes;
  }

  const obtenerTotalesPaseos = (estadisticas: IEstadisticaPaseo[]): ITotalsTrips => {
    const totalRestaurantes = estadisticas.map(p => p.cantidadRestaurantes).reduce((a, b) => a + b);
    const totalAtracciones = estadisticas.map(p => p.cantidadAtracciones).reduce((a, b) => a + b);
    const totalPaseos = estadisticas.length;
    const totalPaises = Object.entries(_.groupBy(estadisticas, i => i.paisPaseo)).length;
    return {
      restaurants: totalRestaurantes, attractions: totalAtracciones, countries: totalPaises, trips: totalPaseos
    };
  }

  const obtenerDataEstadisticaDePaseos = async (): Promise<IDataEstadisticaDePaseos> => {
    let dataEstadisticaDePaseos: IDataEstadisticaDePaseos;

    const estadisticas: IEstadisticaPaseo[] = await obtenerEstadisticasPaseo();

    dataEstadisticaDePaseos = { ...dataEstadisticaDePaseos, topTrips: topPaises };
    dataEstadisticaDePaseos = { ...dataEstadisticaDePaseos, tripsByCountry: obtenerPaisesPorPaseos(estadisticas) };
    dataEstadisticaDePaseos = { ...dataEstadisticaDePaseos, tripsLocations: obtenerUbicacionesPaseos(estadisticas) };
    dataEstadisticaDePaseos = { ...dataEstadisticaDePaseos, tripsPerDay: obtenerPaseosPlaneadosPorDia(estadisticas) };
    dataEstadisticaDePaseos = { ...dataEstadisticaDePaseos, tripsPlannedPerMonth: obtenerPaseosPlaneadoPorMes(estadisticas) };
    dataEstadisticaDePaseos = { ...dataEstadisticaDePaseos, tripsCreatedPerMonth: obtenerPaseosCreadosPorMes(estadisticas) };
    dataEstadisticaDePaseos = { ...dataEstadisticaDePaseos, totalsTrips: obtenerTotalesPaseos(estadisticas) };

    return dataEstadisticaDePaseos;
  }

  return {
    obtenerDataEstadisticaDePaseos,
  };
}