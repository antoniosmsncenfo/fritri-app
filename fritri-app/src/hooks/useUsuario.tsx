import axios from "axios";
import {useState} from 'react';
import { IUsuario } from '../constants/types/index';

const usuariosAPI = axios.create({
    baseURL: 'http://192.168.3.12:3000/usuarios'
});

export const useUsuario = () => {
  
    const [usuario, setUsuario] = useState<IUsuario>({
        id: '',
        tipoLogin:'',
        correoElectronico:'',
        contrasena:'',
        nombre:'',
        foto:'',
        genero:'',
        pais:'',
    })

    const registrarUsuario = async () => {

        const resp = await usuariosAPI.post<IUsuario>('/create', {
            params: {
                
            }
        })

        if(resp.data){
            setUsuario(resp.data);
        }

    }

    return (
        usuario
    )
}
