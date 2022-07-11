import {
  Client,
  Language,
  PlaceInputType,
} from '@googlemaps/google-maps-services-js';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GoogleApiService {
  key: string = process.env.GOOGLE_API_KEY;
  /**Obtiene lista de lugares que coinciden con texto ingresado */
  obtenerDestinos = async (destino: string, idioma = 'es') => {
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
  };

  /**Obtiene el lugare que coinciden con el id de google */
  obtenerInfoDestino = async (id: string) => {
    const client = new Client({});
    try {
      const response = await client.findPlaceFromText({
        params: {
          input: id,
          key: this.key,
          inputtype: PlaceInputType.textQuery,
          language: Language.es,
          fields: ['photo'],
        },
        timeout: 1000, // milliseconds
      });

      if (response.statusText === 'OK') {
        return response.data.candidates;
      } else {
        return [];
      }
    } catch (error) {
      Logger.error(
        `Error obtenerInfoDestino: ${JSON.stringify(error.response.data)}`,
        'GoogleApiService',
      );
      return [];
    }
  };

  obtenerFoto = async (id: string, ancho = 640, alto = 480) => {
    const client = new Client({});
    try {
      const response = await client.placePhoto({
        params: {
          key: this.key,
          photoreference: id,
          maxheight: alto,
          maxwidth: ancho,
        },
        responseType: 'blob',
        timeout: 1000, // milliseconds
      });

      if (response.statusText === 'OK') {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      Logger.error(
        `Error obtenerFoto: ${JSON.stringify(error.response.data)}`,
        'GoogleApiService',
      );
      return [];
    }
  };
}
