import { useState } from 'react';
import { CantidadPaseos, IDestino, ILugar, IPaseo, ISeccionAtraccionesTuristicas, ISeccionRestaurantes, ISolicitudPaseoAleatorio, IPaseoUpdate, TipoSeccion, ResultadoPaseo, EstadoFinal } from '../interfaces/paseo';
import { crearPaseoNuevo, obtenerPaseoPorID, obtenerPaseosUsuarioPorEstado, actualizarPaseoExistente, protegerPaseoPorID, removerPinPaseoPorID, cerrarSeccionDb, aceptarInvitacionPaseoDb, cambiarEstadoFinalDb } from '../api/paseoDB';
import { EstadoPaseo } from '../interfaces/paseo';
import { ISolicitudLugaresGoogle, TipoLugaresGoogle } from '../interfaces/solicitud-lugares-google';
import { getGooglePlacesByType } from '../api/lugaresTuristicosDB';
import { ILugarGoogle } from '../interfaces/lugar-google';
import { useData } from './useData';

export const usePaseo = () => {

    const [paseosUsuario, setPaseosUsuario] = useState<IPaseo[] | null>(null);
    const [paseoSeleccionado, setPaseoSeleccionado] = useState<IPaseo | null>(null);
    const [paseoCreado, setPaseoCreado] = useState<IPaseo | null>(null);
    const [paseoActualizado, setPaseoActualizado] = useState<IPaseo | null>(null);
    const [invitacionAceptada, setInvitacionAceptada] = useState(false);
    const { user } = useData();
    const radio = 5;
    const cantidadLugaresAleatorios = 3;

    const crearPaseo = async (paseo: IPaseo, aleatorio: boolean = false) => {
        const result = await crearPaseoNuevo(paseo, aleatorio);
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

    const [seAsignoPin, setSeAsignoPin] = useState(false);

    const protegerPaseo = (idPaseo: string) => {

        protegerPaseoPorID(idPaseo)
            .then((resultado) => {
                if (resultado !== null) {
                    setSeAsignoPin(true);
                    setPaseoSeleccionado(resultado.data);
                    setPaseoSeleccionadoCargado(true);
                }
                else {
                    setPaseoSeleccionado(null);
                }
            })
            .catch((e) => {
                console.log('UsePaseos->protegerPaseo::ERROR ' + e);
                setPaseoSeleccionado(null);
            });
    };

    const removerPin = (idPaseo: string) => {

        removerPinPaseoPorID(idPaseo)
            .then((resultado) => {
                if (resultado !== null) {
                    setPaseoSeleccionado(resultado.data);
                    setPaseoSeleccionadoCargado(true);
                }
                else {
                    setPaseoSeleccionado(null);
                }
            })
            .catch((e) => {
                console.log('UsePaseos->removerPin::ERROR ' + e);
                setPaseoSeleccionado(null);
            });
    };

    const [seCerroSeccion, setSeCerroSeccion] = useState(false);

    async function cerrarSeccion(idPaseo:string, tipo:TipoSeccion): Promise<any> {
      let resultado;
      try {
        const resultado = await cerrarSeccionDb(idPaseo, tipo);
        
        if(resultado) {
          setSeCerroSeccion(true)
        }
  
      } catch(error) {
        console.log("useVotacion->cerrarSeccion::ERROR "+ JSON.stringify(error));
        resultado = false;
      }
  
      return resultado;
    };    

    const [seCambioEstadoFinal, setSeCambioEstadoFinal] = useState(false);

    async function cambiarEstadoFinalPaseo(idPaseo:string, estadoFinal:EstadoFinal): Promise<any> {
      let resultado;
      try {
        const resultado = await cambiarEstadoFinalDb(idPaseo, estadoFinal);
        
        if(resultado) {
            setSeCambioEstadoFinal(true)
        }
  
      } catch(error) {
        console.log("useVotacion->cambiarEstadoFinalPaseo::ERROR "+ JSON.stringify(error));
        resultado = false;
      }
  
      return resultado;
    }; 

    const obtenerLugaresAleatorios = async (latitud: number, longitud: number, tipo: TipoLugaresGoogle): Promise<ILugar[]> => {
        const solicitud: ISolicitudLugaresGoogle = { latitud, longitud, radio, tipo, tokenPaginacion: '' };

        const lugares = await getGooglePlacesByType(solicitud, user._id!/*, locale*/); // descomentar para usar el idioma que seleccionó el usuario
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
        crearPaseo(paseo, true);
    };

    const aceptarInvitacionPaseo = async(idUsuario: string, idPaseo: string) => {
        try {
            const result = await aceptarInvitacionPaseoDb(idUsuario, idPaseo);
            if (result) {
                setInvitacionAceptada(true);
            }
        } catch(error) {
            console.log("usePaseo->aceptarInvitacionPaseo::ERROR "+ JSON.stringify(error));
        }
    }

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
        protegerPaseo,
        removerPin,
        seAsignoPin,
        setSeAsignoPin,
        cerrarSeccion,
        seCerroSeccion,
        setSeCerroSeccion,
        aceptarInvitacionPaseo,
        invitacionAceptada,
        setPaseoSeleccionado,
        setPaseoSeleccionadoCargado
    };
};
