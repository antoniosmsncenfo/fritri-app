import React, { useCallback, useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/core';

import { useData, useTheme, useTranslation } from '../hooks/';
import * as regex from '../constants/regex';
import { Block, Button, Input, Image, Text, Modal } from '../components/';
import { FotoUsuario, ITheme } from '../constants/types';
import { FlatList } from 'react-native-gesture-handler';
import { useUsuario } from '../hooks/useUsuario';
import { IRegistration, RegistrationStatus } from '../interfaces/registro-usuario';
import { COUNTRIES } from '../constants/countries';

const isAndroid = Platform.OS === 'android';

interface IRegistrationValidation {
  name: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
  agreed: boolean;
}

interface ITouchableInput {
  icon: keyof ITheme['assets'];
  label?: string;
  value?: number | string;
  onPress?: () => void;
}

const TouchableInput = ({label, value, icon, onPress}: ITouchableInput) => {
  const {assets, colors, sizes} = useTheme();

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
          color={colors.icon}
          source={assets?.[icon]}
          marginHorizontal={sizes.inputPadding}
        />
        <Text p gray>
          {value}
        </Text>
      </Block>
    </Button>
  );
};

const Register = () => {
  const { isDark } = useData();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [isValid, setIsValid] = useState<IRegistrationValidation>({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    agreed: true,
  });

  const GENDER_TYPES: { [key: string]: string; } =
  {
    '1': t('common.genders.woman'),
    '2': t('common.genders.man'),
    '3': t('common.genders.other'),
  };

  const [registration, setRegistration] = useState<IRegistration>({
    name: '',
    email: '',
    gender: GENDER_TYPES['1'],
    country: COUNTRIES['1'],
    password: '',
    confirmPassword: '',
    agreed: true,
    status: RegistrationStatus.New,
  });

  const [gender, setGender] = useState(GENDER_TYPES['1']);

  const [country, setCountry] = useState(COUNTRIES['1']);

  const { resetRegistrarEstatus, registrarUsuario, registrarStatus } = useUsuario();

  const [modal, setModal] = useState<
    'gender' | 'country' | undefined
  >();

  const { assets, colors, gradients, sizes } = useTheme();

  const handleChange = useCallback(
    (value) => {
      setRegistration((state) => ({ ...state, ...value }));

      setModal(undefined);
    },
    [setRegistration],
  );

  const handleSignUp = useCallback(() => {
    if (!Object.values(isValid).includes(false)) {
      registrarUsuario({
        tipoLogin: 'Email',
        correoElectronico: registration.email,
        contrasena: registration.password,
        nombreCompleto: registration.name,
        genero: registration.gender,
        foto: registration.gender === t('common.genders.woman')
          ? FotoUsuario.Mujer
          : FotoUsuario.Hombre,
        pais: registration.country,
      });
    }
     else {
      Alert.alert(
        t('register.registerError'),
        t('register.fieldsError'),
        [{ text: 'OK' }],
        { cancelable: false }
      );
    }
  }, [isValid, registration]);

  const handleGender = useCallback(
    (value: string) => {
      setGender(value);
      // hide modal / reset modal state
      setModal(undefined);
    },
    [setGender, setModal],
  );

  const handleCountry = useCallback(
    (value: string) => {
      setCountry(value);
      // hide modal / reset modal state
      setModal(undefined);
    },
    [setCountry, setModal],
  );

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      name: regex.name.test(registration.name),
      email: regex.email.test(registration.email),
      password: regex.password.test(registration.password),
      confirmPassword: registration.confirmPassword === registration.password,
      agreed: registration.agreed,
    }));
  }, [registration, setIsValid]);

  useEffect(() => {
    if (registrarStatus === RegistrationStatus.Success) {
      Alert.alert(
        t('register.welcome'),
        t('register.success'),
        [
          {
            text: 'OK', onPress: () => {
              navigation.navigate('Home');
            },
          },
        ],
        {
          cancelable: false,
        }
      );
    }
    else if (registrarStatus === RegistrationStatus.Duplicated) {
      Alert.alert(
        t('register.validation'),
        t('register.emailExists'),
        [
          { text: 'OK' },
        ],
        {
          cancelable: false,
        }
      );
      resetRegistrarEstatus();
    }
  }, [registrarStatus]);

  return (
    <Block safe>
      <Block paddingHorizontal={sizes.s}>
        <Block flex={0} gradient={gradients.primary} style={{ zIndex: 0, height: sizes.height * 0.3 }}>
            <Text h4 center white marginTop={sizes.l}>
              {t('register.subtitle')}
            </Text>
        </Block>
        {/* register form */}
        <Block
          keyboard
          behavior={!isAndroid ? 'padding' : 'height'}
          marginTop={-(sizes.height * 0.20 - sizes.l)}>
          <Block
            flex={0}
            radius={sizes.sm}
            marginHorizontal="8%"
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
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

              {/* form inputs */}
              <Block paddingHorizontal={sizes.sm}>
                <Input
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.name')}
                  placeholder={t('common.namePlaceholder')}
                  success={Boolean(registration.name && isValid.name)}
                  danger={Boolean(registration.name && !isValid.name)}
                  onChangeText={(value) => handleChange({ name: value })}
                />
                <Input
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.email')}
                  keyboardType="email-address"
                  placeholder={t('common.emailPlaceholder')}
                  success={Boolean(registration.email && isValid.email)}
                  danger={Boolean(registration.email && !isValid.email)}
                  onChangeText={(value) => handleChange({ email: value })}
                />
                <TouchableInput
                  icon="users"
                  value={registration.gender}
                  label={t('common.gender')}
                  onPress={() => setModal('gender')}
                />
                <TouchableInput
                  icon="home"
                  value={registration.country}
                  label={t('common.country')}
                  onPress={() => setModal('country')}
                />

                <Input
                  secureTextEntry
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.password')}
                  rules={t('register.passwordRules')}
                  placeholder={t('common.passwordPlaceholder')}
                  onChangeText={(value) => handleChange({ password: value })}
                  success={Boolean(registration.password && isValid.password)}
                  danger={Boolean(registration.password && !isValid.password)}
                />
                <Input
                  secureTextEntry
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.confirmPassword')}
                  rules={t('register.passwordRules')}
                  placeholder={t('common.confirmPasswordPlaceholder')}
                  onChangeText={(value) => handleChange({ confirmPassword: value })}
                  success={Boolean(registration.confirmPassword && isValid.confirmPassword)}
                  danger={Boolean(registration.confirmPassword && !isValid.confirmPassword)}
                />
              </Block>
              <Button
                onPress={handleSignUp}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                gradient={gradients.primary}>
                <Text bold white transform="uppercase">
                  {t('common.signup')}
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Block>
      <Modal
        visible={Boolean(modal)}
        onRequestClose={() => setModal(undefined)}>
          <FlatList
            keyExtractor={(index) => `${index}`}
            data={modal === 'gender' ? [1, 2, 3] : Object.keys(COUNTRIES).map(x => Number(x))}
            renderItem={({item}) => (
              <Button
                marginBottom={sizes.sm}
                onPress={() =>
                  modal === 'gender'
                    ? handleChange({gender: GENDER_TYPES[item]})
                    : handleChange({country: COUNTRIES[item]})
                }>
                <Text p white semibold transform="uppercase">
                  {modal === 'gender' ? GENDER_TYPES[item] : COUNTRIES[item]}
                </Text>
              </Button>
            )}
          />
      </Modal>
    </Block>
  );
};

export default Register;
