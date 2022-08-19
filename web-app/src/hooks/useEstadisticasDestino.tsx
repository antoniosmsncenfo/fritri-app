import { getEstadisticasDestino, getEstadisticasPaseo } from 'api/estadisticas/EstadisticasDB';
import { IEstadisticaPaseo } from 'interfaces/estadistica-paseo';
import { useState } from 'react';
import { IEstadisticaDestino } from '../interfaces/estadistica-destino';


export const useEstadisticasDestino = () => {
    const [estadisticasDestino, setEstadisticasDestino] = useState<IEstadisticaDestino[]>([])
    const [estadisticasPaseo, setEstadisticasPaseo] = useState<IEstadisticaPaseo[]>([])

    const obtenerEstadisticasDestino = async () => {
        const estadisticas = await getEstadisticasDestino();
        setEstadisticasDestino(estadisticas);
    }

    const obtenerEstadisticasPaseo = async () => {
        const estadisticas = await getEstadisticasPaseo();
        setEstadisticasPaseo(estadisticas);
    }

    return {
        obtenerEstadisticasDestino,
        estadisticasDestino,
        obtenerEstadisticasPaseo,
        estadisticasPaseo
    };
}