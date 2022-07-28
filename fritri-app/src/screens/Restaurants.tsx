import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';

import { useData, useTheme, useTranslation } from '../hooks';
import { Block, Button, Text } from '../components';
import { useNavigation } from '@react-navigation/native';
import { ILugarGoogle } from '../interfaces/lugar-google';
import Restaurant, { IRestaurantAction } from '../components/Restaurant';
import { IRestaurantData } from '../components/Restaurant';
import { useGooglePlace } from '../hooks/useGooglePlace';
import { ISolicitudLugaresGoogle } from '../interfaces/solicitud-lugares-google';
import Slider from '@react-native-community/slider';

const RentalHeader = () => {
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

const Restaurants = () => {
  const { t } = useTranslation();
  const { sizes, gradients, colors } = useTheme();
  const { newTripTemp } = useData();
  const { restaurantsResponse, getRestaurants: getRestaurantsFromService } = useGooglePlace();
  const [selectedRestaurants, setSelectedRestaurants] = useState<ILugarGoogle[]>([]);
  const [restaurantsData, setRestaurantsData] = useState<IRestaurantData[]>([]);
  const [selectedRadio, setSelectedRadio] = useState(1);
  const [notFound, setNotFound] = useState(false);
  const navigation = useNavigation();
  const minDistanceKm = 5;
  const maxDistanceKm = 50;
  const stepDistanceKm = 5;

  useEffect(() => {
    requestRestaurantsToService();
  }, []);

  // se ejecuta cuando se obtienen los restaurantes del servicio
  useEffect(() => {
    let result: IRestaurantData[] = [];

    if (restaurantsResponse && restaurantsResponse.restaurantes.length > 0) {
      //Convierte el restaurante en RestaurantData, para agregar la bandera de seleccionado en falso
      result = restaurantsResponse.restaurantes.map((r) => { return { selected: false, restaurant: r }; });
      setNotFound(false);
    } else {
      setNotFound(true);
    }
    const resultFiltered = result.filter(r => r.restaurant.urlFoto !== ''); // quita los restaurantes sin foto
    setRestaurantsData(resultFiltered);
    setSelectedRestaurants([]);
  }, [restaurantsResponse]);

  //Agrega el destino al paseo temporal, para luego navegar a restaurantesw
  const goToSights = () => {
    //agregar los reataurantes al paseo temporal

    navigation.navigate('Restaurants');
  };

  //este es el callback que revisa si se desea ver el destino o seleccionarlo para agregarlo al paseo
  const onRestaurantChange = (action: IRestaurantAction) => {
    switch (action.action) {
      case 'select':
        updateRestaurantsData(action.restaurant);
        setSelectedRestaurants([...selectedRestaurants, action.restaurant]);
        //setSelectedRestaurants([...restaurants, {...action.restaurant}]);
        break;
      case 'view':
        navigation.navigate('ViewDestination', action.restaurant);
        break;
      default:
        break;
    }
  };

  //Aqui agrego los restaurantes seleccionados
  const updateRestaurantsData = (destino: ILugarGoogle) => {
    const filtered = restaurantsData.map((r) => {
      if (destino.idGoogle === r.restaurant.idGoogle) {
        return { ...r, selected: true };
      }
      else {
        return { ...r, selected: false };
      }
    });
    setRestaurantsData(filtered);
  };

  const requestRestaurantsToService = () => {
    const request: ISolicitudLugaresGoogle = {
      latitud: newTripTemp.destino.latitud!,
      longitud: newTripTemp.destino.longitud!,
      radio: selectedRadio,
      tipo: 'restaurantes',
      tokenPaginacion: '',
    };
    getRestaurantsFromService(request);
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
              value={selectedRadio} onValueChange={sliderValue => setSelectedRadio(sliderValue)} onTouchEnd={requestRestaurantsToService} />
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
        {/* restaurants list */}
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
            <RentalHeader />
          </Block>)}
        <Block>
          <FlatList
            data={restaurantsData}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => `${item?.restaurant.idGoogle}`}
            style={{ paddingHorizontal: sizes.s, marginBottom: sizes.s }}
            contentContainerStyle={{ paddingHorizontal: sizes.s}}
            renderItem={({ item }) => (
              <Restaurant restaurant={item} onPress={(value) => onRestaurantChange(value)} isUnique={restaurantsData.length === 1} />
            )}
          />
        </Block>

      </Block>

    </ >
  );
};

export default Restaurants;
