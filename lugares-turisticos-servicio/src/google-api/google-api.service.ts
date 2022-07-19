import {
  Client,
  Language,
  LatLng,
  PlaceData,
} from '@googlemaps/google-maps-services-js';
import { Injectable, Logger } from '@nestjs/common';

export enum Categorias {
  address_components = 'address_components',
  adr_address = 'adr_address',
  business_status = 'business_status',
  formatted_address = 'formatted_address',
  geometry = 'geometry',
  icon = 'icon',
  icon_mask_base_uri = 'icon_mask_base_uri',
  icon_background_color = 'icon_background_color',
  name = 'name',
  permanently_closed = 'permanently_closed',
  photo = 'photo',
  place_id = 'place_id',
  plus_code = 'plus_code',
  type = 'type',
  url = 'url',
  utc_offset = 'utc_offset',
  vicinity = 'vicinity',
  formatted_phone_number = 'formatted_phone_number',
  international_phone_number = 'international_phone_number',
  opening_hours = 'opening_hours',
  website = 'website',
  price_level = 'price_level',
  rating = 'rating',
  review = 'review',
  user_ratings_total = 'user_ratings_total',
}

@Injectable()
export class GoogleApiService {
  key: string = process.env.GOOGLE_API_KEY;
  private timeout = 5000;

  /**Obtiene lista de lugares que coinciden con texto ingresado */
  async obtenerDestinos(destino: string, idioma = 'es') {
    const client = new Client({});
    try {
      const response = await client.geocode({
        params: {
          address: destino,
          key: this.key,
          language: idioma,
        },
        timeout: this.timeout, // milliseconds
      });

      if (response.statusText === 'OK') {
        return response.data.results;
      } else {
        return [];
      }
    } catch (error) {
      Logger.error(
        `Error obtenerDestinos: ${error.response?.data?.error_message}`,
        'GoogleApiService',
      );
      return [];
    }
  }

  /**Obtiene el lugar que coinciden con el id de google */
  async obtenerDetalleLugar(
    id: string,
    categorias: Categorias[],
    idioma: Language = Language.es,
  ) {
    const client = new Client({});
    const resultadoVacio: Partial<PlaceData> = null;
    try {
      const response = await client.placeDetails({
        params: {
          place_id: id,
          key: this.key,
          language: idioma,
          fields: categorias,
        },
        timeout: this.timeout, // milliseconds
      });

      if (response.statusText === 'OK') {
        return response.data.result;
      } else {
        return resultadoVacio;
      }
    } catch (error) {
      Logger.error(
        `Error obtenerInfoDestino: ${JSON.stringify(error.response.data)}`,
        'GoogleApiService',
      );
      return resultadoVacio;
    }
  }

  async obtenerFoto(
    referenciaFoto: string,
    ancho = 640,
    alto = 480,
  ): Promise<string> {
    const client = new Client({});
    try {
      const response = await client.placePhoto({
        params: {
          key: this.key,
          photoreference: referenciaFoto,
          maxheight: alto,
          maxwidth: ancho,
        },
        responseType: 'stream',
        timeout: this.timeout, // milliseconds
      });

      if (response.statusText === 'OK') {
        return response.data.responseUrl;
      } else {
        return '';
      }
    } catch (error) {
      Logger.error(
        `Error obtenerFoto: ${JSON.stringify(error.response?.data)}`,
        'GoogleApiService',
      );
      return '';
    }
  }

  /**Obtiene lista de restaurantes cerca de un destino*/
  async obtenerLugaresARedondaDelDestino(
    coordendas: LatLng,
    radio: number,
    tipoLugar: string,
    tokenPaginacion: string,
    idioma: Language = Language.es,
  ) {
    const client = new Client({});
    try {
      const response = await client.placesNearby({
        params: {
          location: coordendas,
          radius: radio,
          keyword: tipoLugar,
          key: this.key,
          language: idioma,
          pagetoken: tokenPaginacion,
        },
        timeout: this.timeout, // milliseconds
      });

      if (response.statusText === 'OK') {
        return response.data;
      } else {
        return null;
      }
    } catch (error) {
      Logger.error(
        `Error obtenerLugaresARedondaDelDestino: ${JSON.stringify(
          error.message,
        )}`,
        'GoogleApiService',
      );
      return null;
    }
  }
}
