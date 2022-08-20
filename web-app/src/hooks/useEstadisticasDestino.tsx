import { getEstadisticasDestino } from 'api/estadisticas/EstadisticasDB';
import { useState } from 'react';
import { IEstadisticaDestino } from '../interfaces/estadistica-destino';


export const useEstadisticasDestino = () => {
    const [estadisticasDestino, setEstadisticasDestino] = useState<IEstadisticaDestino[]>([])

    const obtenerEstadisticasDestino = async () => {
        const estadisticas = await getEstadisticasDestino();
        setEstadisticasDestino(estadisticas);
    }

    return {
        obtenerEstadisticasDestino,
        estadisticasDestino,
    };
}