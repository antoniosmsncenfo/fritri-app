import React from 'react';

import Text from './Text';
import Block from './Block';
import Image from './Image';
import { useTheme, useTranslation } from '../hooks';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { ILugarGoogle } from '../interfaces/lugar-google';

export interface IProps {
  lugarGoogleProp: ILugarGoogleData;
  onPress: (event: ILugarGoogleAction) => void;
}
type ActionT = 'select' | 'view';
export interface ILugarGoogleAction {
  action: ActionT;
  lugarGoogle: ILugarGoogle;
  select?: boolean;
}

export interface ILugarGoogleData {
  selected: boolean;
  lugarGoogle: ILugarGoogle;
}

const LugarGoogle = ({ lugarGoogleProp, onPress}: IProps) => {
  const { lugarGoogle } = lugarGoogleProp;
  const { t } = useTranslation();
  const { colors, gradients, icons, sizes } = useTheme();

  const onCheckChange = (value: boolean) => {
    onPress({ action: 'select', lugarGoogle: lugarGoogle , select: value });
  };

  const onViewPress = () => {
    onPress({ action: 'view', lugarGoogle: lugarGoogle });
  };

  return (
    <Block card padding={sizes.sm} marginBottom={sizes.s}>
      <Block onTouchEnd={() => onViewPress()} >
        <Image height={250} resizeMode="cover" source={{ uri: lugarGoogle.urlFotos![0] }} />
      </Block>

      {/* nombre */}
      <Text h5 bold size={13} marginTop={sizes.s} transform="uppercase" marginLeft={sizes.xs} gradient={gradients.primary}>
        {lugarGoogle.nombre}
      </Text>

      {lugarGoogle.vecindario !== undefined && (
        <Block row align="center" marginTop={sizes.s} marginLeft={sizes.xs}>
          <Image source={icons.star} marginRight={sizes.s} />
          <Text p size={12} semibold>
            {lugarGoogle.calificacion} / 5
          </Text>
          <Text p bold marginHorizontal={sizes.s}>
            •
          </Text>
          <Image source={icons.location} marginRight={sizes.s} />
          <Text size={12} semibold transform="uppercase" paddingRight={'30%'}>
            {lugarGoogle.vecindario.substring(0, 100) || '-'}
          </Text>
        </Block>
      )}


      {/* location*/}
      {lugarGoogle.rangoPrecios && (
        <Block row align="center" marginTop={sizes.s} marginLeft={sizes.xs}>
          {<Text p size={15} semibold primary >
            {t('lugarGoogle.price')}: {'$'.repeat(lugarGoogle.rangoPrecios)}
          </Text>}
        </Block>)}

      <Block row align="center" justify="space-around" paddingTop={sizes.s}>
        <Block row>
          <BouncyCheckbox fillColor={colors.primary.toString()} iconStyle={{ borderColor: colors.primary }}
            unfillColor="#FFFFFF"
            onPress={(isChecked: boolean) => { onCheckChange(isChecked); }} />
          <Text bold paddingRight={sizes.s}>{t('lugarGoogle.select')}</Text>
        </Block>
        <Text bold primary paddingRight={sizes.s} onPress={() => onViewPress()}>{t('lugarGoogle.view')}</Text>
      </Block>
    </Block>
  );
};

export default LugarGoogle;
