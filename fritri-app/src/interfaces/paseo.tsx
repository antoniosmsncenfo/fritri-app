
export interface IPaseo {
    _id:                            string;
    idCreador:                      string;
    nombre:                         string;
    fechaPaseo:                     Date;
    esCompartido:                   boolean;
    destino:                        IDestino;
    seccionRestaurantes:            ISeccionRestaurantes;
    seccionAtraccionesTuristicas:   ISeccionAtraccionesTuristicas;
    integrantes:                    Integrante[];
    eliminado:                      boolean;
    fechaCreacion:                  string;
    __v:                            number;
}

export interface IDestino {
    _id: string;
    nombre:             string;
    urlFotosDestino:    string[];
    pais:               string;
    idLugarGoogle:      string;
    descripcion:        string;
}

export interface IRestaurante {
    nombre: string;
    urlFotos: string[];
    descripcion: string;
    idLugarGoogle: string;
}

export interface ISeccionRestaurantes {
    _id: string;
    esFinalizadasVotaciones: boolean;
    fechaFinalizacionVotaciones: Date;
    restaurantes: IRestaurante[];
}

export interface IAtraccionesturistica {
    nombre: string;
    urlFotos: string[];
    descripcion: string;
    idLugarGoogle: string;
}

export interface ISeccionAtraccionesTuristicas {
    _id: string;
    esFinalizadasVotaciones: boolean;
    fechaFinalizacionVotaciones: Date;
    atraccionesturisticas: IAtraccionesturistica[];
}

export interface Integrante {
    idIntegrante: string;
    fechaIntegracion: Date;
    esConfirmadaAsistencia: boolean;
}