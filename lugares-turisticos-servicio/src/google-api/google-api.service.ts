import { Client } from '@googlemaps/google-maps-services-js';
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
}
