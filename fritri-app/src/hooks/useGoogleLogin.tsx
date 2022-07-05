import { useState, useEffect } from 'react';
import * as Google from 'expo-google-app-auth';
import { GOOGLE_SECRETS } from '../secrets/googleSecrets';
import { IUsuarioDeTerceros } from '../interfaces/usuario-facebook';
import { guardarUsuarioTerceros } from '../api/usuarioDB';


export const useGoogleLogin = () => {

    const [googleUser, setGoogleUser] = useState<IUsuarioDeTerceros | null>(null);
    const [isGoogleUserLogged, setIsLogged] = useState(false);

    useEffect(() => {
        if (isGoogleUserLogged) { guardarUsuarioTerceros(googleUser!); }
    }, [isGoogleUserLogged]);


    async function signInWithGoogleAsync() {

        try {
            const result = await Google.logInAsync({
                iosClientId: GOOGLE_SECRETS.iosClientId,
                androidClientId: GOOGLE_SECRETS.androidClientId,
                scopes: ['profile', 'email'],
            });

            if (result.type === 'success') {
                setGoogleUser({
                    idTerceros: result.user.id,
                    nombreCompleto: result.user.name,
                    tipoLogin: 'Google',
                    token: result.idToken,
                    urlFoto: result.user.photoUrl,
                    correoElectronico: result.user.email,
                } as IUsuarioDeTerceros);
                setIsLogged(true);
            } else {
                setIsLogged(false);
            }
        } catch (e) {
            console.log(JSON.stringify(e, null, 2));
            setIsLogged(false);
        }
    }

    return {
        signInWithGoogleAsync,
    };

};


