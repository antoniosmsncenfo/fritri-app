import { Injectable } from '@nestjs/common';
import { Destino } from './entities/destino.entity';

@Injectable()
export class DestinosService {
  buscarDestinos(nombre: string) {
    const destinos: Destino[] = [
      {
        nombre: nombre,
        urlFoto: 'string',
        descripcion: 'string',
        idGoogle: 'string',
      },
    ];
    return destinos;
  }

  buscarDestino(idGoogle: string) {
    const destino: Destino = {
      nombre: 'nombre',
      urlFoto: 'string',
      descripcion: 'string',
      idGoogle: idGoogle,
    };
    return destino;
  }
}
