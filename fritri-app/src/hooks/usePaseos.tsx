import { useState } from 'react';
import { IPaseo } from '../interfaces/paseo';
import { obtenerPaseosUsuarioPorEstado } from '../api/paseoDB';
import { EstadoPaseo } from '../../../paseos-servicio/src/paseos/paseos.service';

export const usePaseo = () => {

    const [paseosUsuario, setPaseosUsuario] = useState<IPaseo[] | null>(null);

    const obtenerPaseosUsuario = (idUsuario: string, estadoPaseos: EstadoPaseo, cantidad:number) => {

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
                setPaseosUsuario(null);
            });
    };

    return{
        paseosUsuario,
        obtenerPaseosUsuario
    }
}