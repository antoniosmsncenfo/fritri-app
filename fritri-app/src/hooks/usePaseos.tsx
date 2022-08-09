import { useState } from 'react';
import { CantidadPaseos, IDestino, ILugar, IPaseo, IPaseoUpdate, ISeccionAtraccionesTuristicas, ISeccionRestaurantes, ISolicitudPaseoAleatorio } from '../interfaces/paseo';
import { crearPaseoNuevo, obtenerPaseoPorID, obtenerPaseosUsuarioPorEstado, actualizarPaseoExistente } from '../api/paseoDB';
import { EstadoPaseo } from '../interfaces/paseo';
import { ISolicitudLugaresGoogle, TipoLugaresGoogle } from '../interfaces/solicitud-lugares-google';
import { getGooglePlacesByType } from '../api/lugaresTuristicosDB';
import { ILugarGoogle } from '../interfaces/lugar-google';

export const usePaseo = () => {

    const [paseosUsuario, setPaseosUsuario] = useState<IPaseo[] | null>(null);
    const [paseoSeleccionado, setPaseoSeleccionado] = useState<IPaseo | null>(null);
    const [paseoCreado, setPaseoCreado] = useState<IPaseo | null>(null);
    const [paseoActualizado, setPaseoActualizado] = useState<IPaseo | null>(null);
    const radio = 5;
    const cantidadLugaresAleatorios = 3;

    const crearPaseo = async (paseo: IPaseo) => {
        const result = await crearPaseoNuevo(paseo);
        if (result) {
            setPaseoCreado(result);
        }
    };

    const actualizarPaseo = async (paseo: IPaseoUpdate) => {
        const result = await actualizarPaseoExistente(paseo);
        if (result) {
            setPaseoActualizado(result);
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
                    setPaseoSeleccionadoCargado(true);
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

    const obtenerLugaresAleatorios = async (latitud: number, longitud: number, tipo: TipoLugaresGoogle): Promise<ILugar[]> => {
        const solicitud: ISolicitudLugaresGoogle = { latitud, longitud, radio, tipo, tokenPaginacion: '' };

        const lugares = await getGooglePlacesByType(solicitud/*, locale*/); // descomentar para usar el idioma que seleccionó el usuario
        const lugaresOrdenados = lugares.lugaresGoogle.sort((a, b) => {
            if (a.calificacion > b.calificacion) { return 1; }
            if (a.calificacion < b.calificacion) { return -1; }
            return 0;
        });

        const lugareConFoto = lugaresOrdenados.filter(r => r.urlFotos.length > 0); // quita los lugares sin foto

        const lugaresFiltrados = lugareConFoto.slice(0, cantidadLugaresAleatorios);

        let lugaresParaPaseo: ILugar[] = [];

        if (lugaresFiltrados.length > 0) {
            lugaresParaPaseo = lugaresFiltrados.map((lugar) => {
                return {
                    idLugarGoogle: lugar.idGoogle,
                    nombre: lugar.nombre,
                    descripcion: `{"calificacion": ${lugar.calificacion}, "vecindario":"${lugar.vecindario}"}`,
                    urlFotos: lugar.urlFotos,
                };
            });
        }
        return lugaresParaPaseo;
    };

    const crearPaseoAleatorio = async ({ destino: destino, fechaPaseo, idCreador, nombre }: ISolicitudPaseoAleatorio) => {
        const fechaCreacion = new Date();
        const restaurantes = await obtenerLugaresAleatorios(destino.latitud!, destino.longitud!, 'restaurantes');
        const atraccionesturisticas = await obtenerLugaresAleatorios(destino.latitud!, destino.longitud!, 'atracciones');

        const seccionRestaurantes: ISeccionRestaurantes = {
            esFinalizadasVotaciones: false,
            fechaFinalizacionVotaciones: fechaCreacion,
            restaurantes,
        };

        const seccionAtraccionesTuristicas: ISeccionAtraccionesTuristicas = {
            esFinalizadasVotaciones: false,
            fechaFinalizacionVotaciones: fechaCreacion,
            atraccionesturisticas,
        };

        const paseo: IPaseo = {
            destino,
            seccionRestaurantes,
            seccionAtraccionesTuristicas,
            esCompartido: false,
            fechaCreacion,
            fechaPaseo,
            eliminado: false,
            idCreador,
            nombre,
        };
        crearPaseo(paseo);
    };

    return {
        paseosUsuario,
        setPaseosUsuario,
        obtenerPaseosUsuario,
        obtenerPaseo,
        paseoSeleccionado,
        paseoSeleccionadoCargado,
        crearPaseo,
        crearPaseoAleatorio,
        paseoCreado,
        actualizarPaseo,
        paseoActualizado,
    };
};
