import React, { useCallback, useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useTheme, useTranslation } from '../hooks/';
import * as regex from '../constants/regex';
import { Block, Button, Input, Image, Text } from '../components/';
import { ResetPasswordStatus } from '../interfaces/registro-usuario';

const isAndroid = Platform.OS === 'android';

interface ITripPin {
  pin: boolean;
}

interface ICheckTripPin {
  pin: string;
  status: ResetPasswordStatus;
}

const TripSecurity = (props) => {

  const { t } = useTranslation();
  const navigation = useNavigation();

  const [isValid, setIsValid] = useState<ITripPin>({
    pin: false,
  });

  const [checkTripPin, setCheckTripPin] = useState<ICheckTripPin>({
    pin: '',
    status: ResetPasswordStatus.Pending,
  });

  const [pinPaseo, setPinPaseo] = useState('');
  const [idPaseo, setIdPaseo] = useState();
  const [pinPaseoValid, setPinPaseoValid] = useState(false);

  const { colors, gradients, sizes } = useTheme();

  const handleChange = useCallback(
    (value) => {
      setCheckTripPin((state) => ({ ...state, ...value }));
    },
    [setCheckTripPin],
  );

  const checkPinPaseo = () => {
    if(checkTripPin.pin === pinPaseo.toString()) setPinPaseoValid(true)
    else {
      Alert.alert(
        t('tripSecurity.missingDataTitle'),
        t('tripSecurity.errorMessage'),
        [
          { text: 'OK' },
        ],
        {
          cancelable: false,
        }
      );
    }
  }

  const handleCheckPin = useCallback(() => {
    if (!Object.values(isValid).includes(false)) {
      checkPinPaseo();
    }
    else {
      Alert.alert(
        t('tripSecurity.missingDataTitle'),
        t('tripSecurity.missingDataMessage'),
        [
          { text: 'OK' },
        ],
        {
          cancelable: false,
        }
      );
    }
  }, [isValid]);

  useEffect(() => {
    setPinPaseo(props.route.params.pin);
    setIdPaseo(props.route.params.id);
  }, []);

  useEffect(() => {
    if(pinPaseoValid) {
      const param = { id: idPaseo, from: 'TripSecurity' };
      resetNavigationStackAndNavigateToTripDetails(param);
    }
  }, [pinPaseoValid]);

  const resetNavigationStackAndNavigateToTripDetails = (param: any) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'Home' },
          { name: 'TripDetails', params: param },
        ],
      })
    );
  };

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      pin: regex.pin.test(checkTripPin.pin),
    }));
  }, [checkTripPin, setIsValid]);

  return (
    <Block safe>
      <Block paddingHorizontal={sizes.s}>
        <Block flex={0}
          gradient={gradients.primary}
          style={{ zIndex: 0, height: sizes.height * 0.3 }}
          radius={sizes.sm}>
          <Text h4 center white marginTop={sizes.l}>
            {t('tripSecurity.title')}
          </Text>
        </Block>
        <Block
          keyboard
          behavior={!isAndroid ? 'padding' : 'height'}
          marginTop={-(sizes.height * 0.20 - sizes.l)}>
          <Block
            flex={0}
            radius={sizes.sm}
            marginHorizontal="8%"
            shadow={!isAndroid}
          >
            <Block
              blur
              flex={0}
              intensity={150}
              radius={sizes.sm}
              overflow="hidden"
              justify="space-evenly"
              tint={colors.blurTint}
              paddingVertical={sizes.sm}>
              <Block paddingHorizontal={sizes.sm}>
                <Input
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('tripSecurity.code')}
                  keyboardType="numeric"
                  placeholder={t('tripSecurity.code')}
                  success={Boolean(checkTripPin.pin && isValid.pin)}
                  danger={Boolean(checkTripPin.pin && !isValid.pin)}
                  onChangeText={(value) => handleChange({ pin: value })}
                />
              </Block>
              <Button
                onPress={handleCheckPin}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                gradient={gradients.primary}
              >
                <Text bold white transform="uppercase">
                  {t('tripSecurity.access')}
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default TripSecurity;
