import React, {useCallback, useEffect, useState} from 'react';
import {Platform, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import {useData, useTheme, useTranslation} from '../hooks/';
import * as regex from '../constants/regex';
import {Block, Button, Input, Image, Text, Modal} from '../components/';
import { FotoUsuario, ITheme } from '../constants/types';
import { FlatList } from 'react-native-gesture-handler';
import { useUsuario } from '../hooks/useUsuario';
import { IRegistration, RegistrationStatus } from '../interfaces/registro-usuario';

const isAndroid = Platform.OS === 'android';

interface IResetPasswordValidation {
    email: boolean;
}

const ResetPassword = () => {

    const {t} = useTranslation();
    const navigation = useNavigation();

    const [isValid, setIsValid] = useState<IResetPasswordValidation>({
        email: false,
      });

    interface IResetPassword {
        email: string;
        status: RegistrationStatus;
    }

    const [resetPassword, setResetPassword] = useState<IResetPassword>({
        email: '',
        status: RegistrationStatus.New
    });

    const {assets, colors, gradients, sizes} = useTheme();

    const {
        resetRegistrarEstatus, 
        registrarUsuario, 
        registrarStatus
    } = useUsuario();

    const handleChange = useCallback(
        (value) => {
            setResetPassword((state) => ({...state, ...value}));
        },
        [setResetPassword],
      );
    
    const handleReset = useCallback(() => {
    if (!Object.values(isValid).includes(false)) {
        //enviar informacion de reset
    }
    }, [isValid, resetPassword]);

    useEffect(() => {
        setIsValid((state) => ({
            ...state,
            email: regex.email.test(resetPassword.email),
        }));
    }, [resetPassword, setIsValid]);

    useEffect(() => {
        if(registrarStatus===RegistrationStatus.Success)
        {
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
        else if (registrarStatus===RegistrationStatus.Error){
          Alert.alert(
            t('register.validation'),
            t('register.emailExists'),
            [
              {text: 'OK'}
            ],
            { 
              cancelable: false 
            }
          );
          resetRegistrarEstatus();
        }
    }, [registrarStatus])

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
                  {t('resetPassword.title')}
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
                    {t('resetPassword.subtitle')}
                  </Text>
                  {/* form inputs */}
                  <Block paddingHorizontal={sizes.sm}>
                    <Input
                      autoCapitalize="none"
                      marginBottom={sizes.m}
                      label={t('common.email')}
                      keyboardType="email-address"
                      placeholder={t('common.emailPlaceholder')}
                      success={Boolean(resetPassword.email && isValid.email)}
                      danger={Boolean(resetPassword.email && !isValid.email)}
                      onChangeText={(value) => handleChange({email: value})}
                    />
                  </Block>
                  <Button
                    onPress={handleReset}
                    marginVertical={sizes.s}
                    marginHorizontal={sizes.sm}
                    gradient={gradients.primary}
                    disabled={Object.values(isValid).includes(false)}>
                    <Text bold white transform="uppercase">
                      {t('common.signup')}
                    </Text>
                  </Button>
                </Block>
              </Block>
            </Block>
          </Block>     
        </Block>
    );
}

export default ResetPassword;
