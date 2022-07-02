export class CrearUsuariosDto {

  readonly tipoLogin: string;

  readonly correoElectronico?: string;

  readonly contrasena: string;

  readonly nombre: string;

  readonly apellidos: string;

  readonly urlFoto?: string

  readonly genero: number;

  readonly pais: number;

}
