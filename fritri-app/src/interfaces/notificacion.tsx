export interface INotificacion {
    _id?: string;
    idUsuario: string;
    idPaseo?: string;
    titulo: string;
    detalle: string;
    esLeida?: boolean;
    esArchivada?: boolean;
    fechaCreacion?: Date;
    fechaModificacion?: Date;
    __v?: number;
}