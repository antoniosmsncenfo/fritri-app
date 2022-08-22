import { getEstadisticasDestino } from 'api/estadisticas/EstadisticasDB';
import _ from 'lodash';
import { IEstadisticaDestino } from '../interfaces/estadistica-destino';

export interface IPlaceByType { place: string, count: number };
export interface ITotalsLocations { restaurants: number; attractions: number; destinations: number; };
export interface ILocationsPieChartSeries { labels: string[], datasets: { label: string, backgroundColors: string[], data: number[], }, };
export interface ILocationsLineChartSeries { labels: string[], datasets: [{ label: string, color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark", data: number[], }], }
export interface IDataTableData {
    columns: { Header: string, accessor: string, width?: string, align?: string }[],
    rows: { place: string, count: number }[],
}
export interface IDataEstadisticaDestino {
    totalsLocations?: ITotalsLocations;
    locationsChartSeries?: ILocationsPieChartSeries;
    locationsLineChartSeries?: ILocationsLineChartSeries;
    topDestinations?: IDataTableData;
    topRestaurants?: IDataTableData;
    topAttractions?: IDataTableData;
    topPlaces: number;
}

export const useEstadisticasDestino = () => {
    const topLugares = 10;
    const days: string[] = ["M", "T", "W", "T", "F", "S", "S"];
    const months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const obtenerEstadisticasDestino = async (): Promise<IEstadisticaDestino[]> => getEstadisticasDestino();

    const obtenerLugaresPorTipo = (estadisticas: IEstadisticaDestino[], tipo: string): IDataTableData => {
        const lugaresFiltrados = estadisticas.filter(l => l.tipo.toLowerCase() === tipo);

        const lugares = _.groupBy(lugaresFiltrados, i => i.nombre);

        const lugaresData = Object.entries(lugares).map(([nombre, destinos]) => ({
            place: nombre,
            count: destinos.length,
        }));

        const lugaresDataOrdenados = lugaresData.sort((a: any, b: any) => b.count - a.count);

        const datosPrevios = lugaresDataOrdenados.slice(0, topLugares);

        const datosDataTable: IDataTableData = {
            columns: [
                { Header: 'place', accessor: 'place', width: "70%", },
                { Header: "count", accessor: "count", },
            ],
            rows: datosPrevios
        }
        return datosDataTable;
    }

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
        dataEstadisticaDeDestinos = { ...dataEstadisticaDeDestinos, topPlaces: topLugares };
        dataEstadisticaDeDestinos = { ...dataEstadisticaDeDestinos, totalsLocations: obtenerTotalesDestinos(estadisticas) };
        dataEstadisticaDeDestinos = { ...dataEstadisticaDeDestinos, locationsChartSeries: obtenerSeriesParaGraficoLugaresPorTipo(dataEstadisticaDeDestinos.totalsLocations) };
        dataEstadisticaDeDestinos = { ...dataEstadisticaDeDestinos, locationsLineChartSeries: obtenerDestinosBuscadosPorMes(estadisticas) };
        dataEstadisticaDeDestinos = { ...dataEstadisticaDeDestinos, topDestinations: obtenerLugaresPorTipo(estadisticas, 'destino') };
        dataEstadisticaDeDestinos = { ...dataEstadisticaDeDestinos, topRestaurants: obtenerLugaresPorTipo(estadisticas, 'restaurantes') };
        dataEstadisticaDeDestinos = { ...dataEstadisticaDeDestinos, topAttractions: obtenerLugaresPorTipo(estadisticas, 'atracciones') };
        return dataEstadisticaDeDestinos;
    }

    return {
        obtenerDataEstadisticaDeDestinos,
    };
}