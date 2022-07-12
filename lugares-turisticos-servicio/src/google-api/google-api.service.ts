import {
  Client,
  Language,
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
  vicini = 'vicinity',
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
        timeout: 1000, // milliseconds
      });

      if (response.statusText === 'OK') {
        return response.data.results;
      } else {
        return [];
      }
    } catch (error) {
      Logger.error(
        `Error obtenerDestinos: ${JSON.stringify(error.response.data)}`,
        'GoogleApiService',
      );
      return [];
    }
  }

  /**Obtiene el lugare que coinciden con el id de google */
  async obtenerInfoDestino(id: string, categorias: Categorias[]) {
    const client = new Client({});
    const resultadoVacio: Partial<PlaceData> = null;
    try {
      const response = await client.placeDetails({
        params: {
          place_id: id,
          key: this.key,
          language: Language.es,
          fields: categorias,
        },
        timeout: 1000, // milliseconds
      });

      if (response.statusText === 'OK') {
        return response.data.result;
      } else {
        console.log('sin resultados');
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
        timeout: 1000, // milliseconds
      });

      if (response.statusText === 'OK') {
        return response.data.responseUrl;
      } else {
        return '';
      }
    } catch (error) {
      Logger.error(
        `Error obtenerFoto: ${JSON.stringify(error.response.data)}`,
        'GoogleApiService',
      );
      return '';
    }
  }
}
