import React, { useEffect, useState } from 'react';

import Text from './Text';
import Block from './Block';
import Image from './Image';
import { useTheme, useTranslation } from '../hooks';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useWindowDimensions } from 'react-native';
import { IDestino } from '../interfaces/paseo';

export interface IProps {
  destination: IDestinationData;
  isUnique: boolean;
  onPress: (event: IDestinationAction) => void;
}

export interface IDestinationAction {
  action: 'select' | 'view';
  destination: IDestino;
  select?: boolean;
}

export interface IDestinationData {
  selected: boolean;
  destination: IDestino;
}

const Destination = ({ destination, onPress, isUnique }: IProps) => {
  const { destination: destino, selected } = destination;
  const { t } = useTranslation();
  const [isSelected, setIsSelected] = useState(selected);
  const { colors, gradients, icons, sizes } = useTheme();
  const { width } = useWindowDimensions();
  const widthImage = isUnique ? width * 0.82 : width * 0.75; // establece el ancho de la imagen al 82% del ancho cuando es un solo destino, si son más usa 75%
  const heightImage = Math.floor(widthImage / (4 / 2)); // establece el alto de la imagen a una relación de 4/2 (w/h)

  const onCheckChange = (value: boolean) => {
    onPress({ action: 'select', destination: destino, select: value });
  };

  useEffect(() => {
    setIsSelected(selected);
  }, [selected]);


  const onViewPress = () => {
    onPress({ action: 'view', destination: destino });
  };

  return (
    <Block>
      <Block card padding={sizes.sm} marginRight={sizes.s} marginVertical={sizes.s}>
        <Block onTouchEnd={() => onViewPress()} >
          <Image height={heightImage} width={widthImage} resizeMode="cover" source={{ uri: destino.urlFotos![0] }} />
        </Block>

        {/* nombre */}
        <Text h5 bold size={13} marginTop={sizes.s} transform="uppercase" marginLeft={sizes.xs} gradient={gradients.primary}>
          {destino.nombre}
        </Text>

        {/* location*/}
        <Block row align="center">
          <Image source={icons.location} marginRight={sizes.s} />
          <Text p size={12} semibold>
            {destino.estado}, {destino.pais}
          </Text>
        </Block>

        <Block row align="center" justify="space-around" paddingTop={sizes.s}>
          <Block row>
            <BouncyCheckbox fillColor={colors.primary.toString()} iconStyle={{ borderColor: colors.primary }}
              unfillColor="#FFFFFF" disableBuiltInState onPress={(isChecked: boolean) => { onCheckChange(isChecked); }} isChecked={isSelected} />
            <Text bold paddingRight={sizes.s}>{t('destination.select')}</Text>
          </Block>
          <Text bold primary paddingRight={sizes.s} onPress={() => onViewPress()}>{t('destination.view')}</Text>
        </Block>
      </Block>
    </Block>
  );
};

export default Destination;
