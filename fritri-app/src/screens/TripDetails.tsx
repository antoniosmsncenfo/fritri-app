import { useData, useTheme, useTranslation } from '../hooks';
import { Block, Button, Input, Image, Text } from '../components/';
import React, { useEffect, useState } from 'react';
import { usePaseo } from '../hooks/usePaseos';
import dayjs from 'dayjs';
import { Alert, Share, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUsuario } from '../hooks/useUsuario';
import { useVotacion } from '../hooks/useVotacion';
import { PlaceDetail } from '../components/PlaceDetail';
import { ILugar, TipoSeccion } from '../interfaces/paseo';
import { ITipoVoto, ITipoVotoEnviar } from '../interfaces/tipo-voto';
import * as Linking from 'expo-linking';

const TripDetails = (props) => {
  const { assets, sizes, colors, gradients } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { obtenerPaseo, paseoSeleccionado, paseoSeleccionadoCargado, 
    protegerPaseo, removerPin, seAsignoPin, setSeAsignoPin,
    cerrarSeccion, seCerroSeccion, setSeCerroSeccion } = usePaseo();
  const { usuarioPaseo, obtenerUsuarioPaseo } = useUsuario();
  const { 
    votarSeccion, enviandoVotacionRest, enviandoVotacionAtr, 
    respRest, respAtr, setEnviandoVotacionRest, setEnviandoVotacionAtr } = useVotacion();
  const { user } = useData();

  const [restaurantesVotar, setRestaurantesVotar] = useState<ITipoVoto[]>([]);
  const [atraccionesVotar, setAtraccionesVotar] = useState<ITipoVoto[]>([]);
  const [isFromDashboard, setIsFromDashboard] = useState(false);

  const [paseoCompletado, setPaseoCompletado] = useState(false);

  useEffect(() => {
    let idPaseo: string = props.route.params.id;
    obtenerPaseo(idPaseo);
    checkRouteFrom();
  }, []);

  const checkRouteFrom = () => {
    const checkFrom = ['TripSecurity', 'Notifications', 'EditTrip'];
    if (props.route.params.fromDashboard || checkFrom.includes(props.route.params.from)) { setIsFromDashboard(true); }
  }

  useEffect(() => {
    if (paseoSeleccionado?.pinPaseo && !isFromDashboard) {
      navigation.navigate('TripSecurity', {
        id: props.route.params.id,
        pin: paseoSeleccionado?.pinPaseo,
      });
    }
    if (paseoSeleccionado?.idCreador!) {
      obtenerUsuarioPaseo(paseoSeleccionado?.idCreador!);
    }
    if (paseoSeleccionado?.pinPaseo && seAsignoPin) {
      Alert.alert(
        t('tripDetails.protectConfirmationTitle'),
        t('tripDetails.protectConfirmationPin', {pin: paseoSeleccionado?.pinPaseo!.toString()}),
        [
          { text: t('common.ok')}
        ],
        {
          cancelable: false,
        }        
      );         
    }
    let today = new Date();
    today.setHours(0,0,0,0);
    let paseo = new Date(paseoSeleccionado?.fechaPaseo!);
    paseo.setHours(0,0,0,0);

    setPaseoCompletado(paseo < today);

    console.log("TripDetails::paseoCompletado: " + paseoCompletado);

    setSeAsignoPin(false);    
  }, [paseoSeleccionado]);

  useEffect(() => {
    if (paseoSeleccionadoCargado) {
      procesoVotosUsuario();
    }
  }, [paseoSeleccionadoCargado]);

  const manejarVotos = (posicion: number, tipo: string, tipoVoto: string) => {
    switch (tipo) {
      case 'rest':
        const existIndexRest = restaurantesVotar.findIndex(x => x.posicion === posicion);
        if (existIndexRest !== -1) {
          restaurantesVotar[existIndexRest] = {
            tipoVoto,
            posicion,
          };
          setRestaurantesVotar([...restaurantesVotar]);
        } else {
          setRestaurantesVotar((state) => [{ posicion, tipoVoto }, ...state]);
        }
        break;
      case 'attr':
        const existIndexAttr = atraccionesVotar.findIndex(x => x.posicion === posicion);
        if (existIndexAttr !== -1) {
          atraccionesVotar[existIndexAttr] = {
            tipoVoto,
            posicion,
          };
          setAtraccionesVotar([...atraccionesVotar]);
        } else {
          setAtraccionesVotar((state) => [{ posicion, tipoVoto }, ...state]);
        }
        break;
    }
  };

  const enviarVotos = (tipo: string) => {
    switch (tipo) {
      case 'rest':
        setEnviandoVotacionRest(true);
        const restaurantes = paseoSeleccionado?.seccionRestaurantes?.restaurantes;
        let idSecciones: ITipoVotoEnviar[] = restaurantesVotar.map(x => {
          return {
            idLugar: restaurantes![x.posicion].idLugarGoogle,
            tipoVoto: x.tipoVoto,
          };
        });
        votarSeccion(user._id!, props.route.params.id, idSecciones, 'RESTAURANTE');
        break;
      case 'attr':
        setEnviandoVotacionAtr(true);
        const atracciones = paseoSeleccionado?.seccionAtraccionesTuristicas?.atraccionesturisticas;
        let idSeccionesAtracciones: ITipoVotoEnviar[] = atraccionesVotar.map(x => {
          return {
            idLugar: atracciones![x.posicion].idLugarGoogle,
            tipoVoto: x.tipoVoto,
          };
        });
        votarSeccion(user._id!, props.route.params.id, idSeccionesAtracciones, 'ATRACCION_TURISTICA');
        break;
    }
  };

  const handleCerrarVotacion = (idPaseo:string, tipo:TipoSeccion) => {
    cerrarSeccion(idPaseo,tipo);
  };

  const revisarVotosUsuario = (lugar: ILugar) => {
    const usuarioVoto = lugar?.votaciones?.find(x => x.idVotante === user._id);
    if (usuarioVoto === undefined || usuarioVoto.resultado === 'nullVal') {
      return {
        like: false,
        noLike: false,
      };
    } else {
      return usuarioVoto.resultado === 'like' ?
        {
          like: true,
          noLike: false,
        } :
        {
          like: false,
          noLike: true,
        };
    }
  };

  const revisarVotos = (lugares: ILugar[]) => {
    const indicesVotosUsuario: ITipoVoto[] = [];
    for (let i = 0; i < lugares.length; i++) {
      const lugar = lugares[i];
      if (lugar.votaciones && lugar.votaciones.length > 0) {
        const indice = lugar?.votaciones?.findIndex(x => x.idVotante === user._id);
        const votacion = lugar?.votaciones?.find(x => x.idVotante === user._id);
        if (indice !== -1) {
          indicesVotosUsuario.push({
            tipoVoto: votacion?.resultado!,
            posicion: i,
          });
        }
      }
    }
    return indicesVotosUsuario;
  };

  const procesoVotosUsuario = () => {
    const atraccionesVotarTemp = revisarVotos(paseoSeleccionado?.seccionAtraccionesTuristicas?.atraccionesturisticas!);
    setAtraccionesVotar([...atraccionesVotarTemp]);
    const restaurantesVotarTemp = revisarVotos(paseoSeleccionado?.seccionRestaurantes?.restaurantes!);
    setRestaurantesVotar([...restaurantesVotarTemp]);
  };

  const navegarRestaurantes = () => {
    navigation.navigate('Restaurants', { paseo: paseoSeleccionado! });
  };

  const navegarAtracciones = () => {
    navigation.navigate('Sights', { paseo: paseoSeleccionado! });
  };

  useEffect(() => {
    if (!enviandoVotacionAtr && !enviandoVotacionRest) {
      let idPaseo: string = props.route.params.id;
      obtenerPaseo(idPaseo);
    }
  }, [enviandoVotacionAtr, enviandoVotacionRest]);

  const protectPress = (idPaseo: string) => {
    protegerPaseo(idPaseo);
  };

  const unprotectPress = (idPaseo: string) => {
    removerPin(idPaseo);
  };

  const onShare = async (idPaseo: string) => {
    const result = await Share.share({
      message:
        t('tripDetails.shareMessage') + Linking.createURL('tripDetails/' + idPaseo),
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }

  };

  useEffect(() => {
    if (!enviandoVotacionAtr && !enviandoVotacionRest) {
      let idPaseo: string = props.route.params.id;
      obtenerPaseo(idPaseo);
    }
  }, [enviandoVotacionAtr, enviandoVotacionRest]);

  useEffect(() => {
    if (seCerroSeccion) {
      let idPaseo: string = props.route.params.id;
      obtenerPaseo(idPaseo);    
      setSeCerroSeccion(false);
    }
  }, [seCerroSeccion]);

  return (
    <Block safe>
      <Block
        scroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: sizes.s }}
        paddingHorizontal={sizes.padding}>

        {/* Block para el encabezado */}
        <Block>
          <Block row
            justify="space-between"
          >
            <Text h4 marginVertical={sizes.s}>
              {paseoSeleccionado?.nombre}
            </Text>
            <Block row flex={0} align="center">

              {paseoSeleccionado?.pinPaseo &&
                paseoSeleccionado?.idCreador === user._id &&

                <TouchableOpacity
                  onPress={(value) =>
                    Alert.alert(
                      t('tripDetails.unprotectConfirmationTitle'),
                      t('tripDetails.unprotectConfirmationMessage'),
                      [
                        { text: t('common.no'), style: 'cancel' },
                        { text: t('common.yes'), onPress: () => unprotectPress(paseoSeleccionado?._id!) },
                      ]
                    )}
                >
                  <Image source={assets.protected} />
                </TouchableOpacity>
              }


              {!paseoSeleccionado?.pinPaseo &&
                paseoSeleccionado?.idCreador === user._id &&
                <TouchableOpacity
                  onPress={(value) =>
                    Alert.alert(
                      t('tripDetails.protectConfirmationTitle'),
                      t('tripDetails.protectConfirmationMessage'),
                      [
                        { text: t('common.no'), style: 'cancel' },
                        { text: t('common.yes'), onPress: () => protectPress(paseoSeleccionado?._id!) },
                      ]
                    )}
                >
                  <Image source={assets.unprotected} />
                </TouchableOpacity>
              }

              {paseoSeleccionado?.idCreador === user._id &&
                <TouchableOpacity
                  onPress={() => { onShare(paseoSeleccionado?._id!); }} >
                  <Image source={assets.share} />
                </TouchableOpacity>
              }

            </Block>
          </Block>
        </Block>

        {/* Block para la foto y los detalles */}
        <Block marginBottom={sizes.m}>
          {/* Foto */}
          <Image
            resizeMode="cover"
            source={{ uri: paseoSeleccionado?.destino.urlFotos![0] }}
            //source={assets.carousel1}
            style={{ height: 250 }}
          />
          {/* Destino */}
          <Block row
            align="flex-start"
            justify="flex-start"
            marginTop={sizes.sm}>
            <Image
              radius={0}
              source={assets.location}
              style={{ tintColor: colors.secondary }}
            />
            <Text p secondary
              marginBottom={sizes.s}
              marginLeft={sizes.s}>
              {paseoSeleccionado?.destino.nombre}
            </Text>
          </Block>
          {/* Fecha */}
          <Block row
            align="flex-start"
            justify="flex-start"
            marginTop={sizes.sm}>
            <Image
              radius={0}
              source={assets.calendar}
              style={{ tintColor: colors.secondary }}
            />
            <Text p secondary
              marginBottom={sizes.s}
              marginLeft={sizes.s}>
              {dayjs(paseoSeleccionado?.fechaPaseo).format(t('common.dateFormat'))}
            </Text>
          </Block>
          {/* Usuario */}
          <Block row
            marginTop={sizes.s}>
            <Image
              source={{ uri: usuarioPaseo?.urlFoto }}
              style={{ width: sizes.xl, height: sizes.xl, borderRadius: sizes.s }}
            />
            <Block marginLeft={sizes.s}>
              <Text p semibold>
                {usuarioPaseo?.nombreCompleto}
              </Text>
              <Text p gray>
                {t('tripDetails.tripCreated')}
                {dayjs(paseoSeleccionado?.fechaCreacion).format(t('common.dateFormat'))}
              </Text>
              {paseoSeleccionado?.pinPaseo &&
                paseoSeleccionado?.idCreador === user._id &&
                <Text p gray>
                  PIN: {paseoSeleccionado?.pinPaseo!}
                </Text>
              }
            </Block>
          </Block>
        </Block>

        <Block>
          {/* Restaurantes */}
          <Block card color={colors.card}
            marginBottom={sizes.s}>
            <Block row justify="space-between" marginBottom={sizes.sm}>
              <Text h5 semibold>
                {t('newTrip.restaurants')}
              </Text>
              {!paseoSeleccionado?.seccionRestaurantes?.esFinalizadasVotaciones &&
                paseoSeleccionado?.idCreador === user._id && !paseoCompletado &&
              <Block row flex={0} align="center">
                <TouchableOpacity onPress={() => navegarRestaurantes()}>
                  <Block row flex={0} align="center">
                    <Text
                      p
                      color={colors.primary}
                      semibold
                      size={sizes.linkSize}
                      marginRight={sizes.s}>
                      {t('tripDetails.edit')}
                    </Text>
                    <Image source={assets.arrow} color={colors.primary} />
                  </Block>
                </TouchableOpacity>
              </Block>
              }
            </Block>

            {paseoSeleccionado?.seccionRestaurantes?.restaurantes.map(
              (restaurante, index) => (
                <Block row align="center" marginBottom={sizes.m}
                  key={`rest-${restaurante.idLugarGoogle}-${index}`}>
                  <PlaceDetail 
                    place={restaurante} 
                    posicion={index} 
                    tipo="rest" 
                    manejarVotos={manejarVotos} 
                    usuarioVotado={revisarVotosUsuario(restaurante)}
                    votosCerrados={paseoSeleccionado?.seccionRestaurantes?.esFinalizadasVotaciones}
                    paseoCompletado={paseoCompletado}
                  />
                </Block>
              ))
            }

            {
              paseoSeleccionado?.seccionRestaurantes?.restaurantes.length === 0 && (
                <Block row marginBottom={sizes.sm}>
                  <Text h5 color={colors.primary}>
                    {t('tripDetails.noRestaurants')}
                  </Text>
                </Block>
              )
            }

            {/* {
              !enviandoVotacionRest ?
                <Button
                  onPress={() => { enviarVotos('rest'); }}
                  gradient={gradients.primary}
                  outlined
                  marginVertical={sizes.s}
                >
                  <Text bold white transform="uppercase">
                    {t('newTrip.vote')}
                  </Text>
                </Button> :
                <Button
                  gradient={gradients.primary}
                  outlined
                  marginVertical={sizes.s}
                >
                  <Text bold white transform="uppercase">
                    {t('newTrip.sendingVotes')}
                  </Text>
                </Button>
            } */}

            {!paseoSeleccionado?.seccionRestaurantes?.esFinalizadasVotaciones && 
             !paseoCompletado && (
              !enviandoVotacionRest ?
                <Button
                  onPress={() => { enviarVotos('rest'); }}
                  gradient={gradients.primary}
                  outlined
                  marginVertical={sizes.s}
                >
                  <Text bold white transform="uppercase">
                    {t('newTrip.vote')}
                  </Text>
                </Button> :
                <Button
                  gradient={gradients.primary}
                  outlined
                  marginVertical={sizes.s}
                >
                  <Text bold white transform="uppercase">
                    {t('newTrip.sendingVotes')}
                  </Text>
                </Button>
            )}


            {paseoSeleccionado?.idCreador === user._id && !paseoCompletado &&
             !paseoSeleccionado?.seccionRestaurantes?.esFinalizadasVotaciones &&
            <Button
              gradient={gradients.warning}
              outlined
              marginVertical={sizes.xs}
              paddingHorizontal={sizes.sm}
              onPress={(value) =>
                Alert.alert(
                  t('tripDetails.closeVotingConfirmationTitle'),
                  t('tripDetails.closeVotingConfirmationMessage'),
                  [
                    { text: t('common.no'), style: 'cancel' },
                    { text: t('common.yes'), onPress: () => handleCerrarVotacion(paseoSeleccionado?._id!, TipoSeccion.RESTAURANTE) },
                  ]
                )}
              >
              <Text bold white transform="uppercase">
                {t('tripDetails.closeVotes')}
              </Text>
            </Button>
            }            
          </Block>

          {/* Atracciones */}
          <Block card color={colors.card}
            marginBottom={sizes.s}>
            <Block row justify="space-between" marginBottom={sizes.sm}>
              <Text h5 semibold>
                {t('newTrip.touristAttractions')}
              </Text>
              {!paseoSeleccionado?.seccionAtraccionesTuristicas?.esFinalizadasVotaciones &&
                paseoSeleccionado?.idCreador === user._id && !paseoCompletado &&
              <Block row flex={0} align="center">
                <TouchableOpacity onPress={() => navegarAtracciones()}>
                  <Block row flex={0} align="center">
                    <Text
                      p
                      color={colors.primary}
                      semibold
                      size={sizes.linkSize}
                      marginRight={sizes.s}>
                      {t('tripDetails.edit')}
                    </Text>
                    <Image source={assets.arrow} color={colors.primary} />
                  </Block>
                </TouchableOpacity>
              </Block>
              }
            </Block>

            {paseoSeleccionado?.seccionAtraccionesTuristicas?.atraccionesturisticas.map(
              (attraccion, index) => (
                <Block row align="center" marginBottom={sizes.m}
                  key={`attr-${attraccion.idLugarGoogle}-${index}`}>
                  <PlaceDetail 
                    place={attraccion} 
                    posicion={index} 
                    tipo="attr" 
                    manejarVotos={manejarVotos} 
                    usuarioVotado={revisarVotosUsuario(attraccion)}
                    votosCerrados={paseoSeleccionado?.seccionAtraccionesTuristicas?.esFinalizadasVotaciones}
                    paseoCompletado={paseoCompletado}
                  />
                </Block>
              ))}

            {
              paseoSeleccionado?.seccionAtraccionesTuristicas?.atraccionesturisticas.length === 0 && (
                <Block row marginBottom={sizes.sm}>
                  <Text h5 color={colors.primary}>
                    {t('tripDetails.noTouristAttractions')}
                  </Text>
                </Block>
              )
            }

            {!paseoSeleccionado?.seccionAtraccionesTuristicas?.esFinalizadasVotaciones && 
             !paseoCompletado && (
             !enviandoVotacionAtr ?
              <Button
                onPress={() => { enviarVotos('attr'); }}
                gradient={gradients.primary}
                outlined
                marginVertical={sizes.s}
              >
                <Text bold white transform="uppercase">
                  {t('newTrip.vote')}
                </Text>
              </Button> :
              <Button
                gradient={gradients.primary}
                outlined
                marginVertical={sizes.s}
              >
                <Text bold white transform="uppercase">
                  {t('newTrip.sendingVotes')}
                </Text>
              </Button>
            )}

            {paseoSeleccionado?.idCreador === user._id && !paseoCompletado &&
             !paseoSeleccionado?.seccionAtraccionesTuristicas?.esFinalizadasVotaciones &&
            <Button
              gradient={gradients.warning}
              outlined
              marginVertical={sizes.xs}
              paddingHorizontal={sizes.sm}
              onPress={(value) =>
                Alert.alert(
                  t('tripDetails.closeVotingConfirmationTitle'),
                  t('tripDetails.closeVotingConfirmationMessage'),
                  [
                    { text: t('common.no'), style: 'cancel' },
                    { text: t('common.yes'), onPress: () => handleCerrarVotacion(paseoSeleccionado?._id!, TipoSeccion.ATRACCION_TURISTICA) },
                  ]
                )}
            >
              <Text bold white transform="uppercase">
                {t('tripDetails.closeVotes')}
              </Text>
            </Button>
            }

          </Block>

        </Block>
      </Block>
    </Block>
  );
};

export default TripDetails;
