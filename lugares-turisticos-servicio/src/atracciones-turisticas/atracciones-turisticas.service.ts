import {
  Language,
  LatLng,
  PlaceData,
  PlacesNearbyResponseData,
} from '@googlemaps/google-maps-services-js';
import { Injectable } from '@nestjs/common';
import {
  Categorias,
  GoogleApiService,
} from 'src/google-api/google-api.service';
import { AtraccionesTuristicasSolicitudDto } from './dto/atracciones-turisticas-solicitud.dto';
import { IdGoogleSolicitudDto } from './dto/id-google-solicitud.dto';
import { AtraccionTuristica } from './entities/atraccion-turistica.entity';
import { AtraccionesTuristicasRespuesta } from './entities/atracciones-turisticas-respuesta.entity';

@Injectable()
export class AtraccionesTuristicasService {
  constructor(private googleApiService: GoogleApiService) {}

  async obtenerAtraccionesTuristicasDelDestino(
    atraccionTuristicaSolicitud: AtraccionesTuristicasSolicitudDto,
  ): Promise<AtraccionesTuristicasRespuesta> {
    const coordenadas: LatLng = {
      lat: atraccionTuristicaSolicitud.latitud,
      lng: atraccionTuristicaSolicitud.longitud,
    };

    const tipoLugar = 'sights';
    const idiomaParametro = atraccionTuristicaSolicitud.idioma || 'es';
    const idioma: Language = Language[idiomaParametro];
    const radioMetros = atraccionTuristicaSolicitud.radio * 1000;

    const respuestaAtraccionesTuristicasGoogle: PlacesNearbyResponseData =
      await this.googleApiService.obtenerLugaresARedondaDelDestino(
        coordenadas,
        radioMetros,
        tipoLugar,
        atraccionTuristicaSolicitud.tokenPaginacion,
        idioma,
      );

    if (respuestaAtraccionesTuristicasGoogle) {
      const tokenPaginacion =
        respuestaAtraccionesTuristicasGoogle?.next_page_token ?? '';

      const atraccionesTuristicasObtenidos = Promise.all(
        respuestaAtraccionesTuristicasGoogle?.results.map((destinoGoogle) =>
          this.mapearPlaceDataAAtraccionTuristica(destinoGoogle),
        ),
      );

      return {
        tokenPaginacion,
        atraccionesTuristicas: await atraccionesTuristicasObtenidos,
      };
    } else {
      return {
        //Respuesta en caso de no encontrar atracciones Turisticas
        tokenPaginacion: '',
        atraccionesTuristicas: [],
      };
    }
  }

  async obtenerAtraccionTuristica(
    idGoogle: IdGoogleSolicitudDto,
  ): Promise<AtraccionTuristica> {
    const categorias: Categorias[] = [
      Categorias.place_id,
      Categorias.geometry,
      Categorias.photo,
      Categorias.name,
      Categorias.rating,
      Categorias.vicinity,
      Categorias.price_level,
    ];

    const idioma: Language = Language[idGoogle.idioma] || 'es';

    const respuestaAtraccionesTuristicasGoogle: Partial<PlaceData> =
      await this.googleApiService.obtenerDetalleLugar(
        idGoogle.idGoogle,
        categorias,
        idioma,
      );

    if (respuestaAtraccionesTuristicasGoogle) {
      return this.mapearPlaceDataAAtraccionTuristica(
        respuestaAtraccionesTuristicasGoogle,
      );
    } else {
      return null;
    }
  }

  async obtenerFotoDeGoogle(referenciaFoto: string) {
    return await this.googleApiService.obtenerFoto(referenciaFoto);
  }

  async mapearPlaceDataAAtraccionTuristica(destinoGoogle: Partial<PlaceData>) {
    const { place_id, geometry, photos, name, rating, vicinity, price_level } =
      destinoGoogle;

    const { lat, lng } = geometry.location;

    const urlsFotos = photos?.map((foto) => {
      return foto.photo_reference;
    });

    let urlFoto = '';

    if (urlsFotos && urlsFotos.length > 0) {
      const indexFoto = Math.floor(Math.random() * urlsFotos.length); //para obtener un index aleatorio de las posibles fotos
      urlFoto = await this.obtenerFotoDeGoogle(urlsFotos[indexFoto]);
    }

    return {
      idGoogle: place_id,
      latitud: lat,
      longitud: lng,
      nombre: name,
      vecindario: (vicinity?.split(',')[1] || '').trimStart(), //en el caso de que no tenga provincia pone ''
      urlFoto: urlFoto, //toma la primera foto, en caso de no tener pone vacio
      rangoPrecios: price_level,
      calificacion: rating,
    };
  }
}
