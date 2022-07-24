import React, { useEffect, useState } from 'react';

import Text from './Text';
import Block from './Block';
import Image from './Image';
import { useTheme, useTranslation } from '../hooks';
import { IDestino } from '../interfaces/destino';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

export interface IProps {
  destination: IDestinationData;
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

const Destination = ({ destination, onPress }: IProps) => {
  const { destination: destino, selected } = destination;
  const { t } = useTranslation();
  const [isSelected, setIsSelected] = useState(selected);
  const { colors, gradients, icons, sizes } = useTheme();

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
      <Block card padding={sizes.sm} marginRight={sizes.s}>
        <Block onTouchEnd={() => onViewPress()} >
          <Image height={195} width={260} resizeMode="cover" source={{ uri: destino.urlFoto }} />
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

        <Block row align="center" paddingTop={sizes.s}>
          <BouncyCheckbox fillColor={colors.primary.toString()} iconStyle={{ borderColor: colors.primary }}
            unfillColor="#FFFFFF" disableBuiltInState onPress={(isChecked: boolean) => { onCheckChange(isChecked); }} isChecked={isSelected} />
          <Text bold paddingRight={sizes.s}>{t('destination.select')}</Text>
          <Text left={130} bold primary paddingRight={sizes.s} onPress={() => onViewPress()}>{t('destination.view')}</Text>
        </Block>
      </Block>
    </Block>
  );
};

export default Destination;
