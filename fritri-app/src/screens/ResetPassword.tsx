import React, { useCallback, useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { useTheme, useTranslation } from '../hooks/';
import * as regex from '../constants/regex';
import { Block, Button, Input, Image, Text } from '../components/';
import { usePassword } from '../hooks/useUsuario';
import { ResetPasswordStatus } from '../interfaces/registro-usuario';

const isAndroid = Platform.OS === 'android';

interface IResetPasswordValidation {
  email: boolean;
}

interface IResetPassword {
  email: string;
  status: ResetPasswordStatus;
}

const ResetPassword = () => {

  const { t } = useTranslation();
  const navigation = useNavigation();

  const [isValid, setIsValid] = useState<IResetPasswordValidation>({
    email: false,
  });

  const [resetUserPassword, setResetUserPassword] = useState<IResetPassword>({
    email: '',
    status: ResetPasswordStatus.Pending,
  });

  const { assets, colors, gradients, sizes } = useTheme();

  //Cambiar a usePassword
  const {
    restartResetPasswordStatus, //funcion para resetear
    resetPassword, //funcion
    resetPasswordResult, //resultado
    usuarioFriTri, //usuario obtenido
  } = usePassword();

  const handleChange = useCallback(
    (value) => {
      setResetUserPassword((state) => ({ ...state, ...value }));
    },
    [setResetUserPassword],
  );

  const handleReset = useCallback(() => {
    if (!Object.values(isValid).includes(false)) {
      //Llamado a la función de resetear
      resetPassword(resetUserPassword.email);
    }
    else {
      Alert.alert(
        t('resetPassword.missingDataTitle'),
        t('resetPassword.missingDataMessage'),
        [
          { text: 'OK' },
        ],
        {
          cancelable: false,
        }
      );
    }
  }, [isValid, resetPassword]);

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      email: regex.email.test(resetUserPassword.email),
    }));
  }, [resetUserPassword, setIsValid]);

  useEffect(() => {
    if (resetPasswordResult === ResetPasswordStatus.Success) {
      Alert.alert(
        t('resetPassword.passwordSent'),
        t('resetPassword.checkEmail'),
        [
          {
            text: 'OK', onPress: () => {
              navigation.navigate('Login', { email: resetUserPassword.email });
            },
          },
        ],
        {
          cancelable: false,
        }
      );
    }
    else if (resetPasswordResult === ResetPasswordStatus.Error) {
      Alert.alert(
        t('resetPassword.passwordError'),
        t('resetPassword.errorMessage'),
        [
          { text: 'OK' },
        ],
        {
          cancelable: false,
        }
      );
      restartResetPasswordStatus();
    }
  }, [resetPasswordResult]);

  return (
    <Block safe>
      <Block paddingHorizontal={sizes.s}>
        <Block flex={0}
          gradient={gradients.primary}
          style={{ zIndex: 0, height: sizes.height * 0.3 }}
          radius={sizes.sm}>
          <Text h4 center white marginTop={sizes.l}>
            {t('resetPassword.title')}
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
              {/* <Text p semibold center>
                    {t('resetPassword.subtitle')}
                  </Text> */}
              {/* form inputs */}
              <Block paddingHorizontal={sizes.sm}>
                <Input
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.email')}
                  keyboardType="email-address"
                  placeholder={t('common.emailPlaceholder')}
                  success={Boolean(resetUserPassword.email && isValid.email)}
                  danger={Boolean(resetUserPassword.email && !isValid.email)}
                  onChangeText={(value) => handleChange({ email: value })}
                />
              </Block>
              <Button
                onPress={handleReset}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                gradient={gradients.primary}
              >
                <Text bold white transform="uppercase">
                  {t('resetPassword.sendTempPass')}
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default ResetPassword;
