import React, {useState} from 'react';
import { TouchableWithoutFeedback } from 'react-native';

import Text from './Text';
import Block from './Block';
import Image from './Image';
import { useTheme, useTranslation } from '../hooks';
import { IDestino } from '../interfaces/destino';
import Checkbox from './Checkbox';

export interface IProps {
destino: IDestino;
onPress?: (event?: any) => void;
}

const Destination = ({destino}:IProps) => {
  const { t } = useTranslation();
  const {selected, setSelected} = useState(true);
  const { colors, gradients, icons, sizes } = useTheme();
  return (
    <TouchableWithoutFeedback>
      <Block card padding={sizes.sm} marginRight={sizes.s}>
        <Image height={195} width={260} resizeMode="cover" source={{ uri: destino.urlFoto }} />

        {/* nombre */}
        <Text
          h5
          bold
          size={13}
          marginTop={sizes.s}
          transform="uppercase"
          marginLeft={sizes.xs}
          gradient={gradients.primary}>
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
          <Checkbox checked={true} marginRight={sizes.sm} />
          <Text bold paddingRight={sizes.s}>{t('destination.select')}</Text>
          <Text left={130} bold primary paddingRight={sizes.s}>{t('destination.view')}</Text>
        </Block>
      </Block>
    </TouchableWithoutFeedback>
  );
};

export default Destination;
