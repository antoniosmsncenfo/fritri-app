import {useState} from 'react';
import { IUsuario } from '../constants/types/index';
import { guardarUsuarioFriTri } from "../api/usuarioDB";
import { RegistrationStatus } from '../interfaces/registro-usuario';

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
