import React, {useCallback, useState, useEffect} from 'react';

import {useData, useTheme, useTranslation} from '../hooks';
import {Block, Button, Image, Input, Product, Text} from '../components';
import { IDestino } from '../interfaces/destino';
import {Linking} from 'react-native'
import { View } from "react-native";
import { useGooglePlace } from '../hooks/useGooglePlace';
import { IBuscarLugarGoogle } from '../interfaces/buscar-lugar-google';



const ViewDestination = (props) => {
  const {t} = useTranslation();
  const {assets, sizes, gradients} = useTheme();
  const [destino, setDestino] = useState<IDestino | null>(null);
  const { getGooglePlace, googlePlace } = useGooglePlace();

  useEffect(() => {
    setDestino(props.route.params);
    const { tipoLugar, idGoogle } = props.route.params;
    const buscarLugar: IBuscarLugarGoogle = {
      tipoLugar: tipoLugar || null,
      idGoogle: idGoogle || null
    }
    getGooglePlace(buscarLugar);
  }, [])

  const callPlace = (telefono) => {
    return Linking.openURL(`tel:${telefono}`);
  }

  return (
    <>
      <Block marginTop={sizes.m} paddingHorizontal={sizes.padding}>
        <Block>
          <Image
            resizeMode="cover"
            source={{ uri: destino?.urlFoto }}
            style={{ width: '100%', height: '60%' }}
          />
          <Text p secondary marginTop={sizes.sm}>
            { destino?.estado } / { destino?.pais }
          </Text>
          <Text h4 marginVertical={sizes.s}>
            { destino?.nombre }
          </Text>
        </Block>
      </Block>

      {/* Parte del restaurante o actividad turística */}
      <View style={{
        flexDirection: "column",
        height: 200,
        padding: 15,
        marginTop: -200
      }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems:'stretch', borderWidth: 0, height: 20, borderColor: 'green', width: '88%', marginTop: -15  }} >
            <Image source={assets.location} radius={6} style={{ marginRight: 10, marginLeft: 10, marginTop: 2}}/>
            { googlePlace?.direccion ? 
              <Text lineHeight={26} >
                { googlePlace?.direccion }
              </Text>
            :
              <Text lineHeight={26}>
                { t('common.loading') }
              </Text>
            }
          </View>

          <View style={{ flex: 1, flexDirection: 'row', alignItems:'baseline', borderWidth: 0, borderColor: 'red', height: 50,
          marginTop: -55 }} >
            <Image source={assets.location} radius={6} style={{ marginRight: 10, marginLeft: 10 }}/>
            { googlePlace?.direccion ? 
              <Text lineHeight={26} onPress={() => { callPlace(googlePlace?.telefono) }}>
                {`${googlePlace?.telefono}`}
              </Text>
            :
              <Text lineHeight={26}>
                { t('common.loading') }
              </Text>
            }
          </View>
      </View>
    </>
  );
};

export default ViewDestination;
