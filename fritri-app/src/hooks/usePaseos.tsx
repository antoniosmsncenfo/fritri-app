import { useState } from 'react';
import { CantidadPaseos, IPaseo } from '../interfaces/paseo';
import { crearPaseoNuevo, obtenerPaseoPorID, obtenerPaseosUsuarioPorEstado  } from '../api/paseoDB';
import { EstadoPaseo } from '../interfaces/paseo';

export const usePaseo = () => {

    const [paseosUsuario, setPaseosUsuario] = useState<IPaseo[] | null>(null);
    const [paseoSeleccionado, setPaseoSeleccionado] = useState<IPaseo | null>(null);
    const [paseoCreado, setPaseoCreado] = useState<IPaseo | null>(null);

    const crearPaseo = async (paseo: IPaseo) => {
        const result = await crearPaseoNuevo(paseo);
        if (result) {
            setPaseoCreado(result);
        }
    };

    const [paseoSeleccionadoCargado, setPaseoSeleccionadoCargado] = useState(false);
  
    const obtenerPaseosUsuario = (idUsuario: string, estadoPaseos: EstadoPaseo, cantidad: CantidadPaseos) => {

        obtenerPaseosUsuarioPorEstado(idUsuario, estadoPaseos, cantidad)
            .then((resultado) => {
                if (resultado !== null) {
                    setPaseosUsuario(resultado);
                }
                else {
                    setPaseosUsuario(null);
                }
            })
            .catch((e) => {
                console.log('UsePaseos->obtenerPaseosUsuario::ERROR ' + e.Message);
                setPaseosUsuario(null);
            });
    };

    const obtenerPaseo = (idPaseo: string) => {

        obtenerPaseoPorID(idPaseo)
            .then((resultado) => {
                if (resultado !== null) {
                    setPaseoSeleccionado(resultado);
                    setPaseoSeleccionadoCargado(true)
                }
                else {
                    setPaseoSeleccionado(null);
                }
            })
            .catch((e) => {
                console.log('UsePaseos->obtenerPaseo::ERROR ' + e.Message);
                setPaseoSeleccionado(null);
            });
    };

    return {
        paseosUsuario,
        setPaseosUsuario,
        obtenerPaseosUsuario,
        obtenerPaseo,
        paseoSeleccionado,
        paseoSeleccionadoCargado,
        crearPaseo,
        paseoCreado,
    };
};