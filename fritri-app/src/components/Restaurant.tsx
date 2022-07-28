import React, { useEffect, useState } from 'react';

import Text from './Text';
import Block from './Block';
import Image from './Image';
import { useTheme, useTranslation } from '../hooks';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { ILugarGoogle } from '../interfaces/lugar-google';

export interface IProps {
  restaurant: IRestaurantData;
  isUnique: boolean;
  onPress: (event: IRestaurantAction) => void;
}

export interface IRestaurantAction {
  action: 'select' | 'view';
  restaurant: ILugarGoogle;
  select?: boolean;
}

export interface IRestaurantData {
  selected: boolean;
  restaurant: ILugarGoogle;
}

const Restaurant = ({ restaurant, onPress, isUnique }: IProps) => {
  const { restaurant: restaurante, selected } = restaurant;
  const { t } = useTranslation();
  const [isSelected, setIsSelected] = useState(selected);
  const { colors, gradients, icons, sizes } = useTheme();

  const onCheckChange = (value: boolean) => {
    onPress({ action: 'select', restaurant: restaurante, select: value });
  };

  useEffect(() => {
    setIsSelected(selected);
  }, [selected]);

  const onViewPress = () => {
    onPress({ action: 'view', restaurant: restaurante });
  };

  return (
    <Block card padding={sizes.sm} marginBottom={sizes.s}>
      <Block onTouchEnd={() => onViewPress()} >
        <Image height={250} resizeMode="cover" source={{ uri: restaurante.urlFoto }} />
      </Block>

      {/* nombre */}
      <Text h5 bold size={13} marginTop={sizes.s} transform="uppercase" marginLeft={sizes.xs} gradient={gradients.primary}>
        {restaurante.nombre}
      </Text>

      {restaurante.vecindario !== undefined && (
        <Block row align="center" marginTop={sizes.s} marginLeft={sizes.xs}>
          <Image source={icons.star} marginRight={sizes.s} />
          <Text p size={12} semibold>
            {restaurante.calificacion} / 5
          </Text>
          <Text p bold marginHorizontal={sizes.s}>
            •
          </Text>
          <Image source={icons.location} marginRight={sizes.s} />
          <Text size={12} semibold transform="uppercase" paddingRight={'30%'}>
            {restaurante.vecindario.substring(0, 100) || '-'}
          </Text>
        </Block>
      )}


      {/* location*/}
      {restaurante.rangoPrecios && (
        <Block row align="center" marginTop={sizes.s} marginLeft={sizes.xs}>
          {<Text p size={15} semibold primary >
            {t('restaurant.price')}: {'$'.repeat(restaurante.rangoPrecios)}
          </Text>}
        </Block>)}

      <Block row align="center" justify="space-around" paddingTop={sizes.s}>
        <Block row>
          <BouncyCheckbox fillColor={colors.primary.toString()} iconStyle={{ borderColor: colors.primary }}
            unfillColor="#FFFFFF" disableBuiltInState onPress={(isChecked: boolean) => { onCheckChange(isChecked); }} isChecked={isSelected} />
          <Text bold paddingRight={sizes.s}>{t('restaurant.select')}</Text>
        </Block>
        <Text bold primary paddingRight={sizes.s} onPress={() => onViewPress()}>{t('restaurant.view')}</Text>
      </Block>
    </Block>
  );
};

export default Restaurant;
