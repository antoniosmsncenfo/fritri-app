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

const COUNTRIES: {
  [key: string]: string;
} = {
  '1': 'Costa Rica', '2': 'Nicaragua',
  '3': 'Panamá', '4': 'Guatemala',
  '5': 'El Salvador'
};

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

  const [isValid, setIsValid] = useState<IRegistrationValidation>({
    name: false,
    email: false,
    password: true,
    confirmPassword: true,
    agreed: true,
  });

  const GENDER_TYPES: { [key: string]: string; } =
  {
    '1': t('common.genders.woman'),
    '2': t('common.genders.man'),
    '3': t('common.genders.other')
  };

  const [registration, setRegistration] = useState<IRegistration>({
    name: user.nombreCompleto,
    email: user.correoElectronico,
    gender: user.genero!,
    country: user.pais!,
    password: '',
    confirmPassword: '',
    agreed: true,
    status: RegistrationStatus.New
  });

  const [gender, setGender] = useState(GENDER_TYPES['1']);

  const [country, setCountry] = useState(COUNTRIES['1']);

  const { resetRegistrarEstatus, updateUsuario, registrarStatus } = useUsuario();

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
      updateUsuario({
        id: user._id,
        tipoLogin: 'Email',
        correoElectronico: registration.email,
        nombreCompleto: registration.name,
        genero: registration.gender,
        pais: registration.country
      })
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
    }));
  }, [registration, setIsValid]);

  useEffect(() => {
    if (registrarStatus === RegistrationStatus.Success) {
      Alert.alert(
        t('register.updateUser'),
        t('register.titleUpdated'),
        [
          {
            text: 'OK', onPress: () => {
              console.log('OK button clicked');
              navigation.navigate('Profile');
            },
          }
        ],
        {
          cancelable: false
        }
      );
    }
    else if (registrarStatus === RegistrationStatus.Duplicated) {
      Alert.alert(
        t('register.validation'),
        t('register.emailExists'),
        [
          { text: 'OK' }
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
        <Block flex={0} style={{ zIndex: 0 }}>
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
                {t('register.subtitleUpdate')}
              </Text>

              {/* form inputs */}
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
                  //onPress={}
                  primary
                  outlined
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
                {/* <TouchableInput
                  icon="more"
                  value={"Me.jpg"}
                  label={t('common.avatar')}
                  onPress={() => setModal(undefined)}
                />                                                  */}
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
                {/* <Input
                  secureTextEntry
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.password')}
                  rules={t('register.emailRules')}
                  placeholder={t('common.passwordPlaceholder')}
                  // value ={user?.contrasena}

                  onChangeText={(value) => handleChange({password: value})}
                  success={Boolean(registration.password && isValid.password)}
                  danger={Boolean(registration.password && !isValid.password)}
                />
                <Input
                  secureTextEntry
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.confirmPassword')}
                  rules={t('register.emailRules')}
                  placeholder={t('common.confirmPasswordPlaceholder')}
                  onChangeText={(value) => handleChange({confirmPassword: value})}
                  success={Boolean(registration.confirmPassword && isValid.confirmPassword)}
                  danger={Boolean(registration.confirmPassword && !isValid.confirmPassword)}
                />                 */}
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
          renderItem={({ item }) => (
            <Button
              marginBottom={sizes.sm}
              onPress={() =>
                modal === 'gender'
                  //? handleGender(GENDER_TYPES[item])
                  //: handleCountry(COUNTRIES[item])
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


  // const { user } = useData();
  // const { t } = useTranslation();
  // const navigation = useNavigation();
  // const { assets, colors, sizes } = useTheme();

  // const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 3;
  // const IMAGE_VERTICAL_SIZE =
  //   (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
  // const IMAGE_MARGIN = (sizes.width - IMAGE_SIZE * 3 - sizes.padding * 2) / 2;
  // const IMAGE_VERTICAL_MARGIN =
  //   (sizes.width - (IMAGE_VERTICAL_SIZE + sizes.sm) * 2) / 2;

  // const handleSocialLink = useCallback(
  //   (type: 'twitter' | 'dribbble') => {
  //     const url =
  //       type === 'twitter'
  //         ? `https://twitter.com/${user?.social?.twitter}`
  //         : `https://dribbble.com/${user?.social?.dribbble}`;

  //     try {
  //       Linking.openURL(url);
  //     } catch (error) {
  //       alert(`Cannot open URL: ${url}`);
  //     }
  //   },
  //   [user],
  // );

//   return (
//     <Block safe marginTop={sizes.md}>
//       <Block
//         scroll
//         paddingHorizontal={sizes.s}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: sizes.padding }}>
//         <Block flex={0}>
//           <Image
//             background
//             resizeMode="cover"
//             padding={sizes.sm}
//             paddingBottom={sizes.l}
//             radius={sizes.cardRadius}
//             source={assets.background}>
//             <Button
//               row
//               flex={0}
//               justify="flex-start"
//               onPress={() => navigation.goBack()}>
//               <Image
//                 radius={0}
//                 width={10}
//                 height={18}
//                 color={colors.white}
//                 source={assets.arrow}
//                 transform={[{ rotate: '180deg' }]}
//               />
//               <Text p white marginLeft={sizes.s}>
//                 {t('profile.title')}
//               </Text>
//             </Button>
//             <Block flex={0} align="center">
//               <Image
//                 width={64}
//                 height={64}
//                 marginBottom={sizes.sm}
//                 source={{ uri: user?.urlFoto }}
//               />
//               <Text h5 center white>
//                 {user?.nombreCompleto}
//               </Text>
//               <Text p center white>
//                 {user?.correoElectronico}
//               </Text>
//               {/* <Block row marginVertical={sizes.m}>
//                 <Button
//                   white
//                   outlined
//                   shadow={false}
//                   radius={sizes.m}
//                   onPress={() => {
//                     alert(`Follow ${user?.name}`);
//                   }}>
//                   <Block
//                     justify="center"
//                     radius={sizes.m}
//                     paddingHorizontal={sizes.m}
//                     color="rgba(255,255,255,0.2)">
//                     <Text white bold transform="uppercase">
//                       {t('common.follow')}
//                     </Text>
//                   </Block>
//                 </Button>
//                 <Button
//                   shadow={false}
//                   radius={sizes.m}
//                   marginHorizontal={sizes.sm}
//                   color="rgba(255,255,255,0.2)"
//                   outlined={String(colors.white)}
//                   onPress={() => handleSocialLink('twitter')}>
//                   <Ionicons
//                     size={18}
//                     name="logo-twitter"
//                     color={colors.white}
//                   />
//                 </Button>
//                  <Button
//                   shadow={false}
//                   radius={sizes.m}
//                   color="rgba(255,255,255,0.2)"
//                   outlined={String(colors.white)}
//                   onPress={() => handleSocialLink('dribbble')}>
//                   <Ionicons
//                     size={18}
//                     name="logo-dribbble"
//                     color={colors.white}
//                   />
//                 </Button>
//               </Block> */}
//             </Block>
//           </Image>

//           {/* profile: stats */}
//           {/* <Block
//             flex={0}
//             radius={sizes.sm}
//             shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
//             marginTop={-sizes.l}
//             marginHorizontal="8%"
//             color="rgba(255,255,255,0.2)">
//             <Block
//               row
//               blur
//               flex={0}
//               intensity={100}
//               radius={sizes.sm}
//               overflow="hidden"
//               tint={colors.blurTint}
//               justify="space-evenly"
//               paddingVertical={sizes.sm}
//               renderToHardwareTextureAndroid>
//               <Block align="center">
//                 <Text h5>{user?.stats?.posts}</Text>
//                 <Text>{t('profile.posts')}</Text>
//               </Block>
//               <Block align="center">
//                 <Text h5>{(user?.stats?.followers || 0) / 1000}k</Text>
//                 <Text>{t('profile.followers')}</Text>
//               </Block>
//               <Block align="center">
//                 <Text h5>{(user?.stats?.following || 0) / 1000}k</Text>
//                 <Text>{t('profile.following')}</Text>
//               </Block>
//             </Block>
//           </Block>


//           <Block paddingHorizontal={sizes.sm}>
//             <Text h5 semibold marginBottom={sizes.s} marginTop={sizes.sm}>
//               {t('profile.aboutMe')}
//             </Text>
//             <Text p lineHeight={26}>
//               {user?.about}
//             </Text>
//           </Block>


//           <Block paddingHorizontal={sizes.sm} marginTop={sizes.s}>
//             <Block row align="center" justify="space-between">
//               <Text h5 semibold>
//                 {t('common.album')}
//               </Text>
//               <Button>
//                 <Text p primary semibold>
//                   {t('common.viewall')}
//                 </Text>
//               </Button>
//             </Block>
//             <Block row justify="space-between" wrap="wrap">
//               <Image
//                 resizeMode="cover"
//                 source={assets?.photo1}
//                 style={{
//                   width: IMAGE_VERTICAL_SIZE + IMAGE_MARGIN / 2,
//                   height: IMAGE_VERTICAL_SIZE * 2 + IMAGE_VERTICAL_MARGIN,
//                 }}
//               />
//               <Block marginLeft={sizes.m}>
//                 <Image
//                   resizeMode="cover"
//                   source={assets?.photo2}
//                   marginBottom={IMAGE_VERTICAL_MARGIN}
//                   style={{
//                     height: IMAGE_VERTICAL_SIZE,
//                     width: IMAGE_VERTICAL_SIZE,
//                   }}
//                 />
//                 <Image
//                   resizeMode="cover"
//                   source={assets?.photo3}
//                   style={{
//                     height: IMAGE_VERTICAL_SIZE,
//                     width: IMAGE_VERTICAL_SIZE,
//                   }}
//                 />
//               </Block>
//             </Block>
//           </Block> */}
//         </Block>
//       </Block>
//     </Block>
//   );
// };


