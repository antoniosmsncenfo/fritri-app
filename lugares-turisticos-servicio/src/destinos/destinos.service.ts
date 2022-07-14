import { Injectable } from '@nestjs/common';
import { GoogleApiService, Categorias } from '../google-api/google-api.service';
import { Language } from '@googlemaps/google-maps-services-js';
import {
  GeocodeResult,
  PlaceData,
  LatLng,
} from '@googlemaps/google-maps-services-js';
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

    const destinos = Promise.all(
      destinosGoogle.map((destinoGoogle) =>
        this.mapearGoogleADestino(destinoGoogle),
      ),
    );

    return destinos;
  }

  async buscarDestino(id: string) {
    const infoLugar: Categorias[] = [
      Categorias.place_id,
      Categorias.formatted_address,
      Categorias.geometry,
      Categorias.photo,
      Categorias.address_components,
    ];

    const destino = await this.googleApiService.obtenerInfoDestino(
      id,
      infoLugar,
    );
    return this.mapearPlaceDataADestino(destino);
  }

  async obtenerReferenciasFotosDestino(id: string) {
    const infoLugar: Categorias[] = [Categorias.photo];

    const fotos = await this.googleApiService.obtenerInfoDestino(id, infoLugar);

    const referenciasFotos = fotos.photos.map((foto) => {
      return foto.photo_reference;
    });

    return referenciasFotos;
  }

  async obtenerFotoDeGoogle(referenciaFoto: string) {
    return await this.googleApiService.obtenerFoto(referenciaFoto);
  }

  async mapearGoogleADestino(destinoGoogle: GeocodeResult) {
    const { place_id, address_components, formatted_address, geometry } =
      destinoGoogle;
    const { lat, lng } = geometry.location;

    const paises: AddressComponent[] = address_components.filter((c) =>
      c.types.includes(AddressType.country),
    );

    const provincias: AddressComponent[] = address_components.filter((c) =>
      c.types.includes(AddressType.administrative_area_level_1),
    );

    const urlsFotos = await this.obtenerReferenciasFotosDestino(place_id);
    let urlFoto = '';

    if (urlsFotos.length > 0) {
      const indexFoto = Math.floor(Math.random() * urlsFotos.length); //para obtener un index aleatorio de las posibles fotos
      urlFoto = await this.obtenerFotoDeGoogle(urlsFotos[indexFoto]);
    }

    return {
      idGoogle: place_id,
      descripcion: formatted_address,
      latitud: lat,
      longitud: lng,
      nombre: formatted_address,
      estado: provincias[0]?.long_name || '', //en el caso de que no tenga provincia pone ''
      pais: paises[0]?.long_name || '', //en el caso de que no tenga pais pone ''
      urlFoto: urlFoto, //toma la primera foto, en caso de no tener pone ''
    };
  }

  async mapearPlaceDataADestino(destinoGoogle: Partial<PlaceData>) {
    const {
      place_id,
      address_components,
      formatted_address,
      geometry,
      photos,
    } = destinoGoogle;
    const { lat, lng } = geometry.location;

    const paises: AddressComponent[] = address_components.filter((c) =>
      c.types.includes(AddressType.country),
    );

    const provincias: AddressComponent[] = address_components.filter((c) =>
      c.types.includes(AddressType.administrative_area_level_1),
    );

    const urlsFotos = photos.map((foto) => {
      return foto.photo_reference;
    });
    let urlFoto = '';

    if (urlsFotos.length > 0) {
      const indexFoto = Math.floor(Math.random() * urlsFotos.length); //para obtener un index aleatorio de las posibles fotos
      urlFoto = await this.obtenerFotoDeGoogle(urlsFotos[indexFoto]);
    }

    return {
      idGoogle: place_id,
      descripcion: formatted_address,
      latitud: lat,
      longitud: lng,
      nombre: formatted_address,
      estado: provincias[0]?.long_name || '', //en el caso de que no tenga provincia pone ''
      pais: paises[0]?.long_name || '', //en el caso de que no tenga provincia pone ''
      urlFoto: urlFoto, //toma la primera foto, en caso de no tener pone vacio
    };
  }
}
