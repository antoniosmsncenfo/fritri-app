import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Platform } from 'react-native';

import { useTheme, useTranslation } from '../hooks';
import { Block, Button, Input, Text, Image, Checkbox } from '../components';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { ITheme } from '../constants/types/theme';
import Destination, { IDestinationAction, IDestinationData } from '../components/Destination';
import { IDestino } from '../interfaces/destino';
import { useNavigation } from '@react-navigation/native';


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
  const { sizes, gradients } = useTheme();
  const [useGps, setuseGps] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [search, setSearch] = useState('');
  const [tripName, setTripName] = useState('');
  const [destinos, setDestinos] = useState<IDestinationData[]>([]);
  const [selectedDestino, setSelectedDestino] = useState<IDestino | null>(null);
  const [tripDate, setTripDate] = useState(initialDate);
  const [show, setShow] = useState(false);
  const [isValid, setIsvalid] = useState<IIsvalid>({ destination: false, name: false });
  const navigation = useNavigation();

  const initialData: IDestinationData[] = [{
    selected: false,
    destination: {
      'idGoogle': 'ChIJ2RteDZqaNw0R8-7x1PqfhH0',
      'descripcion': 'León, España',
      'latitud': 42.59836110000001,
      'longitud': -5.5718779,
      'nombre': 'León, España',
      'estado': 'Castilla y León',
      'pais': 'España',
      'urlFoto': 'https://lh3.googleusercontent.com/places/AKR5kUhI4rWgZU1mwHLgT3d3gi4BwwqeiTEzv-CrFiammR6F3tgsi8WbdcWmlD1i9mknHotRik7asvsPUXXAMTNvJfssD68_DKWIzCw=s1600-w640-h480',
    },
  },
  {
    selected: false,
    destination: {
      'idGoogle': 'ChIJIefm1v--K4QRJ0OlYeyVbWA',
      'descripcion': 'León, Gto., México',
      'latitud': 21.1250077,
      'longitud': -101.6859605,
      'nombre': 'León, Gto., México',
      'estado': 'Guanajuato',
      'pais': 'México',
      'urlFoto': 'https://lh3.googleusercontent.com/places/AKR5kUhQKB6LvJhD5sx3E5mv583PN4H7VikM71ZHLJD56c-aXUCzwmfRJjXbUFuDnNugrjxD8-7RNOakWOlpA4-9nyPvBQwzEFbDB1I=s1600-w640-h480',
    },
  },
  {
    selected: false,
    destination: {
      'idGoogle': 'ChIJQeeiKAlWp48R67ZYZuZYfns',
      'descripcion': 'Tortuguero, Limón, Costa Rica',
      'latitud': 10.5424838,
      'longitud': -83.50235520000001,
      'nombre': 'Tortuguero, Limón, Costa Rica',
      'estado': 'Limón',
      'pais': 'Costa Rica',
      'urlFoto': 'https://lh3.googleusercontent.com/places/AKR5kUjBB_3ZuzZl-UAHHnUFhfNHZkMeQvPRi-aED8qe1SirSX6THe6hUQChwDnVe1jA9yGOBDqCrutISm9mEtFz-aUTD8LhU6dYhZM=s1600-w640-h480',
    },
  },
  ];

  useEffect(() => {
    setDestinos(initialData);
  }, []);

  useEffect(() => {
    setIsvalid({ name: tripName !== '', destination: selectedDestino !== null });
  }, [tripName, selectedDestino]);

  // Quitar este al final, es solo para debug
  useEffect(() => {
    console.log(selectedDestino);
  }, [selectedDestino]);

  const handleSearch = useCallback(() => {
    setNotFound(true);
  }, [setNotFound]);

  const onDateChange = (event: Event, selectedDate?: Date): void => {
    const currentDate = selectedDate || initialDate;
    if (Platform.OS === 'android') {
      setShow(false);
    }
    if (event.type === 'neutralButtonPressed') {
      setTripDate(tripDate);
    } else {
      setTripDate(currentDate);
    }
  };

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
          onPress={() => setShow(true)}
        />
        {show && (
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
            // stickyHeaderIndices={[0]}
            showsHorizontalScrollIndicator={false}
            horizontal
            keyExtractor={(item) => `${item?.destination.idGoogle}`}
            style={{ paddingVertical: sizes.s }}
            renderItem={({ item }) => (
              <Destination destination={item} onPress={(value) => onDestinationChange(value)} />
            )}
          />

          {!Object.values(isValid).includes(false)
            && (<Block row justify="space-between" paddingTop={sizes.s} paddingBottom={sizes.m}>
              <Button flex={1} paddingRight={sizes.s} gradient={gradients.primary} onPress={() => handleSearch()}>
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
