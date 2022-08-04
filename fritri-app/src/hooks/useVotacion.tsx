import { useState } from 'react';
import { votarSeccionDb } from '../api/votacionDB';

export const useVotacion = () => {

  const [votacionFinalizada, setVotacionFinalizada] = useState(false);
    async function votarSeccion(idIntegrante:string, idPaseo: string, idSecciones:(string|undefined)[], tipoSeccion: string): Promise<any> {
      let resultado;
      try {
        const tempResultado = await votarSeccionDb(idIntegrante, idPaseo, idSecciones, tipoSeccion);
        resultado = tempResultado.data;
        if(resultado) {
          setVotacionFinalizada(true);
        }
      } catch(error) {
        console.log("useVotacion->votarSeccion::ERROR "+ JSON.stringify(error));
        resultado = false;
      }
      return resultado;
    };


    return {
      votarSeccion,
      votacionFinalizada
    };


};
