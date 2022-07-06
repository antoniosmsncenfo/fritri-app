import { useState, useEffect } from 'react';
import * as Facebook from 'expo-facebook';
import axios from 'axios';
import { IUsuarioDeTerceros } from '../interfaces/usuario-facebook';
import { IRespuestaFacebook } from '../interfaces/respuesta-facebook';
import { FACEBOOK_APP_ID} from '@env';

let VALOR_INICIAL = {
  id: '',
  name: '',
  picture: {
    data: {
      height: 720,
      is_silhouette: false,
      url: '',
      width: 720,
    },
  },
};

export const useFacebook = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [userData, setUserData] = useState<IRespuestaFacebook>(VALOR_INICIAL);

  const guardarUsuario = async () => {
    try {
      if (userData.id) {
        const informacionUsuario: IUsuarioDeTerceros = obtenerInformacion();
        let request = {
          method: 'post',
          url: 'http://192.168.1.239:3001/usuarios/login-terceros',
          headers: {},
          data: informacionUsuario,
        };
        const resultado = await axios(request);
        if (resultado.status === 201) {
          // Redireccionar a dashboard
        } else {
          // Mostrar mensaje de error
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerInformacion = (): IUsuarioDeTerceros => {
    const { name, id, picture } = userData;
    return {
      idTerceros: id,
      tipoLogin: 'Facebook',
      nombreCompleto: name,
      urlFoto: picture.data.url,
      token: token,
    };
  };

  useEffect(() => {
    guardarUsuario();
  }, [userData]);

  const facebookLogin = async () => {
    try {
      await Facebook.initializeAsync({
        appId: FACEBOOK_APP_ID,
      });
      const resultadoLogin = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });
      console.log(resultadoLogin);
      const { type } = resultadoLogin;
      if (type === 'success') {
        setToken(resultadoLogin.token);
        let request = {
          method: 'get',
          url: `https://graph.facebook.com/me?access_token=${resultadoLogin.token}&fields=id,name,email,picture.height(500)`,
          headers: {},
        };
        const resultado = await axios(request);
        const datos = JSON.parse(JSON.stringify(resultado.data));
        setIsLoggedIn(true);
        setUserData(datos);
      }
    } catch (error) {
      console.log('error login facebook');
      console.log(error);
      // TODO: Mostrar error en pantalla
    }
  };

  const facebookLogout = () => {
    setIsLoggedIn(false);
    setUserData(VALOR_INICIAL);
  };

  return {
    facebookLogin,
    facebookLogout,
    userData,
    isLoggedIn,
  };

};
