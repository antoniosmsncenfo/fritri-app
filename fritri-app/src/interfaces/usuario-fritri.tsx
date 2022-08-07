export interface IUsuarioFritri {
    __v?: number;
    _id?: string;
    correoElectronico: string;
    fechaCreacion?: Date;
    idTerceros: string;
    nombreCompleto: string;
    tipoLogin: string;
    token: string;
    urlFoto: string;
    pais?: string;
    genero?: string;
    access_token?: string;
}

export interface IUsuarioContrasena {
    _id: string;
    contrasena?: string;
    contrasenaTemporal?: string;
}

export interface IUsuarioPaseo {
    _id: string;
    correoElectronico: string;
    nombreCompleto: string;
    urlFoto: string
}

export enum LoginStatus {
    New = 'NEW',
    InvalidMail = 'INVALID',
    Valid = 'VALID'
  }
