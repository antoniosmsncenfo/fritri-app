import {useTheme, useTranslation} from '../hooks';
import {Block, Button, Image, Text} from '.';
import {TouchableOpacity} from 'react-native';
import { useState, useEffect } from 'react';

export const PlaceDetail = (props) => {
  const {assets, sizes, colors} = useTheme();
  const {t} = useTranslation();
  const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 5;

  const attraccion = props.place;
  const assetNoImg = props.type === 'rest' ? assets.restaurant : assets.attraction;

  const { like, noLike } = props.usuarioVotado;

  const [likeCheckAsset, setLikeCheckAsset] = useState(like ? assets.likeFill : assets.like);
  const [likeCheck, setLikeCheck] = useState(like);

  const [dislikecheckAsset, setDislikeCheckAsset] = useState(noLike ? assets.disLike : assets.disLikeFill);
  const [dislikeCheck, setDislikeCheck] = useState(noLike);

  const manejarVotoLugar = (tipo: string) => {
    if(tipo === 'like') {
      if(dislikeCheck) {
        setDislikeCheck(false);
      }
      setLikeCheck(!likeCheck);
    }
    if(tipo === 'dislike') {
      if(likeCheck) {
        setLikeCheck(false);
      }
      setDislikeCheck(!dislikeCheck);
    }
    props.manejarVotos(props.posicion, props.tipo, tipo);
  }

  useEffect(() => {
    if(!likeCheck && !dislikeCheck) {
      props.manejarVotos(props.posicion, props.tipo, 'nullVal');
    }
  }, [likeCheck, dislikeCheck])


  useEffect(() => {
    if(likeCheck) {
      setLikeCheckAsset(assets.likeFill)
      setDislikeCheckAsset(assets.disLike)
    } else {
      setLikeCheckAsset(assets.like)
    }
  }, [likeCheck])

  useEffect(() => {
    if(dislikeCheck) {
      setDislikeCheckAsset(assets.disLikeFill)
      setLikeCheckAsset(assets.like)
    } else {
      setDislikeCheckAsset(assets.disLike)
    }
  }, [dislikeCheck])

  return (
    <>
      <Block
        flex={0}
        width={64}
        height={64}
        align="center"
        justify="center"
        marginRight={sizes.s}>
        <TouchableOpacity>
          {attraccion.urlFotos.length > 0 && (
            <Image
              radius={sizes.s}
              width={64}
              height={64}
              source={{uri: attraccion.urlFotos![0]}}
              style={{
                height: IMAGE_SIZE,
                width: IMAGE_SIZE,
              }}
            />
          )}
          {attraccion.urlFotos.length === 0 && (
            <Image
              radius={sizes.s}
              width={64}
              height={64}
              source={assetNoImg}
              style={{
                height: IMAGE_SIZE,
                width: IMAGE_SIZE,
              }}
            />
          )}
        </TouchableOpacity>
      </Block>

      <Block>
        <Block row justify="space-between">
          <Text semibold>{attraccion.nombre}</Text>
          {/* <TouchableOpacity
            onPress={() => { manejarVotoLugar() }}
          >
            <Block row flex={0} align="flex-start">
              <Image
                radius={0}
                source={checkAsset}
                style={{tintColor: colors.secondary}}
                width={sizes.m}
                height={sizes.m}
              />
            </Block>
          </TouchableOpacity> */}
        </Block>
        <TouchableOpacity
        //onPress={() => handleViewDetails(_id!)}
        >
          <Block row flex={0} align="center">
            <Text
              p
              color={colors.primary}
              semibold
              size={sizes.linkSize}
              marginRight={sizes.s}>
              {t('tripDetails.otherVotes')}
            </Text>
            <Image source={assets.arrow} color={colors.primary} />
          </Block>
        </TouchableOpacity>
        <Block row justify="flex-end">
          <Block row flex={0} align="flex-start" style={{ marginRight: 10 }}>
            <TouchableOpacity onPress={() => { manejarVotoLugar('like') }} >
              <Image
                radius={0}
                source={likeCheckAsset}
                style={{tintColor: colors.secondary}}
                width={sizes.m}
                height={sizes.m}
              />
            </TouchableOpacity>
          </Block>
          <Block row flex={0} align="center">
            <TouchableOpacity onPress={() => { manejarVotoLugar('dislike') }} >
              <Image
                radius={0}
                source={dislikecheckAsset}
                style={{tintColor: colors.secondary}}
                width={sizes.m}
                height={sizes.m}
              />
            </TouchableOpacity>
          </Block>
        </Block>
      </Block>
    </>
  );
};
