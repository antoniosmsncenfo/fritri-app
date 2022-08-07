import React, { useCallback, useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { useData, useTheme, useTranslation } from '../hooks/';
import * as regex from '../constants/regex';
import { Block, Button, Input, Image, Text } from '../components/';
import { useChangePassword, useLogin } from '../hooks/useUsuario';
import { ResetPasswordStatus } from '../interfaces/registro-usuario';
import { LoginStatus } from '../interfaces/usuario-fritri';

const isAndroid = Platform.OS === 'android';

interface INewPasswordValidation {
  currentValidation: boolean;
  passwordValidation: boolean;
  passwordConfirmationValidation: boolean;
}

interface INewPassword {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
  status: ResetPasswordStatus;
}

const NewPassword = () => {

  const { user } = useData();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const {loginUsuarioEmail, LoginMailStatus, resetLoginEstatus} = useLogin();

  const [isValid, setIsValid] = useState<INewPasswordValidation>({
    currentValidation: false,
    passwordValidation: false,
    passwordConfirmationValidation: false,
  });

  const [passwordState, setPasswordState] = useState<INewPassword>({
    currentPassword: '',
    newPassword: '',
    newPasswordConfirmation: '',
    status: ResetPasswordStatus.Pending,
  });

  const { assets, colors, gradients, sizes } = useTheme();

  //Constantes que extraemos del hook de cambio de contraseña
  const {
    restartChangePasswordStatus,
    changePassword,
    changePasswordResult,
  } = useChangePassword();

  //Callback para manejar el cambio del valor de los input de contraseñas
  const handleChange = useCallback(
    (value) => {
      setPasswordState((state) => ({
        ...state,
        ...value,
      }));
    },
    [setPasswordState],
  );

  //Callback para manejar la solicitud del usuario de cambiar de contraseña
  //Si es un tipo de login = email, se está mostrando el campo de la contraseña actual
  //por lo que se debe validar si el correo y contraseña actual retornan un login válido.
  const handleNewPassword = useCallback(() => {
    if (!Object.values(isValid).includes(false)) {
      if(user.tipoLogin==='Email'){
        //Llamar el método que valida si se logra login con el correo y la contraseña ingresados
        loginUsuarioEmail({
          correoElectronico: user.correoElectronico,
          contrasena: passwordState.currentPassword
        })
      }
      else{
      //Llamado a la función de cambiar el password
      changePassword({
        _id: user._id!,
        contrasena: passwordState.newPassword,
      });
    }
    }
    else {
      Alert.alert(
        t('newPassword.errorNewPassword'),
        t('newPassword.errorPassword'),
        [{ text: 'OK' }],
        { cancelable: false }
      );
    }
  }, [isValid, changePassword]);

  //Effect para definir la validez de los valores ingresados por el usuario
  //Si es tipoLogin=Email entonces se valida el campo de current password,
  //si no entonces se define current como valido, porque el campo está oculto
  useEffect(() => {
    if(user.tipoLogin==='Email'){
      setIsValid((state) => ({
        ...state,
        currentValidation: regex.password.test(passwordState.currentPassword),
        passwordValidation: regex.password.test(passwordState.newPassword),
        passwordConfirmationValidation: passwordState.newPassword === passwordState.newPasswordConfirmation,
      }));
    }
    else{
      setIsValid((state) => ({
        ...state,
        currentValidation: true,
        passwordValidation: regex.password.test(passwordState.newPassword),
        passwordConfirmationValidation: passwordState.newPassword === passwordState.newPasswordConfirmation,
      }));
    }
  }, [passwordState, setIsValid]);

  //Effect que se dispara cuando se produjo una validación de login
  useEffect(() => {
    if (LoginMailStatus === LoginStatus.InvalidMail) {
      Alert.alert(
        t('newPassword.errorNewPassword'),
        t('newPassword.errorCurrentMessage'),
        [{text: 'OK'}],
        {cancelable: false}
      );
      resetLoginEstatus();
    }
    else if (LoginMailStatus === LoginStatus.Valid) {
      //Llamado a la función de cambiar el password
      changePassword({
        _id: user._id!,
        contrasena: passwordState.newPassword,
      });
    }
  }, [LoginMailStatus]);
  

  //Effect que se dispara cuando se produjo un cambio de contraseña
  //Dependiendo del valor del estado se despliega un mensaje diferente
  useEffect(() => {
    if (changePasswordResult === ResetPasswordStatus.Success) {
      Alert.alert(
        t('newPassword.passwordSent'),
        t('newPassword.checkEmail'),
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
    }
    else if (changePasswordResult === ResetPasswordStatus.Error) {
      Alert.alert(
        t('newPassword.passwordError'),
        t('newPassword.errorMessage'),
        [
          { text: 'OK' },
        ],
        {
          cancelable: false,
        }
      );
      restartChangePasswordStatus();
    }
  }, [changePasswordResult]);

  return (
    <Block safe>
      <Block paddingHorizontal={sizes.s}>
        <Block flex={0}
          gradient={gradients.primary}
          style={{ zIndex: 0, height: sizes.height * 0.3 }}
          radius={sizes.sm}>
          <Text h4 center white marginTop={sizes.m}>
            {t('newPassword.title')}
          </Text>
        </Block>
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
              <Block
                paddingHorizontal={sizes.sm}
                paddingTop={sizes.sm}>
                {user.tipoLogin==='Email' &&
                <Input
                  secureTextEntry
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.currentPassword')}
                  rules={t('register.passwordRules')}
                  placeholder={t('common.currentPasswordPlaceholder')}
                  onChangeText={(value) => handleChange({ currentPassword: value })}
                  success={Boolean(passwordState.currentPassword && isValid.currentValidation)}
                  danger={Boolean(passwordState.currentPassword && !isValid.currentValidation)}
                />
                }                  
                <Input
                  secureTextEntry
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.newPassword')}
                  rules={t('register.passwordRules')}
                  placeholder={t('common.passwordPlaceholder')}
                  onChangeText={(value) => handleChange({ newPassword: value })}
                  success={Boolean(passwordState.newPassword && isValid.passwordValidation)}
                  danger={Boolean(passwordState.newPassword && !isValid.passwordValidation)}
                />
                <Input
                  secureTextEntry
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.confirmPassword')}
                  rules={t('register.passwordRules')}
                  placeholder={t('common.confirmPasswordPlaceholder')}
                  onChangeText={(value) => handleChange({ newPasswordConfirmation: value })}
                  success={Boolean(passwordState.newPasswordConfirmation && isValid.passwordConfirmationValidation)}
                  danger={Boolean(passwordState.newPasswordConfirmation && !isValid.passwordConfirmationValidation)}
                />
                <Button
                  onPress={handleNewPassword}
                  marginVertical={sizes.s}
                  gradient={gradients.primary}>
                  <Text bold white transform="uppercase">
                    {t('newPassword.sendTempPass')}
                  </Text>
                </Button>
              </Block>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default NewPassword;
