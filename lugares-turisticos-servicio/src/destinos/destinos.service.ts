import { Injectable } from '@nestjs/common';
import { GoogleApiService, Categorias } from '../google-api/google-api.service';
import {
  GeocodeResult,
  PlaceData,
  LatLng,
  Language,
} from '@googlemaps/google-maps-services-js';
import {
  AddressComponent,
  AddressType,
} from '@googlemaps/google-maps-services-js';
import { DestinoSolicitudDto } from './dto/destino-solicitud.dto';
import { IdGoogleSolicitudDto } from './dto/id-google-solicitud.dto';
import { DestinoPorCoordenadasSolicitudDto } from './dto/destino-por-ubicacion-solicitud.dto';
import { EstadisticasService } from '../estadisticas/estadisticas.service';
import { Destino } from './entities/destino.entity';
import { Estadistica } from 'src/estadisticas/dto/estadistica-destino';

@Injectable()
export class DestinosService {
  constructor(
    private googleApiService: GoogleApiService,
    private estadisticasService: EstadisticasService,
  ) {}

  async buscarDestinosPorCoordenadas(
    destinoPorUbicacionSolicitud: DestinoPorCoordenadasSolicitudDto,
  ) {
    const coordenadas: LatLng = {
      lat: destinoPorUbicacionSolicitud.latitud,
      lng: destinoPorUbicacionSolicitud.longitud,
    };
    const idiomaParametro = destinoPorUbicacionSolicitud.idioma || 'es';
    const idioma: Language = Language[idiomaParametro];

    const destinosGoogle =
      await this.googleApiService.buscarDestinosPorCoordenadas(
        coordenadas,
        idioma,
      );

    const destinos = Promise.all(
      destinosGoogle.map((destinoGoogle) =>
        this.mapearGoogleADestino(destinoGoogle),
      ),
    );

    return destinos;
  }
  async buscarDestinos(destinoDto: DestinoSolicitudDto) {
    const destinosGoogle = await this.googleApiService.obtenerDestinos(
      destinoDto.nombre,
      destinoDto.idioma,
    );

    const destinos = Promise.all(
      destinosGoogle.map((destinoGoogle) =>
        this.mapearGoogleADestino(destinoGoogle),
      ),
    );
    this.estadisticasService.crearEstadisticaDestino(
      await destinos,
      destinoDto.idUsuario,
    );

    return destinos;
  }

  async obtenerDestino(idGoogle: IdGoogleSolicitudDto) {
    const infoLugar: Categorias[] = [
      Categorias.place_id,
      Categorias.formatted_address,
      Categorias.geometry,
      Categorias.photo,
      Categorias.address_components,
    ];

    const destino = await this.googleApiService.obtenerDetalleLugar(
      idGoogle.idGoogle,
      infoLugar,
    );
    return this.mapearPlaceDataADestino(destino);
  }

  async obtenerReferenciasFotosDestino(id: string) {
    const infoLugar: Categorias[] = [Categorias.photo];

    const fotos = await this.googleApiService.obtenerDetalleLugar(
      id,
      infoLugar,
    );

    let referenciasFotos: string[] = [];

    if (fotos && fotos.photos?.length > 0) {
      referenciasFotos = fotos.photos?.map((foto) => {
        return foto.photo_reference;
      });
    }

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

    const urlsFotosReferences = await this.obtenerReferenciasFotosDestino(
      place_id,
    );
    const urlFotos: string[] = [];

    if (urlsFotosReferences && urlsFotosReferences.length > 0) {
      const indexFoto = Math.floor(Math.random() * urlsFotosReferences.length); //para obtener un index aleatorio de las posibles fotos
      const url = await this.obtenerFotoDeGoogle(
        urlsFotosReferences[indexFoto],
      );
      if (url !== '') {
        urlFotos.push(url);
      }
    } else {
      urlFotos.push(
        'https://maps.gstatic.com/tactile/pane/default_geocode-2x.png',
      );
    }

    return {
      idGoogle: place_id,
      descripcion: formatted_address,
      latitud: lat,
      longitud: lng,
      nombre: formatted_address,
      estado: provincias[0]?.long_name || '', //en el caso de que no tenga provincia pone ''
      pais: paises[0]?.long_name || '', //en el caso de que no tenga pais pone ''
      urlFotos: urlFotos, //toma la primera foto, en caso de no tener pone ''
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

    const paises: AddressComponent[] = address_components?.filter((c) =>
      c.types.includes(AddressType.country),
    );

    const provincias: AddressComponent[] = address_components?.filter((c) =>
      c.types.includes(AddressType.administrative_area_level_1),
    );

    const urlsFotosReferences = photos?.map((foto) => {
      return foto.photo_reference;
    });

    const urlFotos: string[] = [];

    if (urlsFotosReferences && urlsFotosReferences.length > 0) {
      const indexFoto = Math.floor(Math.random() * urlsFotosReferences.length); //para obtener un index aleatorio de las posibles fotos
      const url = await this.obtenerFotoDeGoogle(
        urlsFotosReferences[indexFoto],
      );
      if (url !== '') {
        urlFotos.push(url);
      }
    } else {
      urlFotos.push(
        'https://maps.gstatic.com/tactile/pane/default_geocode-2x.png',
      );
    }

    return {
      idGoogle: place_id,
      descripcion: formatted_address,
      latitud: lat,
      longitud: lng,
      nombre: formatted_address,
      estado: provincias[0]?.long_name || '', //en el caso de que no tenga provincia pone ''
      pais: paises[0]?.long_name || '', //en el caso de que no tenga provincia pone ''
      urlFotos: urlFotos, //toma la primera foto, en caso de no tener pone vacio
    };
  }
}
