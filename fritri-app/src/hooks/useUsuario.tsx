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
        nombreCompleto:'',
        genero:'',
        pais:'',
    })

    const registrarUsuario = async (usuarioNuevo:IUsuario) => {

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
              if(resultado.status === 201) {
                // Redireccionar a dashboard
              } else {
                // Mostrar mensaje de error
              }
        } catch(error) {
            console.log(error);
        }
    }

    return {
        registrarUsuario
    }
}
