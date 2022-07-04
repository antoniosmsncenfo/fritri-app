import * as bcrypt from 'bcrypt';

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