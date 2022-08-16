import { Integrante } from "src/paseos/schemas/integrantes.schema";

export class NotificacionPaseoActualizado {
  idPaseo: string;
  integrantes: Integrante[];
  modificacionesRealizadas: string[];
  nombrePaseo: string;
}
