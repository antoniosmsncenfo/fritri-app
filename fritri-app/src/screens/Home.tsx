import React, { useCallback, useEffect, useState } from 'react';
import { useData, useTheme, useTranslation } from '../hooks/';
import { Block, Button, Image, Product, Text, DashboardCard, Input } from '../components/';
import { useNavigation } from '@react-navigation/native';
import { usePaseo } from '../hooks/usePaseos';
import { EstadoPaseo, IPaseo } from '../interfaces/paseo';
import { CantidadPaseos } from '../interfaces/paseo';
import { CommonActions } from '@react-navigation/native';

const Home = () => {
  const { t } = useTranslation();
  const { assets, colors, fonts, gradients, sizes } = useTheme();
  const navigation = useNavigation();
  const [tab, setTab] = useState<number>(0);
  const { user } = useData();

  //Extraemos del hook el arreglo de paseos y el método para obtener paseos
  const { paseosUsuario, setPaseosUsuario, obtenerPaseosUsuario} = usePaseo();
  const [ paseosFiltrados, setPaseosFiltrados] = useState<IPaseo[] | undefined>([]);
  const [ searchTerm, setSearchTerm] = useState('');
  
  const checkGUser = async () => {
    if(!user) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: 'Login'},
          ],
        })
      );
    }
  }

  useEffect(() => {
    checkGUser();
    obtenerPaseosUsuario(user?._id!,EstadoPaseo.Pendiente,CantidadPaseos.Diez);
  }, [])

  useEffect(() => {
    setPaseosFiltrados(paseosUsuario?.filter(p => 
      p.nombre.toLowerCase().includes(searchTerm.toString().toLowerCase())));
  
  }, [paseosUsuario, searchTerm])
  
  //Maneja el cambio de tab y cambia la lista de productos
  const handleNew = useCallback(() => {  
    navigation.navigate('NewTrip');
  }, []);

  //Maneja el cambio de tab y cambia la lista de productos
  const handlePaseos = useCallback(  
    (tab: number) => {
      console.log("Consulta a BD");
      setTab(tab);
      if (tab===2) {
        navigation.navigate('NewTrip');
      }
      else{        
        tab === 0 
        ? obtenerPaseosUsuario(user._id!,EstadoPaseo.Pendiente,CantidadPaseos.Diez) 
        : obtenerPaseosUsuario(user._id!,EstadoPaseo.Completado,CantidadPaseos.Diez)
      }
    },
    [],
  );
  
  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  return (
    <Block>
      
      {/* search input */}
      <Block color={colors.card} flex={0} padding={sizes.padding}>
        <Input search color={colors.primary}
        placeholder={t('common.search')} 
        onChangeText={(value) => handleSearch(value)}
        value={searchTerm}
        />
      </Block>

      {/* toggle products list */}
      <Block
        row
        flex={0}
        align="center"
        justify="center"
        color={colors.card}
        paddingBottom={sizes.sm}>
        {/* Button pending */}
        <Button onPress={() => handlePaseos(0)}>
          <Block row align="center">
            <Block
              flex={0}
              radius={6}
              align="center"
              justify="center"
              marginRight={sizes.s}
              width={sizes.socialIconSize}
              height={sizes.socialIconSize}
              gradient={gradients?.[tab === 0 ? 'primary' : 'secondary']}>
              <Image source={assets.flight} color={colors.white} radius={0} />
            </Block>
            <Text p font={fonts?.[tab === 0 ? 'medium' : 'normal']}>
              {t('home.pending')}
            </Text>
          </Block>
        </Button>
        <Block
          gray
          flex={0}
          width={1}
          marginHorizontal={sizes.sm}
          height={sizes.socialIconSize}
        />
        {/* Button completed */}
        <Button onPress={() => handlePaseos(1)}>
          <Block row align="center">
            <Block
              flex={0}
              radius={6}
              align="center"
              justify="center"
              marginRight={sizes.s}
              width={sizes.socialIconSize}
              height={sizes.socialIconSize}
              gradient={gradients?.[tab === 1 ? 'primary' : 'secondary']}>
              <Image
                radius={0}
                color={colors.white}
                source={assets.document}
              />
            </Block>
            <Text p font={fonts?.[tab === 1 ? 'medium' : 'normal']}>
              {t('home.completed')}
            </Text>
          </Block>
        </Button>
        <Block
          gray
          flex={0}
          width={1}
          marginHorizontal={sizes.sm}
          height={sizes.socialIconSize}
        />
        {/* Botón de nuevo paseo */}
        <Button onPress={() => handleNew()}>
          <Block row align="center">
            <Block
              flex={0}
              radius={6}
              align="center"
              justify="center"
              marginRight={sizes.s}
              width={sizes.socialIconSize}
              height={sizes.socialIconSize}
              //gradient={gradients?.[tab === 2 ? 'primary' : 'secondary']}
              gradient={gradients.success}
              >
              <Image
                radius={0}
                color={colors.white}
                source={assets.calendar}
              />
            </Block>
            <Text p 
            //font={fonts?.[tab === 2 ? 'medium' : 'normal']}
            font={fonts.medium}
              >
              {t('home.new')}
            </Text>
          </Block>
        </Button>        
      </Block>
      
      {paseosUsuario?.length===0 &&
        <Block paddingTop={sizes.padding} paddingHorizontal={sizes.padding} flex={0}>
          <Text align='center' color={colors.primary} h4>{t('home.noTrips')}</Text>          
        </Block>
      }

      {/* lista de paseos*/}
      <Block
        scroll
        paddingHorizontal={sizes.padding}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: sizes.l }}>
        <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
          {paseosFiltrados?.map((paseo) => (
            <DashboardCard {...paseo} key={`card-${paseo?._id}`} />
          ))}
        </Block>
      </Block>    
    </Block>
  );
};

export default Home;
