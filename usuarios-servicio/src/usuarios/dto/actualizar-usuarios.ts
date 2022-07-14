export class ActualizarUsuariosDto {
  readonly id: string;
  readonly correoElectronico: string;
  readonly nombreCompleto: string;
  readonly contrasena: string;
  readonly contrasenaTemporal: string;
  readonly urlFoto: string;
  readonly pais: string;
  readonly genero: string;
  // readonly fechaCreacion: Date;
  // readonly idTerceros: string;
  // readonly tipoLogin: string;
  // readonly token: string;
}