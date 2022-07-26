import axios from 'axios';
import { useState } from 'react';
import { IUsuario, ILogin } from '../constants/types/index';
import { USUARIOS_BASE_URL } from '@env';
import { IUsuarioContrasena, IUsuarioFritri, LoginStatus } from '../interfaces/usuario-fritri';
import { guardarUsuarioFriTri, resetearPassword, cambiarPassword, updateUsuarioFriTri, updateFoto } from '../api/usuarioDB';
import { RegistrationStatus, ResetPasswordStatus } from '../interfaces/registro-usuario';
import Storage from '@react-native-async-storage/async-storage';

export const useLogin = () => {
    const ACCESS_TOKEN_KEY = 'access_token';
    const [fritriUser, setFritriUser] = useState<IUsuarioFritri | null>(null);
    const [LoginMailStatus, setLoginStatus] = useState<LoginStatus>(
        LoginStatus.New
    );

    const resetLoginEstatus = () => {
        setLoginStatus(LoginStatus.New);
    };

    const loginUsuarioEmail = async (usuarioLogin: ILogin) => {
        try {
            let request = {
                method: 'post',
                url: `${USUARIOS_BASE_URL}/login-email`,
                headers: {},
                data: usuarioLogin,
            };
            const resultado = await axios(request);
            //Inicio de sesión activo 
            const KEY_JWT = resultado.data.access_token;
            await Storage.setItem(ACCESS_TOKEN_KEY,KEY_JWT);
            console.log(resultado.data.access_token);

            if (resultado.status === 200) {
                if (resultado.data.statusCode === 404) {
                    setLoginStatus(LoginStatus.InvalidMail);
                    setFritriUser(null);
                }
                else if ('tipoLogin' in resultado.data) {
                    setLoginStatus(LoginStatus.Valid);
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
            setFritriUser(null);
        }
    };

    const emailLogoutSess = async() => {
        await Storage.removeItem(ACCESS_TOKEN_KEY);
        setFritriUser(null);
    };

    return {
        loginUsuarioEmail,
        emailLogoutSess,
        LoginMailStatus,
        resetLoginEstatus,
        fritriUserEmail: fritriUser,
        ACCESS_TOKEN_KEY,
    };

};

export const useUsuario = () => {

    const [usuarioFriTri, setUsuarioFriTri] = useState<IUsuario>({
        id: '',
        tipoLogin: '',
        correoElectronico: '',
        contrasena: '',
        nombreCompleto: '',
        genero: '',
        pais: '',
    });

    const [fritriUser, setFritriUser] = useState<IUsuarioFritri | null>(null);

    const [registrarStatus, setRegistrarStatus] = useState<RegistrationStatus>(
        RegistrationStatus.New
    );

    const resetRegistrarEstatus = () => {
        setRegistrarStatus(RegistrationStatus.New);
    };

    const registrarUsuario = (usuarioNuevo: IUsuario) => {

        guardarUsuarioFriTri(usuarioNuevo)
            .then((result) => {
                if (result !== null) {
                    setUsuarioFriTri(result);
                    setFritriUser(result);
                    setRegistrarStatus(RegistrationStatus.Success);
                }
            })
            .catch((e) => {
                if (e.response.data.message === 'Error al tratar de crear el usuario-email::Email duplicado') {
                    setRegistrarStatus(RegistrationStatus.Duplicated);
                }
            }
            );
    };
    const updateUsuario = async (usuarioActualizado: IUsuario) => {
        try {
            let result = await updateUsuarioFriTri(usuarioActualizado);
            if (result) {
                setUsuarioFriTri(result);
                setFritriUser(result);
                setRegistrarStatus(RegistrationStatus.Success);
            }
        } catch (error) {
        }
    };

    const updateUsuarioFoto = async (uri: any, idUsuario: string) => {
        let uriParts = uri.split('.');
        let fileType = uriParts[uriParts.length - 1];
        let formData = new FormData();
        formData.append('imagen', {
            uri,
            name: `imagen.${fileType}`,
            type: `imagen/${fileType}`,
        });
        formData.append('idUsuario', idUsuario);
        const resulFoto = await updateFoto(formData);
        setFritriUser(resulFoto);

    }


    return {
        resetRegistrarEstatus,
        registrarUsuario,
        updateUsuario,
        usuarioFriTri,
        fritriUser,
        updateUsuarioFoto,
        registrarStatus,
    };


};

export const usePassword = () => {

    const [usuarioFriTri, setUsuarioFriTri] = useState<IUsuario>({
        id: '',
        tipoLogin: '',
        correoElectronico: '',
        contrasena: '',
        nombreCompleto: '',
        genero: '',
        pais: '',
    });

    const [resetPasswordResult, setResetPasswordResult] = useState<ResetPasswordStatus>(
        ResetPasswordStatus.Pending
    );

    const restartResetPasswordStatus = () => {
        setResetPasswordResult(ResetPasswordStatus.Pending);
    };

    const [resetPasswordWaitTime, setResetPasswordWaitTime] = useState<number>(0);

    const resetPassword = (emailUsuario: string) => {

        resetearPassword(emailUsuario)
            .then((resultado) => {
                if (resultado !== null) {
                    if ('statusCode' in resultado) {
                        if (resultado.statusCode === 405) {
                            setResetPasswordWaitTime(parseInt(resultado.wait));
                            setResetPasswordResult(ResetPasswordStatus.TimeLimit);
                        }
                        else {
                            throw Error("Unknown error");
                        }
                    }
                    else {
                        setResetPasswordWaitTime(0);
                        setResetPasswordResult(ResetPasswordStatus.Success);
                    }
                }
            })
            .catch((e) => {
                setResetPasswordResult(ResetPasswordStatus.Error);
            }
            );

    };

    return {
        restartResetPasswordStatus,
        resetPassword,
        usuarioFriTri,
        resetPasswordResult,
        resetPasswordWaitTime
    };

};

export const useChangePassword = () => {

    const [changePasswordResult, setChangePasswordResult] = useState<ResetPasswordStatus>(
        ResetPasswordStatus.Pending
    );

    const restartChangePasswordStatus = () => {
        setChangePasswordResult(ResetPasswordStatus.Pending);
    };

    const changePassword = (usuarioContrasena: IUsuarioContrasena) => {

        cambiarPassword(usuarioContrasena)
            .then((resultado) => {
                if (resultado !== null) {
                    setChangePasswordResult(ResetPasswordStatus.Success);
                }
            })
            .catch((e) => {
                setChangePasswordResult(ResetPasswordStatus.Error);
            }
            );

    };

    return {
        restartChangePasswordStatus,
        changePassword,
        changePasswordResult,
    };
};
