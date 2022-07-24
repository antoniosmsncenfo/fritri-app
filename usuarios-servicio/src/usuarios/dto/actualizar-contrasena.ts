export class ActualizarContrasenaDto {
    readonly _id: string;
    contrasena?: string;
    contrasenaTemporal?: string;
    fechaContrasenaTemporal?: Date;
  }