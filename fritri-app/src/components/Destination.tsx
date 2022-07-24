import React from 'react';

import Text from './Text';
import Block from './Block';
import Image from './Image';
import { useTheme, useTranslation } from '../hooks';
import { IDestino } from '../interfaces/destino';
import Checkbox from './Checkbox';

export interface IProps {
  destino: IDestino;
  onPress: (event: IDestinationAction) => void;
}

export interface IDestinationAction {
  action: 'select' | 'view';
  destination: IDestino;
}

const Destination = ({ destino, onPress }: IProps) => {
  const { t } = useTranslation();
  const { gradients, icons, sizes } = useTheme();

  const onCheckChange = (value: boolean) => {
    if (value) {
      onPress({ action: 'select', destination: destino });
    }
  };

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
          <Checkbox checked={true} marginRight={sizes.sm} onPress={(value) => { onCheckChange(value); }} />
          <Text bold paddingRight={sizes.s}>{t('destination.select')}</Text>
          <Text left={130} bold primary paddingRight={sizes.s} onPress={() => onViewPress()}>{t('destination.view')}</Text>
        </Block>
      </Block>
    </Block>
  );
};

export default Destination;
