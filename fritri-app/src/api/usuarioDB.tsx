import axios from 'axios';
import { IUsuarioDeTerceros } from '../interfaces/usuario-facebook';

const usuarioDB = axios.create({
    baseURL: 'http://192.168.1.239:3000/usuarios',
});

export const guardarUsuarioTerceros = async (googleUser: IUsuarioDeTerceros) => {
    usuarioDB.post<IUsuarioDeTerceros>('/login-terceros', googleUser)
        .then(result => {
            console.log(result);
            if (result.status === 201) {
                console.log('usuario creado');
            } else {
                console.log('usuario no existe');
            }
        })
        .catch((error) => console.log(error));
};
