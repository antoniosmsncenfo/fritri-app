import axios from "axios";
import { useState } from 'react';
import { IUsuario, ILogin } from '../constants/types/index';
import { USUARIOS_BASE_URL } from '@env';
import { IUsuarioContrasena, IUsuarioFritri } from "../interfaces/usuario-fritri";
import { guardarUsuarioFriTri, resetearPassword, cambiarPassword } from "../api/usuarioDB";
import { RegistrationStatus, ResetPasswordStatus } from '../interfaces/registro-usuario';

export const useLogin = () => {
    const [usuarioLogin, setUsuarioLogin] = useState<ILogin>({
        correoElectronico: '',
        contrasena: '',
    })

    const [fritriUser, setFritriUser] = useState<IUsuarioFritri | null>(null);

    const loginUsuarioEmail = async (usuarioLogin: ILogin) => {

        try {

            let request = {
                method: 'post',
                url: `${USUARIOS_BASE_URL}/login-email`,
                headers: {},
                data: usuarioLogin
            };

            const resultado = await axios(request);
            console.log(resultado.status);
            if (resultado.status === 200) {
                console.log(resultado.data.statusCode);
                if (resultado.data.statusCode === 404) {
                    setFritriUser(null);
                } 
                else if('tipoLogin' in resultado.data) {
                    console.log(resultado.data);
                    setFritriUser(resultado.data);
                }
                else {
                    setFritriUser(null);
                }
            }
            else {
                setFritriUser(null);
            }
        } catch (error) {
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
            }
        })
        .catch((e) => {
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

export const usePassword = () => {

    const [usuarioFriTri, setUsuarioFriTri] = useState<IUsuario>({
        id: '',
        tipoLogin:'',
        correoElectronico:'',
        contrasena:'',
        nombreCompleto:'',
        genero:'',
        pais:'',
    })

    const [resetPasswordResult, setResetPasswordResult] = useState<ResetPasswordStatus>(
        ResetPasswordStatus.Pending
    )

    const restartResetPasswordStatus = () => {
        setResetPasswordResult(ResetPasswordStatus.Pending);
    }

    const resetPassword = (emailUsuario:string) => {

        resetearPassword(emailUsuario)
        .then((resultado) => {
            console.log(resultado);
            if (resultado !== null) {
                setResetPasswordResult(ResetPasswordStatus.Success);
            }
        })
        .catch((e) => {
            setResetPasswordResult(ResetPasswordStatus.Error);
        }
        );

    }

    return {
        restartResetPasswordStatus,
        resetPassword,
        usuarioFriTri,
        resetPasswordResult
    }

}

export const useChangePassword = () => {

    const [changePasswordResult, setChangePasswordResult] = useState<ResetPasswordStatus>(
        ResetPasswordStatus.Pending
    )

    const restartChangePasswordStatus = () => {
        setChangePasswordResult(ResetPasswordStatus.Pending);
    }

    const changePassword = (usuarioContrasena:IUsuarioContrasena) => {

        cambiarPassword(usuarioContrasena)
        .then((resultado) => {
            console.log(resultado);
            if (resultado !== null) {
                setChangePasswordResult(ResetPasswordStatus.Success);
            }
        })
        .catch((e) => {
            setChangePasswordResult(ResetPasswordStatus.Error);
        }
        );

    }

    return {
        restartChangePasswordStatus,
        changePassword,
        changePasswordResult
    }

}