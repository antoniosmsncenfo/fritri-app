import axios from "axios";
import { useState } from 'react';
import { IUsuario, ILogin } from '../constants/types/index';
import { USUARIOS_BASE_URL } from '@env';
import { IUsuarioContrasena, IUsuarioFritri, LoginStatus } from '../interfaces/usuario-fritri';
import { guardarUsuarioFriTri, resetearPassword, cambiarPassword, updateUsuarioFriTri } from "../api/usuarioDB";
import { RegistrationStatus, ResetPasswordStatus } from '../interfaces/registro-usuario';

export const useLogin = () => {
    const [usuarioLogin, setUsuarioLogin] = useState<ILogin>({
        correoElectronico: '',
        contrasena: '',
    })

    const [fritriUser, setFritriUser] = useState<IUsuarioFritri | null>(null);
    const [LoginMailStatus, setLoginStatus] = useState<LoginStatus>(
        LoginStatus.New
    )

    const resetLoginEstatus = () => {
        setLoginStatus(LoginStatus.New);
    }

    const loginUsuarioEmail = async (usuarioLogin: ILogin) => {

        try {

            let request = {
                method: 'post',
                url: `${USUARIOS_BASE_URL}/login-email`,
                headers: {},
                data: usuarioLogin
            };
            const resultado = await axios(request);
            if (resultado.status === 200) {
                if (resultado.data.statusCode === 404) {
                    setLoginStatus(LoginStatus.InvalidMail);
                    setFritriUser(null);
                }
                else if ('tipoLogin' in resultado.data) {
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
        LoginMailStatus,
        resetLoginEstatus,
        fritriUserEmail: fritriUser
    }

}

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
    )

    const resetRegistrarEstatus = () => {
        setRegistrarStatus(RegistrationStatus.New);
    }

    const registrarUsuario = (usuarioNuevo: IUsuario) => {

        guardarUsuarioFriTri(usuarioNuevo)
            .then((result: IUsuario) => {
                if (result !== null) {
                    setUsuarioFriTri(result);
                    setRegistrarStatus(RegistrationStatus.Success);
                }
            })
            .catch((e) => {
                if (e.response.data.message === "Error al tratar de crear el usuario-email::Email duplicado") {
                    setRegistrarStatus(RegistrationStatus.Duplicated);
                }
            }
            );
    }
    const updateUsuario = async (usuarioActualizado: IUsuario) => {
			try {
				let result = await updateUsuarioFriTri(usuarioActualizado);
				if(result) {
					setUsuarioFriTri(result);
					setFritriUser(result);
					setRegistrarStatus(RegistrationStatus.Success);
				}
			} catch(error) {
			}
    }

    return {
        resetRegistrarEstatus,
        registrarUsuario,
        updateUsuario,
        usuarioFriTri,
				fritriUser,
        registrarStatus,
    }


}

export const usePassword = () => {

    const [usuarioFriTri, setUsuarioFriTri] = useState<IUsuario>({
        id: '',
        tipoLogin: '',
        correoElectronico: '',
        contrasena: '',
        nombreCompleto: '',
        genero: '',
        pais: '',
    })

    const [resetPasswordResult, setResetPasswordResult] = useState<ResetPasswordStatus>(
        ResetPasswordStatus.Pending
    )

    const restartResetPasswordStatus = () => {
        setResetPasswordResult(ResetPasswordStatus.Pending);
    }

    const resetPassword = (emailUsuario: string) => {

        resetearPassword(emailUsuario)
            .then((resultado) => {
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

    }

    return {
        restartChangePasswordStatus,
        changePassword,
        changePasswordResult
    }

}