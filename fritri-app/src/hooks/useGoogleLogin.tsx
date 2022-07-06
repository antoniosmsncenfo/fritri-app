import { useState, useEffect } from 'react';
import * as Google from 'expo-google-app-auth';
import { IUsuarioDeTerceros } from '../interfaces/usuario-facebook';
import { guardarUsuarioTerceros } from '../api/usuarioDB';
import { GOOGLE_IOS_CLIENT_ID, GOOGLE_ANDROID_CLIENT_ID } from '@env';


export const useGoogleLogin = () => {

    const [googleUser, setGoogleUser] = useState<IUsuarioDeTerceros | null>(null);
    const [isGoogleUserLogged, setIsLogged] = useState(false);
    const [fritriUser, setFritriUser] = useState<IUsuarioDeTerceros | null>(null);
    const [isFritriUserLogged, setIsFritriUserLogged] = useState(false);

    useEffect(() => {
        if (isGoogleUserLogged) {
            guardarUsuarioTerceros(googleUser!)
                .then(result => {
                    if (result !== null) {
                        setFritriUser(result);
                        setIsFritriUserLogged(true);
                    }
                    else {
                        setIsFritriUserLogged(false);
                    }
                });
        }
    }, [googleUser, isGoogleUserLogged]);


    async function signInWithGoogleAsync() {
        try {
            const result = await Google.logInAsync({
                iosClientId: GOOGLE_IOS_CLIENT_ID,
                androidClientId: GOOGLE_ANDROID_CLIENT_ID,
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

    const googleLogout = () => {
        setIsFritriUserLogged(false);
        setFritriUser(null);
    };


    return {
        signInWithGoogleAsync,
        googleLogout,
        fritriUserFromGoogle: fritriUser,
        isFritriUserFromGoogleLogged: isFritriUserLogged,
    };

};


