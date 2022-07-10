import * as bcrypt from 'bcrypt';

export enum LongitudPassword {
  Seis = 6,  
  Ocho = 8,
  Diez = 10,
  Doce = 12
}

export const HashContrasena = async (contrasena) => {
  const saltOrRounds = 11;
  const salt = await bcrypt.genSalt(saltOrRounds);
  const hash = await bcrypt.hash(contrasena, salt);
  return {
    hash,
  }
}


export const CompararContrasena = async(contrasena, hash) => {
  return await bcrypt.compare(contrasena, hash);
}

export const GenerarContrasenaTemporal = async(longitud:LongitudPassword) => {
  const pwdChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  let randPassword = Array(longitud).fill(pwdChars).map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');

  return randPassword;
}