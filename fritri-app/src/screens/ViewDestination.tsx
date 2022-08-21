import React, { useState, useEffect } from 'react';
import { Linking } from 'react-native';

import { useTheme, useTranslation } from '../hooks';
import { Block, Image, Text } from '../components';
import { useGooglePlace } from '../hooks/useGooglePlace';
import { IDestino } from '../interfaces/paseo';

const ViewDestination = (props) => {
  const { t } = useTranslation();
  const { assets, sizes } = useTheme();
  const [destino, setDestino] = useState<IDestino | null>(null);
  const {getGooglePlace, googlePlace, googlePlaceReady} = useGooglePlace();
  const [searchMoreInfo, setSearchMoreInfo] = useState(false);
  const [ocultarDireccion, setOcultarDireccion] = useState(false);
  const [ocultarTelefono, setOcultarTelefono] = useState(false);

  useEffect(() => {
    setDestino(props.route.params);
    const { idLugarGoogle, idGoogle } = props.route.params;
    const idLugarGoogleBuscar = idLugarGoogle ? idLugarGoogle : idGoogle;
    if (idLugarGoogleBuscar !== undefined && idLugarGoogleBuscar !== '') {
      getGooglePlace(idLugarGoogleBuscar);
      setSearchMoreInfo(true);
    }
  }, []);

  useEffect(() => {
    if(googlePlaceReady) {
      if(!googlePlace?.direccion) {
        setOcultarDireccion(true);
      }
      if(!googlePlace?.telefono) {
        setOcultarTelefono(true);
      }
    }
  }, [googlePlaceReady])

  const callPlace = (telefono) => {
    return Linking.openURL(`tel:${telefono}`);
  };

  return (
    <Block safe>
      <Block
        marginTop={sizes.m}
        scroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingVertical: sizes.s}}
        paddingHorizontal={sizes.padding}>
        <Block marginBottom={sizes.m}>
          <Image
            resizeMode="cover"
            source={{uri: destino?.urlFotos![0]}}
            style={{height: 250}}
          />
          <Block>
            <Block row justify="space-between">
              {destino?.estado && destino?.pais && (
                <Text p secondary marginTop={sizes.sm}>
                  {destino?.estado} / {destino?.pais}
                </Text>
              )}
            </Block>
          </Block>
          <Block>
            <Block row justify="space-between">
              <Text h4 marginVertical={sizes.s}>
                {destino?.nombre}
              </Text>
            </Block>
          </Block>
          <Block
            row
            align="flex-start"
            justify="flex-start"
            marginTop={sizes.sm}>
            {
              !ocultarDireccion && 
                <Image
                radius={0}
                source={assets.locationNew}
                style={{width: 25, height: 25}}
              />
            }
            { googlePlace?.direccion! ?
              <Text p secondary marginBottom={sizes.s} marginLeft={sizes.s}>
                {googlePlace?.direccion}
              </Text>
              : !ocultarDireccion &&
              <Text p secondary marginBottom={sizes.s} marginLeft={sizes.s}>
                {t('common.loading')}
              </Text>
            }
          </Block>
          <Block
            row
            align="flex-start"
            justify="flex-start"
            marginTop={sizes.sm}>
            {
              !ocultarTelefono && 
                <Image
                  radius={0}
                  source={assets.phone}
                  style={{width: 20, height: 20}}
                />
            }
              { googlePlace?.telefono ?
                <Text p onPress={() => { callPlace(googlePlace?.telefono); }} secondary marginBottom={sizes.s} marginLeft={sizes.s}>{googlePlace?.telefono}</Text>
              : !ocultarTelefono &&
              <Text p secondary marginBottom={sizes.s} marginLeft={sizes.s}>
                {t('common.loading')}
              </Text>
            }
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default ViewDestination;
