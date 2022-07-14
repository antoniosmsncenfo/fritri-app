import { ConsoleLogger, Injectable } from '@nestjs/common';
import { GoogleApiService } from '../google-api/google-api.service';

import {
  LatLng,
  Language,
  PlacesNearbyResponseData,
  PlaceData,
} from '@googlemaps/google-maps-services-js';

import { RestauranteSolicitudDto } from './dto/restaurante-solicitud.dto';
import { RestauranteRespuesta } from './entities/restaurante-respuesta.entity';
import { Restaurante } from './entities/restaurante.entity';

@Injectable()
export class RestaurantesService {
  constructor(private googleApiService: GoogleApiService) {}

  async obtenerRestaurantesDelDestino(
    restauranteSolicitud: RestauranteSolicitudDto,
  ): Promise<RestauranteRespuesta> {
    const coordenadas: LatLng = {
      lat: restauranteSolicitud.latitud,
      lng: restauranteSolicitud.longitud,
    };
    const tipoLugar = 'restaurante';
    const idiomaParametro = restauranteSolicitud.idioma || 'es';
    const idioma: Language = Language[idiomaParametro];
    const radioMetros = restauranteSolicitud.radio * 1000;

    const respuestaRestaurantesGoogle: PlacesNearbyResponseData =
      await this.googleApiService.obtenerLugaresARedondaDelDestino(
        coordenadas,
        radioMetros,
        tipoLugar,
        restauranteSolicitud.tokenPaginacion,
        idioma,
      );

    if (respuestaRestaurantesGoogle) {
      const tokenPaginacion =
        respuestaRestaurantesGoogle?.next_page_token ?? '';

      const restaurantesObtenidos = Promise.all(
        respuestaRestaurantesGoogle?.results.map((destinoGoogle) =>
          this.mapearPlaceDataARestaurante(destinoGoogle),
        ),
      );

      return {
        tokenPaginacion,
        restaurantes: await restaurantesObtenidos,
      };
    } else {
      return {
        //Respuesta en caso de no encontrar restaurantes
        tokenPaginacion: '',
        restaurantes: [],
      };
    }
  }

  async obtenerFotoDeGoogle(referenciaFoto: string) {
    return await this.googleApiService.obtenerFoto(referenciaFoto);
  }

  async mapearPlaceDataARestaurante(destinoGoogle: Partial<PlaceData>) {
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
