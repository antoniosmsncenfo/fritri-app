import React, { useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';

import { useData, useTheme, useTranslation } from '../hooks';
import { Block, Button, Input, Text, Image, Article } from '../components';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { ITheme } from '../constants/types/theme';
import { IArticle } from '../constants/types';
import { useNavigation } from '@react-navigation/native';


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
  const [search, setSearch] = useState('');
  const [recommendations, setRecommendations] = useState<IArticle[]>([]);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const data = useData();
  const { handleArticle } = data;
  const navigation = useNavigation();

  // init recommendations list
  useEffect(() => {
    setRecommendations(data?.recommendations);
  }, [data?.recommendations]);

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
    <Block      >
      {/* inputs */}
      <Block
        keyboard
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        card
        paddingVertical={sizes.m}
        paddingHorizontal={sizes.m}
        margin={sizes.sm}
        flex={1}>
        <Input
          label="Trip name"
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

        <Button gradient={gradients.primary} onPress={() => handleSearch()}>
          <Text white semibold transform="uppercase">
            Buscar destinos
          </Text>
        </Button>

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
          data={recommendations}
          // stickyHeaderIndices={[0]}
          showsHorizontalScrollIndicator={false}

          keyExtractor={(item) => `${item?.id}`}
          style={{ paddingVertical: sizes.m }}
          contentContainerStyle={{ paddingBottom: sizes.m }}
          renderItem={({ item }) => (
            <Article {...item} onPress={() => handleRental(item)} />
          )}
        />
      </Block>
    </Block>
  );
};

export default NewTrip;
