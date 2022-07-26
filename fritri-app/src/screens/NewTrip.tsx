import React, { useEffect, useState } from 'react';
import { FlatList, Platform } from 'react-native';

import { useData, useTheme, useTranslation } from '../hooks';
import { Block, Button, Input, Text, Image, Checkbox } from '../components';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { ITheme } from '../constants/types/theme';
import Destination, { IDestinationAction, IDestinationData } from '../components/Destination';
import { useNavigation } from '@react-navigation/native';
import { useGooglePlace } from '../hooks/useGooglePlace';
import { IDestino, IPaseo } from '../interfaces/paseo';

interface ITouchableInput {
  icon: keyof ITheme['assets'];
  label?: string;
  value?: number | string;
  onPress?: () => void;
}

interface IIsvalid {
  name: boolean;
  destination: boolean;
}

const TouchableInput = ({ label, value, icon, onPress }: ITouchableInput) => {
  const { assets, colors, sizes } = useTheme();

  return (
    <Button align="flex-start" marginBottom={sizes.s} onPress={() => onPress?.()}>
      <Text bold marginBottom={sizes.s}>{label}</Text>
      <Block row gray outlined width="100%" align="center" radius={sizes.inputRadius} height={sizes.inputHeight}>
        <Image radius={0} color={colors.primary} source={assets?.[icon]} marginHorizontal={sizes.inputPadding} />
        <Text p black> {value} </Text>
      </Block>
    </Button>
  );
};

const NewTrip = () => {
  const initialDate = new Date();
  const { t } = useTranslation();
  const { newTripTemp, setNewTripTemp, user } = useData();
  const { destinations, destinationsSearch } = useGooglePlace();
  const { sizes, gradients } = useTheme();
  const [useGps, setuseGps] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [search, setSearch] = useState('');
  const [tripName, setTripName] = useState('');
  const [destinos, setDestinos] = useState<IDestinationData[]>([]);
  const [selectedDestino, setSelectedDestino] = useState<IDestino | null>(null);
  const [tripDate, setTripDate] = useState(initialDate);
  const [showCalendar, setshowCalendar] = useState(false);
  const [isValid, setIsvalid] = useState<IIsvalid>({ destination: false, name: false });
  const navigation = useNavigation();

  // se ejecuta cuando se obtienen los detinos del hook de destinos
  useEffect(() => {
    let result: IDestinationData[] = [];

    if (destinations && destinations.length > 0) {
      //Convierte el destino en DestinationData, para agregar la bandera de seleccionado en falso
      result = destinations.map((d) => { return { selected: false, destination: d }; });
      setNotFound(false);
    }
    else {
      if (search) {
        setNotFound(true);
      }
    }
    setDestinos(result);
    setSelectedDestino(null);
  }, [destinations]);

  useEffect(() => {
    setIsvalid({ name: tripName !== '', destination: selectedDestino !== null });
  }, [tripName, selectedDestino]);

  const handleSearch = () => {
    destinationsSearch(search);
  };

  //Agrega el destino al paseo temporal, para luego navegar a restaurantesw
  const goToRestaurants = () => {
    setNewTripTemp({
      ...newTripTemp,
      destino: selectedDestino!,
      fechaPaseo: tripDate,
      idCreador: user._id!,
      nombre: tripName,
    });

    navigation.navigate('Restaurants');
  };

  const onDateChange = (event: Event, selectedDate?: Date): void => {
    const currentDate = selectedDate || initialDate;
    if (Platform.OS === 'android') {
      setshowCalendar(false);
    }
    if (event.type === 'neutralButtonPressed') {
      setTripDate(tripDate);
    } else {
      setTripDate(currentDate);
    }
  };

  //este es el callback que revisa si se desea ver el destino o seleccionarlo para agregarlo al paseo
  const onDestinationChange = (action: IDestinationAction) => {
    switch (action.action) {
      case 'select':
        updateDestinationsData(action.destination);
        setSelectedDestino(action.destination);
        break;
      case 'view':
        navigation.navigate('ViewDestination', action.destination);
        break;
      default:
        break;
    }
  };

  //Aqui cambio el estado a los otros destinos para solo dejar seleccionado el último que se seleccionado
  const updateDestinationsData = (destino: IDestino) => {
    const filtered = destinos.map((d) => {
      if (destino.idGoogle === d.destination.idGoogle) {
        return { ...d, selected: true };
      }
      else {
        return { ...d, selected: false };
      }
    });
    setDestinos(filtered);
  };

  return (
    <Block
      scroll
      showsVerticalScrollIndicator={false}
      marginHorizontal={sizes.sm}
      marginTop={sizes.sm}>
      {/* inputs */}
      <Block
        card
        paddingVertical={sizes.sm}
        paddingHorizontal={sizes.sm}>
        <Input
          label={t('newTrip.tripName') + ' *'}
          icon="star"
          returnKeyType="done"
          marginBottom={sizes.s}
          placeholder={t('newTrip.tripNamePlaceHolder')}
          value={tripName}
          onChangeText={(value) => setTripName(value)}
          success={tripName !== ''}
        />
        <TouchableInput
          icon="calendar"
          label={t('newTrip.tripDate') + ' *'}
          value={dayjs(tripDate).format('DD-MM-YYYY')}
          onPress={() => setshowCalendar(true)}
        />
        {showCalendar && (
          <DateTimePicker
            testID="dateTimePicker"
            value={tripDate}
            mode={'date'}
            onChange={onDateChange}
            minimumDate={initialDate}
          />
        )}
        {!useGps &&
          (<Block>
            <Input
              label={t('newTrip.destination')}
              search
              returnKeyType="search"
              placeholder={t('newTrip.searchDestination')}
              onFocus={() => setNotFound(false)}
              onSubmitEditing={() => handleSearch()}
              onChangeText={(text) => setSearch(text)}
              marginBottom={sizes.sm}
            />
            <Button
              gradient={gradients.primary}
              onPress={() => handleSearch()}
              marginBottom={sizes.s}>
              <Text white semibold transform="uppercase">
                {t('newTrip.searchDestination')}
              </Text>
            </Button>
          </Block>)}

        <Block row flex={0} align="center" >
          <Checkbox marginRight={sizes.sm} onPress={(check) => (setuseGps(check))} />
          <Text bold paddingRight={sizes.s}>{t('newTrip.useGps')}</Text>
        </Block>

      </Block>
      {/* not found */}
      {notFound && (
        <Block flex={0} paddingHorizontal={sizes.padding} paddingTop={sizes.padding}>
          <Text p>
            {t('newTrip.notFound1')}"
            <Text p bold>
              {search}
            </Text>
            "{t('newTrip.notFound2')}
          </Text>
          <Text p marginTop={sizes.s}>
            {t('newTrip.moreOptions')}
          </Text>
        </Block>
      )}

      <Block>
        {/* destinations list */}
        <FlatList
          data={destinos}
          showsHorizontalScrollIndicator={false}
          horizontal
          keyExtractor={(item) => `${item?.destination.idGoogle}`}
          style={{ paddingVertical: sizes.s }}
          renderItem={({ item }) => (
            <Destination destination={item} onPress={(value) => onDestinationChange(value)} isUnique={destinos.length === 1} />
          )}
        />

        {!Object.values(isValid).includes(false)
          && (<Block row justify="space-between" paddingTop={sizes.s} paddingBottom={sizes.m}>
            <Button flex={1} paddingRight={sizes.s} gradient={gradients.primary} onPress={() => goToRestaurants()}>
              <Text white semibold transform="uppercase">
                {t('newTrip.restaurants')}
              </Text>
            </Button>
            <Button flex={1} gradient={gradients.primary} onPress={() => handleSearch()}>
              <Text white semibold transform="uppercase">
                {t('newTrip.random')}
              </Text>
            </Button>
          </Block>)}
      </Block>

    </Block>
  );
};

export default NewTrip;
