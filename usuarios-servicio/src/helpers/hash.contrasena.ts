import * as bcrypt from 'bcrypt';
import { generate } from 'generate-password';

export enum LongitudPassword {
  Seis = 6,
  Ocho = 8,
  Diez = 10,
  Doce = 12,
}

export const HashContrasena = async (contrasena) => {
  const saltOrRounds = 11;
  const salt = await bcrypt.genSalt(saltOrRounds);
  const hash = await bcrypt.hash(contrasena, salt);
  return {
    hash,
  };
};

export const CompararContrasena = async (contrasena, hash) => {
  return await bcrypt.compare(contrasena, hash);
};

export const GenerarContrasenaTemporalV2 = async (
  longitud: LongitudPassword,
) => {
  return generate({
    length: longitud,
    uppercase: true,
    numbers: true,
    lowercase: true,
    strict: true,
    excludeSimilarCharacters: true,
  });
};

export const GenerarContrasenaTemporal = async (longitud: LongitudPassword) => {
  const pwdNums = '0123456789';
  const pwdChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  let randPassword = Array(longitud - 3)
    .fill(pwdChars)
    .map(function (x) {
      return x[Math.floor(Math.random() * x.length)];
    })
    .join('');

  randPassword += Array(3)
    .fill(pwdNums)
    .map(function (x) {
      return x[Math.floor(Math.random() * x.length)];
    })
    .join('');

  return randPassword;
};
