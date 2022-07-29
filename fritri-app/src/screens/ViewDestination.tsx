import React, { useState, useEffect } from 'react';
import { Linking, View } from 'react-native';

import { useTheme, useTranslation } from '../hooks';
import { Block, Image, Text } from '../components';
import { useGooglePlace } from '../hooks/useGooglePlace';
import { IBuscarLugarGoogle } from '../interfaces/buscar-lugar-google';
import { IDestino } from '../interfaces/paseo';

const ViewDestination = (props) => {
  const { t } = useTranslation();
  const { assets, sizes } = useTheme();
  const [destino, setDestino] = useState<IDestino | null>(null);
  const { getGooglePlace, googlePlace } = useGooglePlace();
  const [searchMoreInfo, setSearchMoreInfo] = useState(false);

  useEffect(() => {
    setDestino(props.route.params);
    const { tipoLugar, idGoogle } = props.route.params;
    const buscarLugar: IBuscarLugarGoogle = {
      tipoLugar: tipoLugar || null,
      idGoogle: idGoogle || null,
    };
    if (!Object.values(buscarLugar).includes(null)) {
      getGooglePlace(buscarLugar);
      setSearchMoreInfo(true);
    }
  }, []);

  const callPlace = (telefono) => {
    return Linking.openURL(`tel:${telefono}`);
  };

  return (
    <>
      <Block marginTop={sizes.m} paddingHorizontal={sizes.padding} marginBottom={sizes.l}>
        <Block>
          <Image
            resizeMode="cover"
            source={{ uri: destino?.urlFotos![0] }}
            style={{ width: '100%', height: '60%' }}
          />
          <Text p secondary marginTop={sizes.sm}>
            {destino?.estado} / {destino?.pais}
          </Text>
          <Text h4 marginVertical={sizes.s}>
            {destino?.nombre}
          </Text>
        </Block>
      </Block>

      {/* Parte del restaurante o actividad turística */}
      {searchMoreInfo &&
        <View style={{
          flexDirection: 'column',
          height: 150,
          padding: 15,
          marginTop: -200,
        }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'stretch', borderWidth: 0, height: 20, borderColor: 'green', width: '88%', marginTop: -15 }} >
            <Image source={assets.locationNew} radius={6} style={{ marginRight: 10, marginLeft: 10, marginTop: 2, width: 20, height: 20 }} />
            {googlePlace?.direccion ?
              <Text lineHeight={26} >
                {googlePlace?.direccion}
              </Text>
              :
              <Text lineHeight={26}>
                {t('common.loading')}
              </Text>
            }
          </View>

          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'baseline', borderWidth: 0, borderColor: 'red', height: 50, marginTop: -55 }} >
            <Image source={assets.phone} radius={6} style={{ marginTop: 15, marginRight: 10, marginLeft: 10, width: 20, height: 20 }} />
            {googlePlace?.direccion ?
              <Text lineHeight={26} onPress={() => { callPlace(googlePlace?.telefono); }}>
                {`${googlePlace?.telefono}`}
              </Text>
              :
              <Text lineHeight={26}>
                {t('common.loading')}
              </Text>
            }
          </View>
        </View>
      }
    </>
  );
};

export default ViewDestination;
