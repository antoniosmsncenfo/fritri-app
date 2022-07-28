export interface ILugarGoogle {
  idGoogle: string;
  latitud: Number;
  longitud: Number;
  nombre: string;
  vecindario: string;
  urlFotos: string[];
  rangoPrecios?: number;
  calificacion: Number;
  telefono?: string;
  direccion?: string;
  tipoLugar?: string;
}
