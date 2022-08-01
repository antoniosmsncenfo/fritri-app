import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';

import { useData, useTheme, useTranslation } from '../hooks';
import { Block, Button, Text } from '../components';
import { useNavigation } from '@react-navigation/native';
import Restaurant, { IRestaurantAction } from '../components/Restaurant';
import { IRestaurantData } from '../components/Restaurant';
import { useGooglePlace } from '../hooks/useGooglePlace';
import { ISolicitudLugaresGoogle } from '../interfaces/solicitud-lugares-google';
import Slider from '@react-native-community/slider';
import { IRestaurante, ISeccionRestaurantes } from '../interfaces/paseo';

const RestaurantsHeader = () => {
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

interface IRestaurantFooterProps {
  show: boolean;
  onPress?: (event?: any) => void
}

const RestaurantsFooter = ({ show, onPress }: IRestaurantFooterProps) => {
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
  const { restaurantsResponse, getRestaurants: getRestaurantsFromService } = useGooglePlace();
  const [selectedRestaurants, setSelectedRestaurants] = useState<IRestaurante[]>([]);
  const [restaurantsData, setRestaurantsData] = useState<IRestaurantData[]>([]);
  const [selectedRadio, setSelectedRadio] = useState(1);
  const [notFound, setNotFound] = useState(false);
  const [showPagination, setShowPagination] = useState(false);
  const [showActivityIndicator, setShowActivityIndicator] = useState(true);
  const [isPaginationUsed, setIsPaginationUsed] = useState(false);
  const navigation = useNavigation();
  const minDistanceKm = 5;
  const maxDistanceKm = 20;
  const stepDistanceKm = 5;

  useEffect(() => {
    requestRestaurantsToService(false);
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
    const resultFiltered = result.filter(r => r.restaurant.urlFotos.length > 0); // quita los restaurantes sin foto

    if (isPaginationUsed) {
      const paginatedRestaurants = restaurantsData.concat(resultFiltered);
      setRestaurantsData(paginatedRestaurants);
      setIsPaginationUsed(false);
    } else {
      setRestaurantsData(resultFiltered);
    }
    setSelectedRestaurants([]);
    setShowPagination(restaurantsResponse.tokenPaginacion !== '' ? true : false);
    setShowActivityIndicator(false);
  }, [restaurantsResponse]);

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
    //navigation.navigate('Sights');
  };

  //este es el callback que revisa si se desea ver el destino o seleccionarlo para agregarlo al paseo
  const onRestaurantChange = (action: IRestaurantAction) => {
    switch (action.action) {
      case 'select':
        updateRestaurantsData(action);
        break;
      case 'view':
        navigation.navigate('ViewDestination', action.restaurant);
        break;
      default:
        break;
    }
  };

  //Aqui agrego los restaurantes seleccionados
  const updateRestaurantsData = ({ restaurant, select }: IRestaurantAction) => {
    if (select) {
      const selected = {
        idLugarGoogle: restaurant.idGoogle,
        nombre: restaurant.nombre,
        descripcion: `{"calificacion": ${restaurant.calificacion}, "vecindario":"${restaurant.vecindario}"}`,
        urlFotos: restaurant.urlFotos,
      };

      setSelectedRestaurants([...selectedRestaurants, selected]);
    }
    else {
      const filtered = selectedRestaurants.filter(r => r.idLugarGoogle !== restaurant.idGoogle);
      setSelectedRestaurants(filtered);
    }
  };

  const requestRestaurantsToService = (usePagination: boolean = false) => {
    const request: ISolicitudLugaresGoogle = {
      latitud: newTripTemp.destino.latitud!,
      longitud: newTripTemp.destino.longitud!,
      radio: selectedRadio,
      tipo: 'restaurantes',
      tokenPaginacion: usePagination ? restaurantsResponse.tokenPaginacion : '',
    };
    setShowActivityIndicator(true);
    getRestaurantsFromService(request);
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
              value={selectedRadio} onValueChange={sliderValue => setSelectedRadio(sliderValue)} onTouchEnd={() => requestRestaurantsToService(false)} />
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
            <RestaurantsHeader />
          </Block>)}
        <Block>
          <FlatList
            refreshing={true}
            data={restaurantsData}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => `${item?.restaurant.idGoogle}`}
            style={{ paddingHorizontal: sizes.s, marginBottom: sizes.s }}
            contentContainerStyle={{ paddingHorizontal: sizes.s }}
            renderItem={({ item }) => (
              <Restaurant restaurant={item} onPress={(value) => onRestaurantChange(value)} pagination={showPagination} />
            )}
            ListFooterComponent={() =>
            (<Block>
              {showActivityIndicator &&
                (<Block paddingLeft={sizes.s} marginTop={sizes.s}>
                  <ActivityIndicator size="large" color={colors.primary} />
                </Block>)
              }
              <RestaurantsFooter show={showPagination} onPress={() => requestRestaurantsToService(true)} />
            </Block>)
            }
          />
        </Block>
      </Block>

    </ >
  );
};

export default Restaurants;
