export class ActualizarNotificacionDto {
    readonly id: string;
    readonly esArchivada: boolean;
    readonly esLeida: boolean;
    readonly fechaModificacion?: Date;
  }