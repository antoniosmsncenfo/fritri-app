import React, { useState, useEffect } from 'react';
import { useTheme, useTranslation } from '../hooks';
import { Block, Image, Text } from '../components';
import { IDestino } from '../interfaces/paseo';
import { IVotoLugar } from '../interfaces/votos';
import ShowVoteInfo from '../components/ShowVoteInfo';

const TripVotes = (props) => {
  const { t } = useTranslation();
  const { assets, sizes, colors } = useTheme();
  const [destino, setDestino] = useState<IDestino | null>(null);
  const [votos, setVotos] = useState<IVotoLugar[]>([]);
  const [likes, setLikes] = useState<String[]>([]);
  const [dislikes, setDislikes] = useState<String[]>([]);
  
  useEffect(() => {
    setDestino(props.route.params.destino);
    setVotos(props.route.params.destino.votaciones)
  }, [])

  useEffect(() => {
    const tempLikes = [];
    const tempDislikes = [];
    for (const voto of votos) {
      if(voto.resultado === 'dislike') {
        tempDislikes.push(voto.resultado);
      } else if(voto.resultado === 'like') {
        tempLikes.push(voto.resultado);
      }
    }
    setLikes([...tempLikes]);
    setDislikes([...tempDislikes]);
  }, [votos])

  return (
    <Block safe>
      <Block
        scroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: sizes.s }} >

      <Block marginTop={sizes.m} paddingHorizontal={sizes.padding} marginBottom={sizes.l}>
        <Block align="flex-start">
          <Text h5 marginVertical={sizes.s}>
            {destino?.nombre}
          </Text>
        </Block>
        <Image
          resizeMode="cover"
          source={{ uri: destino?.urlFotos![0] }}
          style={{ height: 250 }}
        />
        <Block row
          align="stretch"
          justify="flex-start"
          marginTop={sizes.sm}
          >
          <Image
            radius={0}
            width={20}
            height={20}
            source={assets.articles}
            style={{ tintColor: colors.secondary }}
          />
          <Text p secondary
            marginBottom={sizes.s}
            marginLeft={sizes.s}
            marginRight={sizes.s}>
            {t('seeVotes.statistics')}
          </Text>

          <Block 
            row
            justify="flex-end"
            >
            <Block row flex={0} align="flex-start" marginRight={10}>
              <Image
                radius={0}
                source={assets.likeFill}
                width={20}
                height={20}
                style={{ tintColor: colors.secondary }}
              />
              <Text p secondary
                marginLeft={sizes.s}>
                { likes.length }
              </Text>
            </Block>
            <Block row flex={0} align="flex-start">
              <Image
                radius={0}
                source={assets.disLikeFill}
                width={20}
                height={20}
                style={{ tintColor: colors.secondary }}
              />
              <Text p secondary
                marginLeft={sizes.s}>
                { dislikes.length }
              </Text>
            </Block>
          </Block>

        </Block>
        
        <Block align="center"
          card color={colors.card}
          marginBottom={sizes.l}
          marginTop={sizes.s}
        >
          {
            (votos.length > 0 && (likes.length > 0 || dislikes.length > 0)) ?
            votos.map((voto, index) => {
              return <ShowVoteInfo voto={voto} key={index}/>
            })
            :
            <Block padding={sizes.s} align='center'>
              <Text p semibold color={colors.primary}>
                {
                  `${t('seeVotes.noVotesFor')} ${destino?.nombre}`
                }
              </Text>
            </Block>
          }
        </Block>
      </Block>
    </Block>
  </Block>
  );
};

export default TripVotes;
