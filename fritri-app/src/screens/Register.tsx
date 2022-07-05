import React, {useCallback, useEffect, useState} from 'react';
import {Linking, Platform, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import {useData, useTheme, useTranslation} from '../hooks/';
import * as regex from '../constants/regex';
import {Block, Button, Input, Image, Text, Checkbox, Modal} from '../components/';
import { ITheme } from '../constants/types';
import { FlatList } from 'react-native-gesture-handler';
import { useUsuario } from '../hooks/useUsuario';

const isAndroid = Platform.OS === 'android';

interface IRegistration {
  name: string;
  email: string;
  gender: string;
  country: string;
  photo: string;
  password: string;
  confirmPassword: string;
  agreed: boolean;
}
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

const GENDER_TYPES: {
  [key: string]: string;
} = {'1': 'Mujer', '2': 'Hombre', '3': 'Otro'};

const COUNTRIES: {
  [key: string]: string;
} = {'1': 'Costa Rica', '2': 'Nicaragua', 
      '3': 'Panamá', '4': 'Guatemala', 
      '5': 'El Salvador'};

const options = {
  title: 'Selecciona foto de perfil',
  cancelButton: 'Cancelar',
  takePhotoButtonTitle: 'Tomar Foto',
  chooseFromLibraryButtonTitle: 'Abrir Galeria',
  noData: true,
};

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
  const {isDark} = useData();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [isValid, setIsValid] = useState<IRegistrationValidation>({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    agreed: true,
  });
  const [registration, setRegistration] = useState<IRegistration>({
    name: '',
    email: '',
    gender: GENDER_TYPES['1'],
    country: COUNTRIES['1'],
    photo:'',
    password: '',
    confirmPassword: '',
    agreed: true
  });

  const [gender, setGender] = useState(GENDER_TYPES['1']);

  const [country, setCountry] = useState(COUNTRIES['1']);

  const {registrarUsuario} = useUsuario();

  const [modal, setModal] = useState<
    'gender' | 'country' |  undefined
  >();

  const {assets, colors, gradients, sizes} = useTheme();


  const handleChange = useCallback(
    (value) => {
      setRegistration((state) => ({...state, ...value}));

      setModal(undefined);
    },
    [setRegistration],
  );

  const handleSignUp = useCallback(() => {
    if (!Object.values(isValid).includes(false)) {
      /** send/save registratin data */
      console.log('handleSignUp', registration);
      
      registrarUsuario({
        tipoLogin: 'Email',
        correoElectronico: registration.email,
        contrasena: registration.password,
        nombreCompleto: registration.name,
        genero: registration.gender,
        pais: registration.country
      })

      Alert.alert(
        t('register.welcome'),
        t('register.success'),
        [
          {text: 'OK', onPress: () => {
            console.log('OK button clicked');
            navigation.navigate('Home');},
          }
        ],
        { 
          cancelable: false 
        }
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
      confirmPassword: registration.confirmPassword===registration.password,
      agreed: registration.agreed,
    }));
  }, [registration, setIsValid]);

  return (
    <Block safe marginTop={sizes.md}>
      <Block paddingHorizontal={sizes.s}>
        <Block flex={0} style={{zIndex: 0}}>
          <Image
            background
            resizeMode="cover"
            padding={sizes.sm}
            radius={sizes.cardRadius}
            source={assets.background}
            height={sizes.height * 0.3}>
            {/* <Button
              row
              flex={0}
              justify="flex-start"
              onPress={() => navigation.goBack()}>
              <Image
                radius={0}
                width={10}
                height={18}
                color={colors.white}
                source={assets.arrow}
                transform={[{rotate: '180deg'}]}
              />
              <Text p white marginLeft={sizes.s}>
                {t('common.goBack')}
              </Text>
            </Button> */}

            <Text h4 center white marginTop={20}>
              {t('register.title')}
            </Text>
          </Image>
        </Block>
        {/* register form */}
        <Block
          keyboard
          behavior={!isAndroid ? 'padding' : 'height'}
          marginTop={-(sizes.height * 0.25 - sizes.l)}>
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
              <Text p semibold center>
                {t('register.subtitle')}
              </Text>
              {/* social buttons */}
              {/* <Block row center justify="space-evenly" marginVertical={sizes.m}>
                <Button outlined gray shadow={!isAndroid}>
                  <Image
                    source={assets.facebook}
                    height={sizes.m}
                    width={sizes.m}
                    color={isDark ? colors.icon : undefined}
                  />
                </Button>
                <Button outlined gray shadow={!isAndroid}>
                  <Image
                    source={assets.apple}
                    height={sizes.m}
                    width={sizes.m}
                    color={isDark ? colors.icon : undefined}
                  />
                </Button>
                <Button outlined gray shadow={!isAndroid}>
                  <Image
                    source={assets.google}
                    height={sizes.m}
                    width={sizes.m}
                    color={isDark ? colors.icon : undefined}
                  />
                </Button>
              </Block>
              <Block
                row
                flex={0}
                align="center"
                justify="center"
                marginBottom={sizes.sm}
                paddingHorizontal={sizes.xxl}>
                <Block
                  flex={0}
                  height={1}
                  width="50%"
                  end={[1, 0]}
                  start={[0, 1]}
                  gradient={gradients.divider}
                />
                <Text center marginHorizontal={sizes.s}>
                  {t('common.or')}
                </Text>
                <Block
                  flex={0}
                  height={1}
                  width="50%"
                  end={[0, 1]}
                  start={[1, 0]}
                  gradient={gradients.divider}
                />
              </Block> */}
              {/* form inputs */}
              <Block paddingHorizontal={sizes.sm}>
                <Input
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.name')}
                  placeholder={t('common.namePlaceholder')}
                  success={Boolean(registration.name && isValid.name)}
                  danger={Boolean(registration.name && !isValid.name)}
                  onChangeText={(value) => handleChange({name: value})}
                />
                <Input
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.email')}
                  keyboardType="email-address"
                  placeholder={t('common.emailPlaceholder')}
                  success={Boolean(registration.email && isValid.email)}
                  danger={Boolean(registration.email && !isValid.email)}
                  onChangeText={(value) => handleChange({email: value})}
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
                <TouchableInput
                  icon="more"
                  value={"Me.jpg"}
                  label={t('common.avatar')}
                  onPress={() => setModal(undefined)}
                />                                                 
                {/* 
                <Text bold marginBottom={sizes.s}>
                  {t('common.gender')}
                </Text>                
                <Button
                  row
                  flex={1}
                  gradient={gradients.primary}
                  //marginRight={sizes.s}
                  //onPress={() => onQTY?.()}
                  marginBottom={sizes.s}
                  >
                  <Block
                    row
                    align="center"
                    justify="space-between"
                    paddingHorizontal={sizes.sm}>
                    <Text bold white transform="uppercase" marginRight={sizes.sm}>
                      {registration.gender}
                    </Text>
                    <Image
                      source={assets.arrow}
                      color={colors.white}
                      transform={[{rotate: '90deg'}]}
                    />
                  </Block>
                </Button>                 */}
                <Input
                  secureTextEntry
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.password')}
                  placeholder={t('common.passwordPlaceholder')}
                  onChangeText={(value) => handleChange({password: value})}
                  success={Boolean(registration.password && isValid.password)}
                  danger={Boolean(registration.password && !isValid.password)}
                />
                <Input
                  secureTextEntry
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.confirmPassword')}
                  placeholder={t('common.confirmPasswordPlaceholder')}
                  onChangeText={(value) => handleChange({confirmPassword: value})}
                  success={Boolean(registration.confirmPassword && isValid.confirmPassword)}
                  danger={Boolean(registration.confirmPassword && !isValid.confirmPassword)}
                />                
              </Block>
              {/* checkbox terms */}
              {/* <Block row flex={0} align="center" paddingHorizontal={sizes.sm}>
                <Checkbox
                  marginRight={sizes.sm}
                  checked={registration?.agreed}
                  onPress={(value) => handleChange({agreed: value})}
                />
                <Text paddingRight={sizes.s}>
                  {t('common.agree')}
                  <Text
                    semibold
                    onPress={() => {
                      Linking.openURL('https://www.creative-tim.com/terms');
                    }}>
                    {t('common.terms')}
                  </Text>
                </Text>
              </Block> */}
              <Button
                onPress={handleSignUp}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                gradient={gradients.primary}
                disabled={Object.values(isValid).includes(false)}>
                <Text bold white transform="uppercase">
                  {t('common.signup')}
                </Text>
              </Button>
              {/* <Button
                primary
                outlined
                shadow={!isAndroid}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                onPress={() => navigation.navigate('Login')}>
                <Text bold primary transform="uppercase">
                  {t('common.signin')}
                </Text>
              </Button> */}
            </Block>
          </Block>
        </Block>
      </Block>
      <Modal
        visible={Boolean(modal)}
        onRequestClose={() => setModal(undefined)}>
          <FlatList
            keyExtractor={(index) => `${index}`}
            data={modal === 'gender' ? [1, 2, 3] : [1, 2, 3, 5]}
            renderItem={({item}) => (
              <Button
                marginBottom={sizes.sm}
                onPress={() =>
                  modal === 'gender'
                    //? handleGender(GENDER_TYPES[item])
                    //: handleCountry(COUNTRIES[item])
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
