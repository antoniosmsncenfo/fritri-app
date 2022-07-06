import axios from "axios";
import { useState } from 'react';
import { IUsuario, ILogin } from '../constants/types/index';
import { USUARIOS_BASE_URL } from '@env';

const usuariosAPI = axios.create({
    baseURL: 'http://192.168.1.2:3000/usuarios'
});


export const useLogin = () => {
    const [usuarioLogin, setUsuarioLogin] = useState<ILogin>({
        correoElectronico: '',
        contrasena: '',
    })

    const loginUsuarioEmail = async (usuarioLogin: ILogin) => {

        console.log(' Logueando...');

        console.log(usuarioLogin);

        try {

            let request = {
                method: 'post',
                url: `${USUARIOS_BASE_URL}/login-email`,
                headers: {},
                data: usuarioLogin
            };

            const resultado = await axios(request);
            if (resultado.status === 201) {
                // Redireccionar a dashboard
            } else {
                // Mostrar mensaje de error
            }
        } catch (error) {
            console.log(error);
        }

    }
    return {
        loginUsuarioEmail
    }

}
export const useUsuario = () => {

    const [usuario, setUsuario] = useState<IUsuario>({
        id: '',
        tipoLogin: '',
        correoElectronico: '',
        contrasena: '',
        nombreCompleto: '',
        genero: '',
        pais: '',
    })

    const registrarUsuario = async (usuarioNuevo: IUsuario) => {

        console.log('Usuario Nuevo');

        console.log(usuarioNuevo);

        try {

            let request = {
                method: 'post',
                url: `http://192.168.3.12:3000/usuarios/crear-usuario`,
                headers: {},
                data: usuarioNuevo
            };

            const resultado = await axios(request);
            if (resultado.status === 201) {
                // Redireccionar a dashboard
            } else {
                // Mostrar mensaje de error
            }
        } catch (error) {
            console.log(error);
        }
    }

    return {
        registrarUsuario
    }

}

