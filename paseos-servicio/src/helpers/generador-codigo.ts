import { generate } from 'generate-password';

export const GenerarCodigoCompartir = async (longitud: number) => {
    return generate({
      length: longitud,
      uppercase: true,
      numbers: true,
      lowercase: false,
      strict: true,
      excludeSimilarCharacters: true,
    });
  };

  export const GenerarPinProteger = async () => {
	let min = 1000;
        min = Math.ceil(min);

	let max = 9999;
        max = Math.floor(max);

	return Math.floor(Math.random() * (max - min + 1)) + min; 
  };