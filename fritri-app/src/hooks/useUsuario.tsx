import axios from "axios";
import { useState } from 'react';
import { IUsuario, ILogin } from '../constants/types/index';
import { USUARIOS_BASE_URL } from '@env';
import { IUsuarioFritri } from "../interfaces/usuario-fritri";
import { guardarUsuarioFriTri } from "../api/usuarioDB";
import { RegistrationStatus } from '../interfaces/registro-usuario';

export const useLogin = () => {
    const [usuarioLogin, setUsuarioLogin] = useState<ILogin>({
        correoElectronico: '',
        contrasena: '',
    })

    const [fritriUser, setFritriUser] = useState<IUsuarioFritri | null>(null);

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
            if (resultado.status === 200) {
                if ('message' in resultado.data && resultado.data.message === "No existe usuario") {
                    setFritriUser(null)
                }
                else {
                    setFritriUser(resultado.data)
                }
            }
            else {
                setFritriUser(null)
            }
        } catch (error) {
            console.log(error);
        }

    }
    const emailLogout = () => {
        setFritriUser(null);
    };
    return {
        loginUsuarioEmail,
        emailLogout,
        fritriUserEmail: fritriUser
    }

}

export const useUsuario = () => {

    const [usuarioFriTri, setUsuarioFriTri] = useState<IUsuario>({
        id: '',
        tipoLogin:'',
        correoElectronico:'',
        contrasena:'',
        nombreCompleto:'',
        genero:'',
        pais:'',
    })

    const [registrarStatus, setRegistrarStatus] = useState<RegistrationStatus>(
        RegistrationStatus.New
    )

    const resetRegistrarEstatus = () => {
        setRegistrarStatus(RegistrationStatus.New);
    }

    const registrarUsuario = (usuarioNuevo:IUsuario) => {

            guardarUsuarioFriTri(usuarioNuevo)
            .then((result: IUsuario) => {
                if (result !== null) {
                    setUsuarioFriTri(result);
                    setRegistrarStatus(RegistrationStatus.Success);
                    console.log("Usuario registrado:");
                    console.log(usuarioFriTri);
                }
            })
            .catch((e) => {
                console.log("Error capturado: " + e.response.data.message)
                if (e.response.data.message==="Error al tratar de crear el usuario-email::Email duplicado")
                {
                    setRegistrarStatus(RegistrationStatus.Duplicated);
                }   
            }
            );
    }

    return {
        resetRegistrarEstatus,
        registrarUsuario,
        usuarioFriTri,
        registrarStatus
    }

}

}
