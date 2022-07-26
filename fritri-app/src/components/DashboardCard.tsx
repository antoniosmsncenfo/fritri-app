import React from 'react';
import {TouchableOpacity} from 'react-native';

import Block from './Block';
import Image from './Image';
import Text from './Text';
import dayjs from 'dayjs';
import {useTheme, useTranslation} from '../hooks/';

import { IPaseo } from '../interfaces/paseo';

const DashboardCard = ({nombre, fechaPaseo, destino}: IPaseo) => {
  const {t} = useTranslation();
  const {assets, colors, sizes} = useTheme();

  //const isHorizontal = type !== 'vertical';
  const isHorizontal = true;
  const CARD_WIDTH = (sizes.width - sizes.padding * 2 - sizes.sm) / 2;

  return (
    <Block
      card
      flex={0}
      row={isHorizontal}
      marginBottom={sizes.sm}
      width={isHorizontal ? CARD_WIDTH * 2 + sizes.sm : CARD_WIDTH}>
      <Image
        resizeMode="cover"
        source={{uri: destino.urlFotosDestino[0]}}
        style={{
          height: isHorizontal ? 114 : 110,
          width: !isHorizontal ? '100%' : sizes.width / 2.435,
        }}
      />
      <Block
        paddingTop={sizes.s}
        justify="space-between"
        paddingLeft={isHorizontal ? sizes.sm : 0}
        paddingBottom={isHorizontal ? sizes.s : 0}>
        <Text p marginBottom={sizes.s}>
          {nombre}
        </Text>
        <Block row align="flex-start" justify="flex-start">
          <Image
              radius={0}
              source={assets.calendar}
              style={{tintColor: colors.black}}
            />        
          <Text p 
            size={sizes.linkSize}
            marginBottom={sizes.s}
            marginLeft={sizes.s}
            >
            { dayjs(fechaPaseo).format(t('common.dateFormat'))}
          </Text>
        </Block>      
        <TouchableOpacity>
          <Block row flex={0} align="center">
            <Text
              p
              color={colors.primary}
              semibold
              size={sizes.linkSize}
              marginRight={sizes.s}>
              {t('common.details')}
            </Text>
            <Image source={assets.arrow} color={colors.primary} />
          </Block>
        </TouchableOpacity>
      </Block>
    </Block>
  );
};

export default DashboardCard;
