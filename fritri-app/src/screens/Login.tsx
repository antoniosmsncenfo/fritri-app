import React, { useCallback, useEffect, useState } from 'react';
import { Platform, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { ILogin, ILoginValidation } from '../constants/types/index';

import { useData, useTheme, useTranslation } from '../hooks/';
import * as regex from '../constants/regex';
import { Block, Button, Input, Image, Text } from '../components/';
import { useGoogleLogin } from '../hooks/useGoogleLogin';
import { useFacebook } from '../hooks/useFacebook';
import { useUsuario, useLogin } from '../hooks/useUsuario';
import { email } from '../constants/regex';
import { LoginStatus } from '../interfaces/usuario-fritri';
import { useFocusEffect } from '@react-navigation/native';



const isAndroid = Platform.OS === 'android';


const Login = () => {
  const { isDark, handleUser } = useData();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isValid, setIsValid] = useState<ILoginValidation>({
    email: false,
    password: false,
  });

  const loginDefault = {
    correoElectronico: '',
    contrasena: '',
  };

  const [login, setLoginData] = useState<ILogin>(loginDefault);

  const { assets, colors, gradients, sizes } = useTheme();

  const { signInWithGoogleAsync, fritriUserFromGoogle, isFritriUserFromGoogleLogged, googleLogout } = useGoogleLogin();
  const { facebookLogin, fritriUserFromFacebook, isFritriUserFacebookLogged, facebookLogout, fritriUserIdDb } = useFacebook();
  const { loginUsuarioEmail, emailLogout, fritriUserEmail, LoginMailStatus, resetLoginEstatus } = useLogin();

  const handleChange = useCallback(
    (value) => {
      setLoginData((state) => ({ ...state, ...value }));
    },
    [setLoginData],
  );

  useEffect(() => {
    if (LoginMailStatus === LoginStatus.InvalidMail) {
      Alert.alert(
        t('common.loginFailed'),
        t('common.loginFailedText'),
        [
          {
            text: 'OK', onPress: () => {
              navigation.navigate('Login');
            },
          },
        ],
        {
          cancelable: false,
        }
      );
      resetLoginEstatus();
    }
  }, [LoginMailStatus]);

  const handleSignIn = useCallback(() => {
    /**LOGIN EMAIL */
    if (isValid.email && isValid.password) {
      loginUsuarioEmail(login);
    }
    else if (!isValid.email && !isValid.password) {
      Alert.alert(
        t('login.errorLogin'),
        t('login.errorFields'),
        [{ text: 'OK' }],
        { cancelable: false }
      );
    }
    else if (!isValid.email) {
      Alert.alert(
        t('login.errorLogin'),
        t('login.errorEmail'),
        [{ text: 'OK' }],
        { cancelable: false }
      );
    }
    else if (!isValid.password) {
      Alert.alert(
        t('login.errorLogin'),
        t('login.errorPassword'),
        [{ text: 'OK' }],
        { cancelable: false }
      );
    }
  }, [isValid, loginUsuarioEmail]);

  const loginGoogleUser = () => {
    googleLogout();
    signInWithGoogleAsync();
  };

  const loginFacebookUser = () => {
    facebookLogout();
    facebookLogin();
  }

  useFocusEffect(
    React.useCallback(() => {
      emailLogout();
      googleLogout();
      facebookLogout();
      setIsValid({
        email: false,
        password: false,
      });
      setLoginData(loginDefault);
      return () => {
        limpiar();
      };
    }, [])
  );


  const limpiar = () => {
    setIsValid({
      email: false,
      password: false,
    });
    setLoginData(loginDefault);
  };

  const handleResetPassword = () => {
    limpiar();
    navigation.navigate('ResetPassword');
  };

  useEffect(() => {
    setIsValid({
      email: regex.email.test(login.correoElectronico),
      password: regex.password.test(login.contrasena),
    });
  }, [login, setIsValid]);

  useEffect(() => {
    if (isFritriUserFromGoogleLogged) {
      handleUser(fritriUserFromGoogle!);
      fritriUserFromGoogle?.pais == null ? navigation.navigate('Profile') : navigation.navigate('Home');
    }
  }, [isFritriUserFromGoogleLogged]);

  useEffect(() => {
    let fritriFinalUser = null;
    if (isFritriUserFacebookLogged) {
      if (fritriUserIdDb) {
        fritriFinalUser = {
          ...fritriUserIdDb,
          ...fritriUserFromFacebook,
        };
      }
      handleUser(fritriFinalUser!);
      fritriFinalUser?.pais == null ? navigation.navigate('Profile') : navigation.navigate('Home');
    }
  }, [isFritriUserFacebookLogged]);

  useEffect(() => {
    if (fritriUserEmail) {
      handleUser(fritriUserEmail!);
      if (fritriUserEmail.tipoLogin === 'Temporal') {
        limpiar();
        navigation.navigate('NewPassword');
      }
      else {
        limpiar();
        navigation.navigate('Home');
      }
    }
  }, [fritriUserEmail]);

  return (
    <Block safe marginTop={sizes.md}>
      <Block paddingHorizontal={sizes.s}>
        <Block flex={0}
          gradient={gradients.primary}
          style={{ zIndex: 0, height: sizes.height * 0.3 }}
          radius={sizes.sm}>
          <Text h4 center white marginTop={sizes.l}>
            {t('login.title')}
          </Text>
        </Block>
        {/* login form */}
        <Block
          keyboard
          marginTop={-(sizes.height * 0.2 - sizes.l)}
          behavior={!isAndroid ? 'padding' : 'height'}>
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
                {t('login.subtitle')}
              </Text>
              {/* social buttons */}
              <Block row center justify="space-evenly" marginVertical={sizes.m}>
                <Button outlined gray shadow={!isAndroid}
                  onPress={loginFacebookUser}
                >
                  <Image
                    source={assets.facebook}
                    height={sizes.m}
                    width={sizes.m}
                    color={undefined}
                  />
                </Button>
                <Button outlined gray shadow={!isAndroid}
                  onPress={loginGoogleUser}
                >
                  <Image
                    source={assets.google}
                    height={sizes.m}
                    width={sizes.m}
                    color={undefined}
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
              </Block>
              {/* form inputs */}
              <Block paddingHorizontal={sizes.sm}>
                <Input
                  label={t('common.email')}
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  keyboardType="email-address"
                  placeholder={t('common.emailPlaceholder')}
                  value={login.correoElectronico}
                  success={(login.correoElectronico !== '' && isValid.email)}
                  danger={Boolean(login.correoElectronico && !isValid.email)}
                  onChangeText={(value) => handleChange({ correoElectronico: value })}
                />
                <Input
                  secureTextEntry
                  label={t('common.password')}
                  autoCapitalize="none"
                  marginBottom={sizes.s}
                  placeholder={t('common.passwordPlaceholder')}
                  value={login.contrasena}
                  onChangeText={(value) => handleChange({ contrasena: value })}
                  success={Boolean(login.contrasena && isValid.password)}
                  danger={Boolean(login.contrasena && !isValid.password)}
                />
                <TouchableOpacity
                  onPress={handleResetPassword}>
                  <Block row flex={0} align="center">
                    <Text
                      color={colors.danger}
                      semibold
                      size={sizes.linkSize}
                      marginRight={sizes.s}>
                      {t('login.forgotPassword')}
                    </Text>
                    <Image source={assets.arrow} color={colors.danger} />
                  </Block>
                </TouchableOpacity>
              </Block>
              <Button
                onPress={handleSignIn}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                gradient={gradients.primary}>
                <Text bold white transform="uppercase">
                  {t('common.signin')}
                </Text>
              </Button>
              <Button
                primary
                outlined
                shadow={!isAndroid}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                onPress={() => navigation.navigate('Register')}>
                <Text bold primary transform="uppercase">
                  {t('common.signup')}
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default Login;
