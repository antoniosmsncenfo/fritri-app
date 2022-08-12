export interface IVotoLugar {
  idVotante: string;
  fecha: Date;
  resultado: string;
  nombreCompleto?: string;
  foto?: string;
  genero?: string;
}