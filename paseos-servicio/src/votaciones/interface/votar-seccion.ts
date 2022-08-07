import { Lugar } from "src/paseos/schemas/lugares.schema";

export interface IResultadoExiste {
  lugaresAVotar: Lugar[],
  prop: string,
  propPaseo: string,
}