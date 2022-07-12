export class ActualizarUsuariosDto {
  readonly id: string;
  readonly correoElectronico: string;
  readonly fechaCreacion: Date;
  readonly idTerceros: string;
  readonly nombreCompleto: string;
  readonly tipoLogin: string;
  readonly token: string;
  readonly urlFoto: string;
  readonly pais: string;
  readonly genero: string;
}