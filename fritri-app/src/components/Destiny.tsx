import React from 'react';
import dayjs from 'dayjs';
import { TouchableWithoutFeedback } from 'react-native';

import Text from './Text';
import Block from './Block';
import Image from './Image';
import { useTheme, useTranslation } from '../hooks';
import { IDestino } from '../interfaces/destino';

const Destiny = ({ nombre, descripcion, estado, pais, urlFoto }: IDestino, onPress?: (event?: any) => IDestino) => {
  const { t } = useTranslation();
  const { colors, gradients, icons, sizes } = useTheme();
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Block card padding={sizes.sm} marginTop={sizes.sm}>
        <Image height={170} resizeMode="cover" source={{ uri: urlFoto }} />
        {/* article category */}
        {nombre && (
          <Text
            h5
            bold
            size={13}
            marginTop={sizes.s}
            transform="uppercase"
            marginLeft={sizes.xs}
            gradient={gradients.primary}>
            {nombre}
          </Text>
        )}

        {/* article description */}
        {descripcion && (
          <Text
            p
            marginTop={sizes.s}
            marginLeft={sizes.xs}
            marginBottom={sizes.sm}>
            {descripcion}
          </Text>
        )}
        {/* location & rating */}

        <Block row align="center">
          <Image source={icons.location} marginRight={sizes.s} />
          <Text p size={12} semibold>
            {pais}, {estado}
          </Text>
          <Text p bold marginHorizontal={sizes.s}>
            •
          </Text>
          <Image source={icons.star} marginRight={sizes.s} />
          <Text p size={12} semibold>
            {1}/5
          </Text>
        </Block>
      </Block>
    </TouchableWithoutFeedback>
  );
};

export default Destiny;
