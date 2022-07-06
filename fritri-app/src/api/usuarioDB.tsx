import axios from 'axios';
import { IUsuarioDeTerceros } from '../interfaces/usuario-facebook';
import { USUARIOS_BASE_URL} from '@env';



export const guardarUsuarioTerceros = async (usuarioTercero: IUsuarioDeTerceros) => {
    console.log(USUARIOS_BASE_URL, '201');
    let request = {
        method: 'post',
        url: `${USUARIOS_BASE_URL}/login-terceros`,
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
