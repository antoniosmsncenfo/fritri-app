import React, { useCallback, useState } from 'react';

import { useTheme, useTranslation } from '../hooks';
import { Block, Button, Input, Text } from '../components';
import DateTimePicker from '@react-native-community/datetimepicker';
import { locale } from 'dayjs';

const NewTrip = () => {
  const { t } = useTranslation();
  const { colors, sizes, gradients } = useTheme();
  const [notFound, setNotFound] = useState(false);
  const [search, setSearch] = useState('');

  const handleSearch = useCallback(() => {
    setNotFound(true);
  }, [setNotFound]);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    if (selectedDate) {
      setDate(currentDate);
    }
  };

  return (
    <Block
      scroll
      showsVerticalScrollIndicator={false}>
      {/* search input */}
      <Block color={colors.card} flex={0} paddingHorizontal={sizes.padding}>
        <Input
          label="Trip name"
          returnKeyType="done"
          marginBottom={sizes.sm}
          placeholder="Name for the trip"
        />
        <Input
          label="Trip date"
          value={date.toLocaleDateString()}
          marginBottom={sizes.sm}
          placeholder="Name for the trip"
          onTouchEnd={() => setShow(true)}
          editable={false}
        />
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={'date'}
            onChange={onChange}
            minimumDate={new Date()}
          />
        )}
        <Input
          label="Destination"
          search
          returnKeyType="search"
          placeholder={t('common.search')}
          marginBottom={sizes.sm}
          onFocus={() => setNotFound(false)}
          onSubmitEditing={() => handleSearch()}
          onChangeText={(text) => setSearch(text)}
        />
        <Text h4 gradient={gradients.primary} end={[0.7, 0]}>
          {t('extras.title1')}
        </Text>
      </Block>

      {/* not found */}
      {notFound && (
        <Block flex={0} padding={sizes.padding}>
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
    </Block>
  );
};

export default NewTrip;
