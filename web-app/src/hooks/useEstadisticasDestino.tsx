import { getEstadisticasDestino } from 'api/estadisticas/EstadisticasDB';
import _ from 'lodash';
import { IEstadisticaDestino } from '../interfaces/estadistica-destino';

export interface ITotalsLocations { restaurants: number; attractions: number; destinations: number; };
export interface ILocationsPieChartSeries { labels: string[], datasets: { label: string, backgroundColors: string[], data: number[], }, };
export interface ILocationsLineChartSeries { labels: string[], datasets: [{ label: string,  color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark", data: number[], }], }
export interface IDataEstadisticaDestino { totalsLocations?: ITotalsLocations; locationsChartSeries?: ILocationsPieChartSeries; locationsLineChartSeries: ILocationsLineChartSeries }

export const useEstadisticasDestino = () => {
    const days: string[] = ["M", "T", "W", "T", "F", "S", "S"];
    const months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const obtenerEstadisticasDestino = async (): Promise<IEstadisticaDestino[]> => getEstadisticasDestino();

    const obtenerTotalesDestinos = (estadisticas: IEstadisticaDestino[]): ITotalsLocations => {
        const totalDestinos = estadisticas.filter(p => p.tipo.toLocaleLowerCase() === 'destino').length;
        const totalRestaurantes = estadisticas.filter(p => p.tipo.toLocaleLowerCase() === 'restaurantes').length;
        const totalAtracciones = estadisticas.filter(p => p.tipo.toLocaleLowerCase() === 'atracciones').length;

        return {
            restaurants: totalRestaurantes,
            attractions: totalAtracciones,
            destinations: totalDestinos,
        };
    }

    const obtenerSeriesParaGraficoLugaresPorTipo = (estadisticas: ITotalsLocations): ILocationsPieChartSeries => {
        const seriesParaGrafico: ILocationsPieChartSeries = {
            labels: ["Destinations", "Restaurants", "Atracctions",],
            datasets: {
                label: "Locations",
                backgroundColors: ["info", "primary", "dark"],
                data: [estadisticas.destinations, estadisticas.restaurants, estadisticas.attractions,],
            },
        }
        return seriesParaGrafico;
    }

    const obtenerDestinosBuscadosPorMes = (estadisticas: IEstadisticaDestino[]): ILocationsLineChartSeries => {
        const dataPorMes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        const mesesAgrupados = _.groupBy(estadisticas, i => new Date(i.fecha).getMonth());

        Object.entries(mesesAgrupados).forEach(([mes, destinos]) => {
            dataPorMes[parseInt(mes, 10)] = destinos.length;
        });

        const paseosPorMes: ILocationsLineChartSeries = {
            labels: months,
            datasets: [
                {
                    label: "Locations",
                    color: "info",
                    data: dataPorMes,
                }
            ],
        }
        return paseosPorMes;
    }

    const obtenerDataEstadisticaDeDestinos = async (): Promise<IDataEstadisticaDestino> => {
        let dataEstadisticaDeDestinos: IDataEstadisticaDestino;

        const estadisticas: IEstadisticaDestino[] = await obtenerEstadisticasDestino();
        dataEstadisticaDeDestinos = { ...dataEstadisticaDeDestinos, totalsLocations: obtenerTotalesDestinos(estadisticas) };
        dataEstadisticaDeDestinos = { ...dataEstadisticaDeDestinos, locationsChartSeries: obtenerSeriesParaGraficoLugaresPorTipo(dataEstadisticaDeDestinos.totalsLocations) };
        dataEstadisticaDeDestinos = { ...dataEstadisticaDeDestinos, locationsLineChartSeries: obtenerDestinosBuscadosPorMes(estadisticas) };

        return dataEstadisticaDeDestinos;
    }

    return {
        obtenerDataEstadisticaDeDestinos,
    };
}