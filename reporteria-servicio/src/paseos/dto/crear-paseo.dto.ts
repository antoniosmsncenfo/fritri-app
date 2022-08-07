export class CrearPaseoDto {
  readonly idPaseo?: string;

  readonly idCreador: string;

  readonly fechaCreacion: Date;

  readonly fechaPaseo: Date;

  readonly nombrePaseo: string;

  readonly paisPaseo: string;

  readonly paisCreador: string;

  readonly cantidadIntegrantes: string;

  readonly cantidadRestaurantes: string;

  readonly cantidadAtracciones: string;
}
