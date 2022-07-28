import React, { useCallback, useEffect, useState } from 'react';

import { useData, useTheme, useTranslation } from '../hooks/';
import { Block, Button, Image, Product, Text, DashboardCard } from '../components/';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { usePaseo } from '../hooks/usePaseos';
import { EstadoPaseo } from '../interfaces/paseo';
import { CantidadPaseos } from '../interfaces/paseo';

const Home = () => {
  const { t } = useTranslation();
  const { assets, colors, fonts, gradients, sizes } = useTheme();
  const navigation = useNavigation();
  const [tab, setTab] = useState<number>(0);
  const { user } = useData();

  ////Manejo de los productos de la plantilla
  //Extraen los arreglos de tipos de productos del contexto
  const { following, trending } = useData();
  //Definen un estado para la lista de productos y por defecto
  //le cargan la lista de following del contexto
  const [products, setProducts] = useState(following);
  //Maneja el cambio de tab y cambia la lista de productos
  const handleProducts = useCallback(
    (tab: number) => {
      setTab(tab);
      setProducts(tab === 0 ? following : trending);
      if (tab===2) {
        navigation.navigate('NewTrip');
      }
    },
    [following, trending, setTab, setProducts],
  );
  ////Manejo de los productos de la plantilla


  //Extraemos el arreglo de paseos del contexto
  const { paseosUsuario, setPaseosUsuario, obtenerPaseosUsuario} = usePaseo();
  
  useEffect(() => {
    obtenerPaseosUsuario(user._id!,EstadoPaseo.Pendiente,CantidadPaseos.Diez);
  }, [])

  //Maneja el cambio de tab y cambia la lista de productos
  const handlePaseos = useCallback(
    (tab: number) => {
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
    [following, trending, setTab, setProducts],
  );
  
  

  return (
    <Block>
      {/* search input */}
      {/* <Block color={colors.card} flex={0} padding={sizes.padding}>
        <Input search placeholder={t('common.search')} />
      </Block> */}

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
        <Button onPress={() => handlePaseos(2)}>
          <Block row align="center">
            <Block
              flex={0}
              radius={6}
              align="center"
              justify="center"
              marginRight={sizes.s}
              width={sizes.socialIconSize}
              height={sizes.socialIconSize}
              gradient={gradients?.[tab === 2 ? 'primary' : 'secondary']}>
              <Image
                radius={0}
                color={colors.white}
                source={assets.calendar}
              />
            </Block>
            <Text p font={fonts?.[tab === 2 ? 'medium' : 'normal']}>
              {t('home.new')}
            </Text>
          </Block>
        </Button>        
      </Block>
      {/* <Block paddingTop={sizes.padding} paddingHorizontal={sizes.padding} flex={0}>
        <Button gradient={gradients.primary} onPress={() => navigation.navigate('NewTrip')}>
          <Text white semibold transform="uppercase">
            {t('home.new')}
          </Text>
        </Button>
      </Block> */}
      {paseosUsuario?.length===0 &&
        <Block paddingTop={sizes.padding} paddingHorizontal={sizes.padding} flex={0}>
          <Text align='center' color={colors.primary} h4>{t('home.noTrips')}</Text>          
        </Block>
      }

      {/* products list
      <Block
        scroll
        paddingHorizontal={sizes.padding}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: sizes.l }}>
        <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
          {products?.map((product) => (
            <Product {...product} key={`card-${product?.id}`} />
          ))}
        </Block>
      </Block> */}

      {/* lista de paseos*/}
      <Block
        scroll
        paddingHorizontal={sizes.padding}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: sizes.l }}>
        <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
          {console.log("Home->Paseos Cargados:" + paseosUsuario?.length)}
          {paseosUsuario?.map((paseo) => (
            <DashboardCard {...paseo} key={`card-${paseo?._id}`} />
          ))}
        </Block>
      </Block>    
    </Block>
  );
};

export default Home;
