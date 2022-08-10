import { useState } from 'react';
import { INotificacion } from '../interfaces/notificacion';
import { actualizarNotificacionEnBD, obtenerNotificacionesUsuario } from '../api/notificacionDB';

export const useNotificacion = () => {

    const [notificacionesUsuario, setNotificacionesUsuario] = useState<INotificacion[] | null>(null);

    const [refrescarNotificaciones, setRefrescarNotificaciones] = useState<boolean>(false);

    const obtenerNotificaciones = (idUsuario: string) => {

        obtenerNotificacionesUsuario(idUsuario)
            .then((resultado) => {
                if (resultado !== null) {
                    setNotificacionesUsuario(resultado);
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

    const actualizarNotificacion = (notificacion: INotificacion) => {

        actualizarNotificacionEnBD(notificacion)
            .then((resultado) => {
                if (resultado !== null) {
                    setRefrescarNotificaciones(true);
                }
                else{
                    setRefrescarNotificaciones(false);
                }
            })
            .catch((e) => {
                console.log("UseNotificaciones->actualizarNotificacion::ERROR "+ e.Message);
                setRefrescarNotificaciones(false);
            });
    };

    return{
        notificacionesUsuario,
        obtenerNotificaciones,
        actualizarNotificacion,
        refrescarNotificaciones
    }
}