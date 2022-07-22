import React, { useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';

import { useData, useTheme, useTranslation } from '../hooks';
import { Block, Button, Input, Text, Image, Article, Checkbox } from '../components';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { ITheme } from '../constants/types/theme';
import { IArticle } from '../constants/types';
import { useNavigation } from '@react-navigation/native';
import Destiny from '../components/Destiny';
import { IDestino } from '../interfaces/destino';


interface ITouchableInput {
  icon: keyof ITheme['assets'];
  label?: string;
  value?: number | string;
  onPress?: () => void;
}

const TouchableInput = ({ label, value, icon, onPress }: ITouchableInput) => {
  const { assets, colors, sizes } = useTheme();

  return (
    <Button
      align="flex-start"
      marginBottom={sizes.sm}
      onPress={() => onPress?.()}>
      <Text bold marginBottom={sizes.s}>
        {label}
      </Text>
      <Block
        row
        gray
        outlined
        width="100%"
        align="center"
        radius={sizes.inputRadius}
        height={sizes.inputHeight}>
        <Image
          radius={0}
          color={colors.primary}
          source={assets?.[icon]}
          marginHorizontal={sizes.inputPadding}
        />
        <Text p black>
          {value}
        </Text>
      </Block>
    </Button>
  );
};

const RentalHeader = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <>
      <Block>
        <Text h5 semibold color={colors.primary}>
          Destinos
        </Text>
      </Block>
    </>
  );
};

const NewTrip = () => {
  const { t } = useTranslation();
  const { sizes, gradients } = useTheme();
  const [notFound, setNotFound] = useState(false);
  const [useGps, setuseGps] = useState(false);
  const [search, setSearch] = useState('');
  const [destinos, setDestinos] = useState<IDestino[]>([]);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const data = useData();
  const { handleArticle } = data;
  const navigation = useNavigation();

  // init recommendations list
  useEffect(() => {
    setDestinos([
      {
        'idGoogle': 'ChIJ2RteDZqaNw0R8-7x1PqfhH0',
        'descripcion': 'León, España',
        'latitud': 42.59836110000001,
        'longitud': -5.5718779,
        'nombre': 'León, España',
        'estado': 'Castilla y León',
        'pais': 'España',
        'urlFoto': 'https://lh3.googleusercontent.com/places/AKR5kUhI4rWgZU1mwHLgT3d3gi4BwwqeiTEzv-CrFiammR6F3tgsi8WbdcWmlD1i9mknHotRik7asvsPUXXAMTNvJfssD68_DKWIzCw=s1600-w640-h480',
      },
      {
        'idGoogle': 'ChIJIefm1v--K4QRJ0OlYeyVbWA',
        'descripcion': 'León, Gto., México',
        'latitud': 21.1250077,
        'longitud': -101.6859605,
        'nombre': 'León, Gto., México',
        'estado': 'Guanajuato',
        'pais': 'México',
        'urlFoto': 'https://lh3.googleusercontent.com/places/AKR5kUhQKB6LvJhD5sx3E5mv583PN4H7VikM71ZHLJD56c-aXUCzwmfRJjXbUFuDnNugrjxD8-7RNOakWOlpA4-9nyPvBQwzEFbDB1I=s1600-w640-h480',
      },
    ]);
  }, []);

  const handleRental = useCallback(
    (article: IArticle) => {
      handleArticle(article);
      navigation.navigate('Rental');
    },
    [handleArticle, navigation],
  );

  const handleSearch = useCallback(() => {
    setNotFound(true);
  }, [setNotFound]);

  const onDateChange = (event, selectedDate: Date) => {
    const currentDate = selectedDate;
    setShow(false);
    if (selectedDate) {
      setDate(currentDate);
    }
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
        paddingVertical={sizes.m}
        paddingHorizontal={sizes.m}>
        <Input
          label="Trip name"
          icon="star"
          returnKeyType="done"
          marginBottom={sizes.sm}
          placeholder="Name for the trip"
        />
        <TouchableInput
          icon="calendar"
          label="Trip date"
          value={dayjs(date).format('DD-MM-YYYY')}
          onPress={() => setShow(true)}
        />
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={'date'}
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}
        {!useGps &&
          (<Block>
            <Input
              label="Destination"
              search
              returnKeyType="search"
              placeholder={t('common.search')}
              onFocus={() => setNotFound(false)}
              onSubmitEditing={() => handleSearch()}
              onChangeText={(text) => setSearch(text)}
              marginBottom={sizes.sm}
            />
            <Button
              gradient={gradients.primary}
              onPress={() => handleSearch()}
              marginBottom={sizes.sm}>
              <Text white semibold transform="uppercase">
                Buscar destinos
              </Text>
            </Button>
          </Block>)}

        <Block row flex={0} align="center" >
          <Checkbox marginRight={sizes.sm} onPress={(check) => (setuseGps(check))} />
          <Text bold paddingRight={sizes.s}>Usar gps</Text>
        </Block>

      </Block>
      {/* not found */}
      {show && (
        <Block >
          <Text p>
            {t('rentals.notFound1')}"
            <Text p bold>
              {search}
            </Text>
            "{t('rentals.notFound2')}
          </Text>
          <Text p marginTop={sizes.s}>
            {t('rentals.moreOptions')}
          </Text>
        </Block>
      )}
      <Block>
        {/* rentals list */}
        <FlatList
          data={destinos}
          // stickyHeaderIndices={[0]}
          showsHorizontalScrollIndicator={false}
          horizontal
          keyExtractor={(item) => `${item?.idGoogle}`}
          style={{ paddingVertical: sizes.m }}
          contentContainerStyle={{ paddingBottom: sizes.m }}
          renderItem={({ item }) => (
            <Destiny {...item} onPress={() => handleRental(item)} />
          )}
        />
      </Block>
      <Block card>
        {<Button gradient={gradients.primary} onPress={() => handleSearch()}>
          <Text white semibold transform="uppercase">
            Restaurantes
          </Text>
        </Button>}
      </Block>
    </Block>
  );
};

export default NewTrip;
