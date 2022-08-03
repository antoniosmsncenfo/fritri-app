import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';

import { useData, useTheme, useTranslation } from '../hooks';
import { Block, Button, Text } from '../components';
import { useNavigation } from '@react-navigation/native';
import LugarGoogle, { ILugarGoogleAction } from '../components/LugarGoogle';
import { ILugarGoogleData } from '../components/LugarGoogle';
import { useGooglePlace } from '../hooks/useGooglePlace';
import { ISolicitudLugaresGoogle } from '../interfaces/solicitud-lugares-google';
import Slider from '@react-native-community/slider';
import { IAtraccionesturistica, IRestaurante, ISeccionRestaurantes } from '../interfaces/paseo';

const LugaresGoogleHeader = () => {
  const { t } = useTranslation();
  const { sizes } = useTheme();
  return (
    <>
      <Block row flex={0} align="center" justify="space-between" marginVertical={sizes.m} >
        <Text h5 semibold>
          {t('restaurants.recommendations')}
        </Text>
      </Block>
    </>
  );
};

interface IFooterProps {
  show: boolean;
  onPress?: (event?: any) => void
}

const LugaresGoogleFooter = ({ show, onPress }: IFooterProps) => {
  const { t } = useTranslation();
  const { sizes } = useTheme();
  return (
    <Block row justify="center" onTouchEnd={onPress} padding={sizes.padding}>
      {show &&
        (<Text primary semibold transform="uppercase">
          {t('restaurants.seeMore')}
        </Text>)}
    </Block>
  );
};

const Restaurants = () => {
  const { t } = useTranslation();
  const { sizes, gradients, colors } = useTheme();
  const { newTripTemp, setNewTripTemp } = useData();
  const { lugaresGoogleResponse, getLugaresGoogle } = useGooglePlace();
  const [selectedRestaurants, setSelectedRestaurants] = useState<IRestaurante[]>([]);
  //const [selectedSights, setSelectedSights] = useState<IAtraccionesturistica[]>([]);
  const [lugaresGoogleData, setLugaresGoogleData] = useState<ILugarGoogleData[]>([]);
  const [selectedRadio, setSelectedRadio] = useState(5);
  const [notFound, setNotFound] = useState(false);
  const [showPagination, setShowPagination] = useState(false);
  const [showActivityIndicator, setShowActivityIndicator] = useState(true);
  const [isPaginationUsed, setIsPaginationUsed] = useState(false);
  const navigation = useNavigation();
  const minDistanceKm = 5;
  const maxDistanceKm = 20;
  const stepDistanceKm = 5;

  useEffect(() => {
    requestLugaresGoogleToService(false);
  }, []);

  // se ejecuta cuando se obtienen los restaurantes del servicio
  useEffect(() => {
    let result: ILugarGoogleData[] = [];

    if (lugaresGoogleResponse && lugaresGoogleResponse.lugaresGoogle.length > 0) {
      //Convierte el restaurante en RestaurantData, para agregar la bandera de seleccionado en falso
      result = lugaresGoogleResponse.lugaresGoogle.map((r) => { return { selected: false, lugarGoogle: r }; });
      setNotFound(false);
    } else {
      setNotFound(true);
    }
    const resultFiltered = result.filter(r => r.lugarGoogle.urlFotos.length > 0); // quita los restaurantes sin foto

    if (isPaginationUsed) {
      const paginatedLugarGoogle = lugaresGoogleData.concat(resultFiltered);
      setLugaresGoogleData(paginatedLugarGoogle);
      setIsPaginationUsed(false);
    } else {
      setLugaresGoogleData(resultFiltered);
    }
    setSelectedRestaurants([]);
    setShowPagination(lugaresGoogleResponse.tokenPaginacion !== '' ? true : false);
    setShowActivityIndicator(false);
  }, [lugaresGoogleResponse]);

  //Agrega los restaurantes al paseo temporal, para luego navegar a las atracciones
  const goToSights = () => {
    //agregar los reataurantes al paseo temporal
    const seccionRestaurantes: ISeccionRestaurantes = {
      esFinalizadasVotaciones: false,
      fechaFinalizacionVotaciones: new Date(),
      restaurantes: selectedRestaurants,
    };

    setNewTripTemp({
      ...newTripTemp,
      seccionRestaurantes: seccionRestaurantes,
    });
    navigation.navigate('Sights');
  };

  //este es el callback que revisa si se desea ver el destino o seleccionarlo para agregarlo al paseo
  const onLugarGoogleChange = (action: ILugarGoogleAction) => {
    switch (action.action) {
      case 'select':
        updateLugaresGoogleData(action);
        break;
      case 'view':
        navigation.navigate('ViewDestination', action.lugarGoogle);
        break;
      default:
        break;
    }
  };

  //Aqui agrego los restaurantes seleccionados
  const updateLugaresGoogleData = ({ lugarGoogle, select }: ILugarGoogleAction) => {
    if (select) {
      const selected = {
        idLugarGoogle: lugarGoogle.idGoogle,
        nombre: lugarGoogle.nombre,
        descripcion: `{"calificacion": ${lugarGoogle.calificacion}, "vecindario":"${lugarGoogle.vecindario}"}`,
        urlFotos: lugarGoogle.urlFotos,
      };

      setSelectedRestaurants([...selectedRestaurants, selected]);
    }
    else {
      const filtered = selectedRestaurants.filter(r => r.idLugarGoogle !== lugarGoogle.idGoogle);
      setSelectedRestaurants(filtered);
    }
  };

  const requestLugaresGoogleToService = (usePagination: boolean = false) => {
    const request: ISolicitudLugaresGoogle = {
      latitud: newTripTemp.destino.latitud!,
      longitud: newTripTemp.destino.longitud!,
      radio: selectedRadio,
      tipo: 'restaurantes',
      tokenPaginacion: usePagination ? lugaresGoogleResponse.tokenPaginacion : '',
    };
    setShowActivityIndicator(true);
    getLugaresGoogle(request);
    setIsPaginationUsed(usePagination);
  };

  return (
    <>
      <Block flex={1} paddingHorizontal={sizes.sm} white>
        <Block row justify="center" marginLeft={sizes.xs}>
          <Text h5 bold size={13} transform="uppercase" >
            {t('restaurants.searching')} {selectedRadio} km
          </Text>
        </Block>

        <Block row marginVertical={sizes.sm}>
          <Block row justify="center" flex={1}>
            <Text h5 bold size={13} transform="uppercase" primary>
              {minDistanceKm} km
            </Text>
          </Block>
          <Block flex={5}>
            <Slider thumbTintColor={colors.primary!} style={{ height: 30 }} maximumValue={maxDistanceKm} minimumValue={minDistanceKm} step={stepDistanceKm}
              value={selectedRadio} onValueChange={sliderValue => setSelectedRadio(sliderValue)} onTouchEnd={() => requestLugaresGoogleToService(false)} />
          </Block>
          <Block row justify="center" flex={1} >
            <Text h5 bold size={13} transform="uppercase" primary>
              {maxDistanceKm} km
            </Text>
          </Block>
        </Block>
        {(selectedRestaurants.length > 0)
          && (
            <Button gradient={gradients.primary} marginVertical={sizes.s}
              onPress={() => goToSights()}>
              <Text white semibold transform="uppercase">
                {t('restaurants.sights')}
              </Text>
            </Button>
          )}
      </Block>

      <Block flex={4}>
        {/* lugaresGoogle list */}
        {/* not found */}
        {notFound && (
          <Block flex={0} paddingHorizontal={sizes.padding} paddingTop={sizes.padding}>
            <Text p>
              {t('restaurants.notFound1')}
            </Text>
            <Text p marginTop={sizes.s}>
              {t('restaurants.moreOptions')}
            </Text>
          </Block>
        )}

        {!notFound && (
          <Block flex={0} paddingLeft={sizes.sm} >
            <LugaresGoogleHeader />
          </Block>)}
        <Block>
          <FlatList
            refreshing={true}
            data={lugaresGoogleData}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => `${item?.lugarGoogle.idGoogle}`}
            style={{ paddingHorizontal: sizes.s, marginBottom: sizes.s }}
            contentContainerStyle={{ paddingHorizontal: sizes.s }}
            renderItem={({ item }) => (
              <LugarGoogle lugarGoogleProp={item} onPress={(value) => onLugarGoogleChange(value)} />
            )}
            ListFooterComponent={() =>
            (<Block>
              {showActivityIndicator &&
                (<Block paddingLeft={sizes.s} marginTop={sizes.s}>
                  <ActivityIndicator size="large" color={colors.primary} />
                </Block>)
              }
              <LugaresGoogleFooter show={showPagination} onPress={() => requestLugaresGoogleToService(true)} />
            </Block>)
            }
          />
        </Block>
      </Block>

    </ >
  );
};

export default Restaurants;
