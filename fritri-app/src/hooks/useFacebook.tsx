import { useState, useEffect } from 'react';
import * as Facebook from 'expo-facebook';
import axios from 'axios';
import { FACEBOOK_APP_ID, USUARIOS_BASE_URL } from '@env';
import { IUsuarioFritri } from '../interfaces/usuario-fritri';

export const useFacebook = () => {
  const [isFritriUserFacebookLogged, setIsFritriUserFacebookLogged] = useState(false);
  const [fritriUser, setFritriUser] = useState<IUsuarioFritri | null>(null);
  const [fritriUserIdDb, setFritriUserIdDb] = useState<IUsuarioFritri | null>(null);

  const guardarUsuario = async () => {
    try {
      if (fritriUser?.idTerceros) {
        let request = {
          method: 'post',
          url: `${USUARIOS_BASE_URL}/login-terceros`,
          headers: {},
          data: fritriUser,
        };
        const resultado = await axios(request);
        if (resultado.status === 200) {
          setFritriUserIdDb(resultado?.data || null);
          setIsFritriUserFacebookLogged(true);
        } else {
          // Mostrar mensaje de error
        }
      }
    } catch (error) {
    }
  };

  useEffect(() => {
      guardarUsuario();
  }, [fritriUser]);

  const facebookLogin = async () => {
    try {
      await Facebook.initializeAsync({
        appId: FACEBOOK_APP_ID,
      });
      const resultadoLogin = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });
      const { type } = resultadoLogin;
      if (type === 'success') {
        let request = {
          method: 'get',
          url: `https://graph.facebook.com/me?access_token=${resultadoLogin.token}&fields=id,name,email,picture.height(500)`,
          headers: {},
        };
        const resultado = await axios(request);
        const datos = JSON.parse(JSON.stringify(resultado.data));
        setFritriUser({
          correoElectronico: datos.email || '',
          idTerceros: datos.id,
          nombreCompleto: datos.name || '',
          tipoLogin: 'Facebook',
          token: resultadoLogin.token,
          urlFoto: datos?.picture?.data?.url,
        });
      }
    } catch (error) {
      // TODO: Mostrar error en pantalla
    }
  };

  const facebookLogout = () => {
    setIsFritriUserFacebookLogged(false);
    setFritriUser(null);
  };

  return {
    facebookLogin,
    facebookLogout,
    fritriUserFromFacebook: fritriUser,
    isFritriUserFacebookLogged,
    fritriUserIdDb,
  };

};
