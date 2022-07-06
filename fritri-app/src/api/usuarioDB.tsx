import axios from 'axios';
import { IUsuarioDeTerceros } from '../interfaces/usuario-facebook';

const BASE_URL = 'http://192.168.2.28:3000/usuarios';


export const guardarUsuarioTerceros = async (usuarioTercero: IUsuarioDeTerceros) => {

    let request = {
        method: 'post',
        url: `${BASE_URL}/login-terceros`,
        headers: {},
        data: usuarioTercero,
    };
    const resultado = await axios(request);
    try {

        if (resultado.status === 201) {
            console.log(resultado.data, '201');
            return usuarioTercero;
        } else {
            //console.log(JSON.stringify(result.data, null, 2), 'nada');
            return usuarioTercero;
        }
    }
    catch (e) {
        console.log(JSON.stringify(e, null, 2), 'error');
        return null;
    }
};
