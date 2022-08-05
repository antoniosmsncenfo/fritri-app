import { useState } from 'react';
import { INotificacion } from '../interfaces/notificacion';
import { obtenerNotificacionesUsuario } from '../api/notificacionDB';

export const useNotificacion = () => {

    const [notificacionesUsuario, setNotificacionesUsuario] = useState<INotificacion[] | null>(null);

    const obtenerNotificaciones = (idUsuario: string) => {

        obtenerNotificacionesUsuario(idUsuario)
            .then((resultado) => {
                if (resultado !== null) {
                    setNotificacionesUsuario(resultado);
                    console.log(JSON.stringify(resultado));
                }
                else{
                    setNotificacionesUsuario(null);
                }
            })
            .catch((e) => {
                console.log("UseNotificaciones->obtenerNotificaciones::ERROR "+ e.Message);
                setNotificacionesUsuario(null);
            });
    };

    return{
        notificacionesUsuario,
        obtenerNotificaciones
    }
}