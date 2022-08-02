import { Lugar } from "src/paseos/schemas/lugares.schema";

export interface IResultadoExiste {
  lugarAVotar: Lugar,
  prop: string,
  propPaseo: string,
  indexLugar: number
}