import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useTheme, useTranslation } from '../hooks';
import { Block, Image, Text } from '../components';
import { FotoUsuario } from '../constants/types';

const ShowVoteInfo = (props) => {
  const {assets, sizes, colors} = useTheme();
  const {t} = useTranslation();
  const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 5;
  const [voto, setVoto] = useState({
    nombreCompleto: '',
    urlFoto: '',
    fecha: new Date(),
    idVotante: '',
    resultado: '',
    genero: ''
  });

  const noFoto = voto.genero === 'Man' || voto.genero === 'Masculino' ? FotoUsuario.Hombre : voto.genero === 'Woman' ? FotoUsuario.Mujer : FotoUsuario.Hombre; 

  useEffect(() => {
    setVoto(props.voto)
  }, [])

  return (
    <Block row align="center" marginBottom={sizes.s} marginTop={sizes.s}>
      <Block
        flex={0}
        width={40}
        height={40}
        align="center"
        justify="center"
        marginRight={sizes.s}
        >
          {voto.urlFoto ? 
            <Image
              radius={sizes.s}
              width={40}
              height={40}
              source={{uri: voto.urlFoto}}
              style={{
                height: IMAGE_SIZE,
                width: IMAGE_SIZE,
              }}
            /> :
            <Image
              radius={sizes.s}
              width={40}
              height={40}
              source={{ uri: noFoto }}
              style={{
                height: IMAGE_SIZE,
                width: IMAGE_SIZE,
              }}
            />
          }
      </Block>

      <Block>
        <Block row justify="space-between">
          <Text semibold>{voto.nombreCompleto}</Text>
        </Block>
        <Block row flex={0} align="center" justify="space-between">
          <Text
            p
            color={colors.primary}
            semibold
            size={sizes.linkSize}
            marginRight={sizes.s}>
            { dayjs(voto.fecha).format(t('common.dateFormat'))}
          </Text>
          <Image
              radius={0}
              source={ voto.resultado === 'like' ? assets.likeFill:  assets.disLikeFill}
              style={{tintColor: colors.secondary}}
              width={20}
              height={20}
            />
        </Block>
      </Block>
    </Block>
  )
}

export default ShowVoteInfo;
