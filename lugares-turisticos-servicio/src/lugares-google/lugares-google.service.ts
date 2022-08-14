import { Injectable } from '@nestjs/common';
import { Categorias, GoogleApiService } from '../google-api/google-api.service';

import {
  LatLng,
  Language,
  PlacesNearbyResponseData,
  PlaceData,
} from '@googlemaps/google-maps-services-js';

import { LugaresGoogleSolicitudDto } from './dto/lugares-google-solicitud.dto';
import { LugarGoogleRespuesta } from './entities/lugar-google-respuesta.entity';
import { LugarGoogle } from './entities/lugar-google.entity';
import { IdGoogleSolicitudDto } from './dto/id-google-solicitud.dto';
import { Estadistica } from 'src/estadisticas/dto/estadistica-destino';
import { EstadisticasService } from '../estadisticas/estadisticas.service';

@Injectable()
export class LugaresGoogleService {
  constructor(
    private googleApiService: GoogleApiService,
    private estadisticasService: EstadisticasService,
  ) {}

  async obtenerLugaresGoogleDelDestino(
    lugarGoogleSolicitud: LugaresGoogleSolicitudDto,
  ): Promise<LugarGoogleRespuesta> {
    const coordenadas: LatLng = {
      lat: lugarGoogleSolicitud.latitud,
      lng: lugarGoogleSolicitud.longitud,
    };
    const tipoLugar = lugarGoogleSolicitud.tipo;
    const idiomaParametro = lugarGoogleSolicitud.idioma || 'es';
    const idioma: Language = Language[idiomaParametro];
    const radioMetros = lugarGoogleSolicitud.radio * 1000;

    const respuestaLugaresGoogle: PlacesNearbyResponseData =
      await this.googleApiService.obtenerLugaresARedondaDelDestino(
        coordenadas,
        radioMetros,
        tipoLugar,
        lugarGoogleSolicitud.tokenPaginacion,
        idioma,
      );

    if (respuestaLugaresGoogle) {
      const tokenPaginacion = respuestaLugaresGoogle?.next_page_token ?? '';

      const lugaresGoogleObtenidos = Promise.all(
        respuestaLugaresGoogle?.results.map((destinoGoogle) =>
          this.mapearPlaceDataALugarGoogle(destinoGoogle, tipoLugar),
        ),
      );

      this.estadisticasService.crearEstadisticaLugar(
        await lugaresGoogleObtenidos,
        lugarGoogleSolicitud.idUsuario,
        lugarGoogleSolicitud.tipo,
      );

      return {
        tokenPaginacion,
        lugaresGoogle: await lugaresGoogleObtenidos,
      };
    } else {
      return {
        //Respuesta en caso de no encontrar lugares
        tokenPaginacion: '',
        lugaresGoogle: [],
      };
    }
  }

  async obtenerLugarGoogle(
    idGoogle: IdGoogleSolicitudDto,
  ): Promise<LugarGoogle> {
    const categorias: Categorias[] = [
      Categorias.place_id,
      Categorias.geometry,
      Categorias.photo,
      Categorias.name,
      Categorias.rating,
      Categorias.vicinity,
      Categorias.price_level,
      Categorias.formatted_phone_number,
      Categorias.formatted_address,
    ];

    const idioma: Language = Language[idGoogle.idioma] || 'es';

    const respuestaLugaresGoogle: Partial<PlaceData> =
      await this.googleApiService.obtenerDetalleLugar(
        idGoogle.idGoogle,
        categorias,
        idioma,
      );

    if (respuestaLugaresGoogle) {
      return this.mapearPlaceDataALugarGoogle(respuestaLugaresGoogle);
    } else {
      return null;
    }
  }

  async obtenerFotoDeGoogle(referenciaFoto: string) {
    return await this.googleApiService.obtenerFoto(referenciaFoto);
  }

  async mapearPlaceDataALugarGoogle(
    destinoGoogle: Partial<PlaceData>,
    tipo = 'lugarGoogle',
  ) {
    const {
      place_id,
      geometry,
      photos,
      name,
      rating,
      vicinity,
      price_level,
      formatted_phone_number,
      formatted_address,
    } = destinoGoogle;

    const { lat, lng } = geometry.location;

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
      latitud: lat,
      longitud: lng,
      nombre: name,
      vecindario: (vicinity?.split(',')[1] || '').trimStart(), //en el caso de que no tenga provincia pone ''
      urlFotos: urlFotos, //toma la primera foto, en caso de no tener pone vacio el arreglo
      rangoPrecios: price_level || 1,
      calificacion: rating || 2,
      telefono: formatted_phone_number,
      direccion: formatted_address,
      tipoLugar: tipo,
    };
  }
}
