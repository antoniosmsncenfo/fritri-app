import { useState } from 'react';
import * as Google from 'expo-google-app-auth';
import { GOOGLE_SECRETS } from '../secrets/googleSecrets';


export const useGoogleLogin = () => {

    const [googleUser, setGoogleUser] = useState<Google.LogInResult>();
    const [isGoogleUserLogged, setIsLogged] = useState(false);

    async function signInWithGoogleAsync() {

        try {
            const result = await Google.logInAsync({
                iosClientId: GOOGLE_SECRETS.iosClientId,
                androidClientId: GOOGLE_SECRETS.androidClientId,
                scopes: ['profile', 'email'],
            });

            if (result.type === 'success') {
                console.log(JSON.stringify(result, null, 2));
                setGoogleUser(result);
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
        googleUser,
        isGoogleUserLogged,
    };

};


