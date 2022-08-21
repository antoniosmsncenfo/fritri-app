
export interface IPaseo {
    _id?: string;
    idCreador: string;
    nombre: string;
    fechaPaseo: Date;
    esCompartido: boolean;
    destino: IDestino;
    seccionRestaurantes?: ISeccionRestaurantes;
    seccionAtraccionesTuristicas?: ISeccionAtraccionesTuristicas;
    integrantes?: Integrante[];
    eliminado: boolean;
    fechaCreacion: Date;
    pinPaseo?: number;
    esAleatorio?: boolean;
    __v?: number;
}

export interface IDestino {
    _id?: string;
    nombre: string;
    urlFotos?: string[];
    pais?: string;
    idLugarGoogle?: string;
    descripcion?: string;
    estado?: string;
    latitud?: number;
    longitud?: number;
    idGoogle?: string;
    tipoLugar?: string;
}

export interface IVotacion {
    idVotante: string,
    fecha: Date,
    resultado: string;
}

export interface ILugar {
    nombre: string;
    urlFotos: string[];
    descripcion?: string;
    idLugarGoogle: string;
    latitud?: number,
    longitud?: number,
    vecindario?: string,
    rangoPrecios?: number
    calificacion?: number,
    tipoLugar?: string,
    votaciones?: IVotacion[]
}

export interface ISeccionRestaurantes {
    _id?: string;
    esFinalizadasVotaciones: boolean;
    fechaFinalizacionVotaciones: Date;
    restaurantes: ILugar[];
}

export interface IAtraccionesturistica {
    nombre: string;
    urlFotos: string[];
    descripcion?: string;
    idLugarGoogle: string;
    latitud: number,
    longitud: number,
    vecindario: string,
    rangoPrecios?: number
    calificacion: number,
    tipoLugar: string,
    votaciones?: IVotacion[]
}

export interface ISeccionAtraccionesTuristicas {
    _id?: string;
    esFinalizadasVotaciones: boolean;
    fechaFinalizacionVotaciones: Date;
    atraccionesturisticas: ILugar[];
}

export interface Integrante {
    idIntegrante: string;
    fechaIntegracion: Date;
    esConfirmadaAsistencia: boolean;
}

export enum CantidadPaseos {
    Cinco = 5,
    Diez = 10,
    Quince = 15,
    Veinte = 20
}

export enum EstadoPaseo {
    Pendiente = 1,
    Completado = 2
}

export interface ISolicitudPaseoAleatorio {
    destino: IDestino;
    fechaPaseo: Date;
    idCreador: string;
    nombre: string;
}

export interface IPaseoUpdate extends IPaseo {
    idPaseo?: string;
    modificacionesRealizadas: string[];
}

export enum TipoSeccion {
    RESTAURANTE = 'RESTAURANTE',
    ATRACCION_TURISTICA = 'ATRACCION_TURISTICA' 
  }

export enum EstadoFinal {
    PROGRAMADO = 'PROGRAMADO',
    CANCELADO = 'CANCELADO',
    REALIZADO = 'REALIZADO' 
}  