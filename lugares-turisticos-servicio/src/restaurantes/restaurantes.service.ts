import { ConsoleLogger, Injectable } from '@nestjs/common';
import { Categorias, GoogleApiService } from '../google-api/google-api.service';

import {
  LatLng,
  Language,
  PlacesNearbyResponseData,
  PlaceData,
} from '@googlemaps/google-maps-services-js';

import { RestaurantesSolicitudDto } from './dto/restaurantes-solicitud.dto';
import { RestauranteRespuesta } from './entities/restaurante-respuesta.entity';
import { Restaurante } from './entities/restaurante.entity';
import { IdGoogleSolicitudDto } from './dto/id-google-solicitud.dto';

@Injectable()
export class RestaurantesService {
  constructor(private googleApiService: GoogleApiService) {}

  async obtenerRestaurantesDelDestino(
    restauranteSolicitud: RestaurantesSolicitudDto,
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

  async obtenerRestaurante(
    idGoogle: IdGoogleSolicitudDto,
  ): Promise<Restaurante> {
    const categorias: Categorias[] = [
      Categorias.place_id,
      Categorias.geometry,
      Categorias.photo,
      Categorias.name,
      Categorias.rating,
      Categorias.vicinity,
      Categorias.price_level,
      Categorias.formatted_phone_number,
      Categorias.formatted_address
    ];

    const idioma: Language = Language[idGoogle.idioma] || 'es';

    const respuestaRestaurantesGoogle: Partial<PlaceData> =
      await this.googleApiService.obtenerDetalleLugar(
        idGoogle.idGoogle,
        categorias,
        idioma,
      );

    if (respuestaRestaurantesGoogle) {
      return this.mapearPlaceDataARestaurante(respuestaRestaurantesGoogle);
    } else {
      return null;
    }
  }

  async obtenerFotoDeGoogle(referenciaFoto: string) {
    return await this.googleApiService.obtenerFoto(referenciaFoto);
  }

  async mapearPlaceDataARestaurante(destinoGoogle: Partial<PlaceData>) {
    const { place_id, geometry, photos, name, rating, vicinity, price_level, formatted_phone_number, formatted_address } =
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
      telefono: formatted_phone_number,
      direccion: formatted_address,
      tipoLugar: 'restaurante'
    };
  }
}
