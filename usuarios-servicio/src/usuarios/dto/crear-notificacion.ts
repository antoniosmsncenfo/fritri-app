export class CrearNotificacionDto {

    readonly idUsuario: string;

    readonly idPaseo: string;

    readonly titulo: string;    

    readonly detalle: string;

    readonly esArchivada?: boolean;

    readonly esLeida?: boolean;

    readonly fechaCreacion?: Date;

  }