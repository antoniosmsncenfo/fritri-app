import axios from 'axios';
import { IUsuarioDeTerceros } from '../interfaces/usuario-facebook';
import { USUARIOS_BASE_URL } from '@env';



export const guardarUsuarioTerceros = async (usuarioTercero: IUsuarioDeTerceros) => {
    let request = {
        method: 'post',
        url: `${USUARIOS_BASE_URL}/login-terceros`,
        headers: {},
        data: usuarioTercero,
    };
    const resultado = await axios(request);
    try {

        if (resultado.status === 200) { return usuarioTercero; }
        else { return null; }
    }
    catch (e) {
        console.log(JSON.stringify(e, null, 2), 'error');
        return null;
    }
};
