import { Injectable } from '@nestjs/common';
import { Destino } from './entities/destino.entity';
import { GoogleApiService } from '../google-api/google-api.service';
import { GeocodeResult } from '@googlemaps/google-maps-services-js';
import {
  AddressComponent,
  AddressType,
} from '@googlemaps/google-maps-services-js';

@Injectable()
export class DestinosService {
  constructor(private googleApiService: GoogleApiService) {}

  async buscarDestinos(nombre: string, idioma = 'es') {
    const destinosGoogle = await this.googleApiService.obtenerDestinos(
      nombre,
      idioma,
    );

    const destinos: Destino[] = destinosGoogle.map((destinoGoogle) =>
      this.mapearGoogleADestino(destinoGoogle),
    );

    return destinos;
  }

  buscarDestino(idGoogle: string) {
    const destino: Destino = {
      nombre: 'nombre',
      urlFoto: 'string',
      descripcion: 'string',
      idGoogle: idGoogle,
      latitud: 9.256,
      longitud: -84.256,
      estado: 'string',
      pais: 'string',
    };
    return destino;
  }

  private mapearGoogleADestino(destinoGoogle: GeocodeResult) {
    const { place_id, address_components, formatted_address, geometry } =
      destinoGoogle;
    const { lat, lng } = geometry.location;

    const paises: AddressComponent[] = address_components.filter((c) =>
      c.types.includes(AddressType.country),
    );

    const provincias: AddressComponent[] = address_components.filter((c) =>
      c.types.includes(AddressType.administrative_area_level_1),
    );

    return {
      idGoogle: place_id,
      descripcion: formatted_address,
      latitud: lat,
      longitud: lng,
      nombre: formatted_address,
      estado: provincias[0]?.long_name || '', //en el caso de que no tenga provincia pone ''
      pais: paises[0]?.long_name || '', //en el caso de que no tenga provincia pone ''
      urlFoto: '',
    };
  }
}
