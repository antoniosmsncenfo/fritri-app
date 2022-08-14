import { useState } from 'react';
import { votarSeccionDb } from '../api/votacionDB';
import { ITipoVotoEnviar } from '../interfaces/tipo-voto';

export const useVotacion = () => {

  const [enviandoVotacionRest, setEnviandoVotacionRest] = useState(false);
  const [enviandoVotacionAtr, setEnviandoVotacionAtr] = useState(false);
  const [respRest, setRespRest] = useState();
  const [respAtr, setRespAtr] = useState();
    async function votarSeccion(idIntegrante:string, idPaseo: string, idSecciones:ITipoVotoEnviar[], tipoSeccion: string): Promise<any> {
      let resultado;
      try {
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
        setEnviandoVotacionRest(false);
      } else {
        setEnviandoVotacionAtr(false);
      }
      return resultado;
    };
  
  // const [seCerroSeccion, setSeCerroSeccion] = useState(false);

  // async function cerrarSeccion(idPaseo:string, tipo:TipoSeccion): Promise<any> {
  //   let resultado;
  //   try {
  //     const resultado = await cerrarSeccionDb(idPaseo, tipo);
      
  //     if(resultado) {
  //       setSeCerroSeccion(true)
  //     }

  //   } catch(error) {
  //     console.log("useVotacion->cerrarSeccion::ERROR "+ JSON.stringify(error));
  //     resultado = false;
  //   }

  //   return resultado;
  // };

    return {
      votarSeccion,
      enviandoVotacionRest,
      enviandoVotacionAtr,
      setEnviandoVotacionRest,
      setEnviandoVotacionAtr,
      respRest,
      respAtr,
      // cerrarSeccion,
      // seCerroSeccion,
      // setSeCerroSeccion
    };


};
