import React, {useCallback, useState, useEffect} from 'react';

import {useData, useTheme, useTranslation} from '../hooks';
import {Block, Button, Image, Input, Product, Text} from '../components';
import { IDestino } from '../interfaces/destino';
import { useNavigation } from '@react-navigation/core';
import { View } from "react-native";



const VerDestino = (props) => {
  const {t} = useTranslation();
  const {assets, sizes, gradients} = useTheme();
  const navigation = useNavigation();
  const [destino, setDestino] = useState<IDestino | null>(null);

  console.log('props');
  console.log(props.route.params);
  // console.log(props.navigation.canGoBack());
  useEffect(() => {
    // if(props.route.params) {
      setDestino(props.route.params);
    // }
  }, [])

  return (
    <>
      <Block marginTop={sizes.m} paddingHorizontal={sizes.padding}>
        {/* <Button marginVertical={sizes.xs}
                gradient={gradients.primary} onPress={() => {props.navigation.goBack()}} >
          <Text bold white transform="uppercase">
            Regresar a paseo
          </Text>
        </Button> */}
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
        marginTop: -150
      }}>
        <View style={{ flexDirection: 'row', alignItems:'baseline', borderWidth: 0, borderColor: 'green', height: 50, marginTop: -15  }} >
          <Image source={assets.location} radius={6} style={{ marginRight: 10, marginLeft: 10}}/>
          <Text lineHeight={26}>
            { destino?.direccion }
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems:'baseline', borderWidth: 0, borderColor: 'red', height: 50,
        marginTop: -15 }} >
          <Image source={assets.location} radius={6} style={{ marginRight: 10, marginLeft: 10 }}/>
          <Text lineHeight={26}>
            { destino?.telefono }
          </Text>
        </View>
      </View>
    </>
  );
};

export default VerDestino;
