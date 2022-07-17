import React, { useCallback, useEffect, useState } from 'react';
import { Platform, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { email, name } from '../constants/regex';

import { useData, useTheme, useTranslation } from '../hooks/';
import * as regex from '../constants/regex';
import { Block, Button, Input, Image, Text, Modal } from '../components/';
import { FotoUsuario, ITheme } from '../constants/types';
import { FlatList } from 'react-native-gesture-handler';
import { useUsuario } from '../hooks/useUsuario';
import { IRegistration, RegistrationStatus } from '../interfaces/registro-usuario';
import { IUsuario } from '../constants/types/index';
import { COUNTRIES } from '../constants/countries';


const isAndroid = Platform.OS === 'android';
//Regist page
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

const options = {
  title: 'Selecciona foto de perfil',
  cancelButton: 'Cancelar',
  takePhotoButtonTitle: 'Tomar Foto',
  chooseFromLibraryButtonTitle: 'Abrir Galeria',
  noData: true,
};

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


const Profile = () => {

  const { user, handleUser } = useData();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const GENDER_TYPES: { [key: string]: string; } =
  {
    '1': t('common.genders.woman'),
    '2': t('common.genders.man'),
    '3': t('common.genders.other'),
  };

  const [registration, setRegistration] = useState<IRegistration>({
    name: user.nombreCompleto,
    email: user.correoElectronico,
    gender: user.genero!,
    country: user.pais!,
    password: '',
    confirmPassword: '',
    agreed: true,
    status: RegistrationStatus.New,
  });

  const [isValid, setIsValid] = useState<IRegistrationValidation>({
    name: regex.name.test(registration.name || ''),
    email: regex.email.test(registration.email || ''),
    password: true,
    confirmPassword: true,
    agreed: true,
  });

  const [gender, setGender] = useState(GENDER_TYPES['1']);

  const [country, setCountry] = useState(COUNTRIES['1']);

  const { resetRegistrarEstatus, updateUsuario, usuarioFriTri, fritriUser, registrarStatus } = useUsuario();


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

  const handleUpdateData = useCallback(() => {
    if (!Object.values(isValid).includes(false)) {
      let userToUpdate: IUsuario = {
        id: user._id,
        tipoLogin: user.tipoLogin,
        correoElectronico: registration.email,
        nombreCompleto: registration.name,
        genero: registration.gender,
        pais: registration.country,
      };
      if (user.idTerceros) {
        userToUpdate = {
          ...userToUpdate,
          idTerceros: user.idTerceros,
        };
      }
      try {
        updateUsuario(userToUpdate);
      } catch (error) {

      }
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

  const emailLogout = () => {
    Alert.alert(
      t('common.logOutConfirmT'),
      t('common.logOutConfirmC'),
      [
        { text: 'Yes', onPress: () => navigation.navigate('Login') },
        { text: 'No', onPress: () => ('No button clicked'), style: 'cancel' },
      ],
      {
        cancelable: false,
      }
    );
  };


  const handlePasswordChange = () => {
    navigation.navigate('NewPassword');
  };

  useEffect(() => {
    setRegistration({
      name: user.nombreCompleto,
      email: user.correoElectronico,
      gender: user.genero!,
      country: user.pais!,
      password: '',
      confirmPassword: '',
      agreed: true,
      status: RegistrationStatus.New,
    });

    setIsValid((state) => ({
      ...state,
      name: regex.name.test(registration.name),
      email: regex.email.test(registration.email),
    }));
  }, []);

  useEffect(() => {
    if (fritriUser) {
      handleUser(fritriUser!);
    }
  }, [fritriUser]);

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      name: regex.name.test(registration.name),
      email: regex.email.test(registration.email),
    }));
    console.log('');
  }, [registration, setIsValid]);

  useEffect(() => {
    if (registrarStatus === RegistrationStatus.Success) {
      Alert.alert(
        t('register.updateUser'),
        t('register.titleUpdated'),
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
    <Block safe marginTop={sizes.md}>
      <Block paddingHorizontal={sizes.s}>
        <Block flex={0} style={{ zIndex: 0 }}>
          <Image
            background
            resizeMode="cover"
            padding={sizes.sm}
            radius={sizes.cardRadius}
            source={assets.background}
            height={sizes.height * 0.3}>
            <Block flex={0} align="center">
              <Image
                width={64}
                height={64}
                 source={{ uri: user.urlFoto }}
              />
            </Block>
          </Image>

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
              <Text p semibold center>
                {t('register.subtitleUpdate')}
              </Text>
              <Block paddingHorizontal={sizes.sm}>
                <Input
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.name')}
                  placeholder={t('common.namePlaceholder')}
                  value={registration.name}
                  success={Boolean(registration.name && isValid.name)}
                  danger={Boolean(registration.name && !isValid.name)}
                  onChangeText={(value) => handleChange({ name: value })}
                />
                <Input
                  disabled={true}
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.email')}
                  keyboardType="email-address"
                  placeholder={t('common.emailPlaceholder')}
                  value={registration.email}
                  // success={Boolean(registration.email && isValid.email)}
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
                <Button
                  primary
                  outlined
                  onPress={handlePasswordChange}
                  shadow={!isAndroid}
                  marginVertical={sizes.s}
                  marginHorizontal={sizes.sm}
                  disabled={Object.values(isValid).includes(false)}>
                  <Text bold primary transform="uppercase">
                    {t('common.changePass')}
                  </Text>
                </Button>
                <Button
                  onPress={handleUpdateData}
                  marginVertical={sizes.s}
                  marginHorizontal={sizes.sm}
                  gradient={gradients.primary}
                  disabled={Object.values(isValid).includes(false)}>
                  <Text bold white transform="uppercase">
                    {t('common.changeData')}
                  </Text>
                </Button>
                <Button
                  onPress={emailLogout}
                  primary
                  outlined
                  shadow={!isAndroid}
                  marginVertical={sizes.s}
                  marginHorizontal={sizes.sm}
                  disabled={Object.values(isValid).includes(false)}>
                  <Text bold primary transform="uppercase">
                    {t('common.logOut')}
                  </Text>
                </Button>

              </Block>
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
          renderItem={({ item }) => (
            <Button
              marginBottom={sizes.sm}
              onPress={() =>
                modal === 'gender'
                  ? handleChange({ gender: GENDER_TYPES[item] })
                  : handleChange({ country: COUNTRIES[item] })
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
export default Profile;

