import { useState } from 'react';
import { votarSeccionDb } from '../api/votacionDB';
import { ITipoVotoEnviar } from '../interfaces/tipo-voto';

export const useVotacion = () => {

  const [votacionFinalizadaRest, setVotacionFinalizadaRest] = useState(false);
  const [votacionFinalizadaAtr, setVotacionFinalizadaAtr] = useState(false);
  const [respRest, setRespRest] = useState();
  const [respAtr, setRespAtr] = useState();
    async function votarSeccion(idIntegrante:string, idPaseo: string, idSecciones:ITipoVotoEnviar[], tipoSeccion: string): Promise<any> {
      let resultado;
      try {
        if(tipoSeccion === 'RESTAURANTE') {
          setVotacionFinalizadaRest(false);
        } else {
          setVotacionFinalizadaAtr(false);
        }
        const tempResultado = await votarSeccionDb(idIntegrante, idPaseo, idSecciones, tipoSeccion);
        resultado = tempResultado.data;
        if(resultado && tipoSeccion === 'RESTAURANTE') {
          setRespRest(resultado)
        } else {
          setRespAtr(resultado)
        }
      } catch(error) {
        console.log("useVotacion->votarSeccion::ERROR "+ JSON.stringify(error));
        resultado = false;
      }
      if(tipoSeccion === 'RESTAURANTE') {
        setVotacionFinalizadaRest(true);
      } else {
        setVotacionFinalizadaAtr(true);
      }
      return resultado;
    };


    return {
      votarSeccion,
      votacionFinalizadaRest,
      votacionFinalizadaAtr,
      respRest,
      respAtr
    };


};
