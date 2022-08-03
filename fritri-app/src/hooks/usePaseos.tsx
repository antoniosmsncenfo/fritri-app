import { useState } from 'react';
import { CantidadPaseos, IPaseo } from '../interfaces/paseo';
import { obtenerPaseoPorID, obtenerPaseosUsuarioPorEstado } from '../api/paseoDB';
import { EstadoPaseo } from '../interfaces/paseo';

export const usePaseo = () => {

    const [paseosUsuario, setPaseosUsuario] = useState<IPaseo[] | null>(null);

    const [paseoSeleccionado, setPaseoSeleccionado] = useState<IPaseo | null>(null);

    const obtenerPaseosUsuario = (idUsuario: string, estadoPaseos: EstadoPaseo, cantidad:CantidadPaseos) => {

        obtenerPaseosUsuarioPorEstado(idUsuario,estadoPaseos,cantidad)
            .then((resultado) => {
                if (resultado !== null) {
                    setPaseosUsuario(resultado);
                }
                else{
                    setPaseosUsuario(null);
                }
            })
            .catch((e) => {
                console.log("UsePaseos->obtenerPaseosUsuario::ERROR "+ e.Message);
                setPaseosUsuario(null);
            });
    };

    const obtenerPaseo = (idPaseo: string) => {

        obtenerPaseoPorID(idPaseo)
            .then((resultado) => {
                if (resultado !== null) {
                    setPaseoSeleccionado(resultado);
                }
                else{
                    setPaseoSeleccionado(null);
                }
            })
            .catch((e) => {
                console.log("UsePaseos->obtenerPaseo::ERROR "+ e.Message);
                setPaseoSeleccionado(null);
            });
    };

    return{
        paseosUsuario,
        setPaseosUsuario,
        obtenerPaseosUsuario,
        obtenerPaseo,
        paseoSeleccionado
    }
}