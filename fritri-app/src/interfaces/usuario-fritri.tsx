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

}

export interface IUsuarioContrasena {
    _id: string;
    contrasena?: string;
    contrasenaTemporal?: string;
}
