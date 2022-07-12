import React, {useCallback, useEffect, useState} from 'react';
import {Platform, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useTheme, useTranslation} from '../hooks/';
import * as regex from '../constants/regex';
import {Block, Button, Input, Image, Text} from '../components/';
import { usePassword } from '../hooks/useUsuario';
import { ResetPasswordStatus } from '../interfaces/registro-usuario';
import { password } from '../constants/regex';

const isAndroid = Platform.OS === 'android';

interface INewPasswordValidation {
    passwordValidation: boolean;
    passwordConfirmationValidation: boolean;
}

interface INewPassword {
    newPassword: string;
    newPasswordConfirmation: string;
    status: ResetPasswordStatus;
}

const NewPassword = () => {

    const {t} = useTranslation();
    const navigation = useNavigation();

    const [isValid, setIsValid] = useState<INewPasswordValidation>({
      passwordValidation: false,
      passwordConfirmationValidation: false,
    });

    const [passwordState, setPasswordState] = useState<INewPassword>({
      newPassword: '',
      newPasswordConfirmation: '',
      status: ResetPasswordStatus.Pending
    });

    const {assets, colors, gradients, sizes} = useTheme();

    //Cambiar a usePassword
    const {
        restartResetPasswordStatus, //funcion para resetear
        resetPassword, //funcion
        resetPasswordResult, //resultado
        usuarioFriTri //usuario obtenido
    } = usePassword();

    const handleChange = useCallback(
        (value) => {
          setPasswordState((state) => ({
            ...state, 
            ...value
          }));
        },
        [setPasswordState],
      );

    const handleNewPassword = useCallback(() => {
        if (!Object.values(isValid).includes(false)) {
            //Llamado a la función de resetear
            //resetPassword(resetUserPassword.email);
        }
    }, [isValid, resetPassword]);

    useEffect(() => {
        setIsValid((state) => ({
            ...state,
            passwordValidation: regex.password.test(passwordState.newPassword),
            passwordConfirmationValidation: passwordState.newPassword===passwordState.newPasswordConfirmation,
        }));
    }, [passwordState, setIsValid]);

    useEffect(() => {
        if(resetPasswordResult===ResetPasswordStatus.Success)
        {
          Alert.alert(
            t('newPassword.passwordSent'),
            t('newPassword.checkEmail'),
            [
              {text: 'OK', onPress: () => {
                navigation.navigate('Login');},
              }
            ],
            { 
              cancelable: false 
            }
          );
        }
        else if (resetPasswordResult===ResetPasswordStatus.Error){
          Alert.alert(
            t('newPassword.passwordError'),
            t('newPassword.errorMessage'),
            [
              {text: 'OK'}
            ],
            { 
              cancelable: false 
            }
          );
          restartResetPasswordStatus();
        }
    }, [resetPasswordResult])

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
                <Text h4 center white marginTop={20}>
                  {t('newPassword.title')}
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
                    {t('newPassword.subtitle')}
                  </Text>
                  <Block 
                    paddingHorizontal={sizes.sm}
                    paddingTop={sizes.sm}>
                    <Input
                    secureTextEntry
                    autoCapitalize="none"
                    marginBottom={sizes.m}
                    label={t('common.password')}
                    rules={t('register.passwordRules')}
                    placeholder={t('common.passwordPlaceholder')}
                    onChangeText={(value) => handleChange({newPassword: value})}
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
                      onChangeText={(value) => handleChange({newPasswordConfirmation: value})}
                      success={Boolean(passwordState.newPasswordConfirmation && isValid.passwordConfirmationValidation)}
                      danger={Boolean(passwordState.newPasswordConfirmation && !isValid.passwordConfirmationValidation)}
                    /> 
                    <Button
                      onPress={handleNewPassword}
                      marginVertical={sizes.s}
                      marginHorizontal={sizes.sm}
                      gradient={gradients.primary}
                      disabled={Object.values(isValid).includes(false)}>
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
}

export default NewPassword;
