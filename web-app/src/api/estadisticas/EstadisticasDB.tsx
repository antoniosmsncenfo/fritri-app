import { IEstadisticaDestino } from "interfaces/estadistica-destino";
import axios from "axios";
import { IEstadisticaPaseo } from "interfaces/estadistica-paseo";

export const getEstadisticasDestino = async (): Promise<IEstadisticaDestino[]> => {
    const request = {
        method: "get",
        url: `${process.env.REACT_APP_ESTADISTICAS_BASE_URL}/obtener-todos-destinos`,
        headers: {
            "Content-Type": "application/json",
        },
    };

    try {
        const resultado = await axios(request);
        if (resultado.status === 200) {
            return resultado.data;
        }
        return [];
    } catch (e) {
        return [];
    }
};

export const getEstadisticasPaseo = async (): Promise<IEstadisticaPaseo[]> => {
    const request = {
        method: "get",
        url: `${process.env.REACT_APP_ESTADISTICAS_BASE_URL}/obtener-todos-paseos`,
        headers: {
            "Content-Type": "application/json",
        },
    };

    try {
        const resultado = await axios(request);
        if (resultado.status === 200) {
            return resultado.data;
        }
        return [];
    } catch (e) {
        return [];
    }
};
