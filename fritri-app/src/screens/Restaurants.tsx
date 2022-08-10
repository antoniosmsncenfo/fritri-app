import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';

import { useData, useTheme, useTranslation } from '../hooks';
import { Block, Button, Text } from '../components';
import LugarGoogle, { ILugarGoogleAction } from '../components/LugarGoogle';
import { ILugarGoogleData } from '../components/LugarGoogle';
import { useGooglePlace } from '../hooks/useGooglePlace';
import { ISolicitudLugaresGoogle } from '../interfaces/solicitud-lugares-google';
import { ILugar, IPaseo, IPaseoUpdate, ISeccionRestaurantes } from '../interfaces/paseo';
import { ILugarGoogle } from '../interfaces/lugar-google';
import { usePaseo } from '../hooks/usePaseos';

const LugaresGoogleHeader = () => {
  const { t } = useTranslation();
  const { sizes } = useTheme();
  return (
    <>
      <Block row flex={0} align="center" justify="space-between" marginVertical={sizes.m} >
        <Text h5 semibold>
          {t('restaurants.recommendations')}
        </Text>
      </Block>
    </>
  );
};

interface IFooterProps {
  show: boolean;
  onPress?: (event?: any) => void
}

const LugaresGoogleFooter = ({ show, onPress }: IFooterProps) => {
  const { t } = useTranslation();
  const { sizes } = useTheme();
  return (
    <Block row justify="center" onTouchEnd={onPress} padding={sizes.padding}>
      {show &&
        (<Text primary semibold transform="uppercase">
          {t('restaurants.seeMore')}
        </Text>)}
    </Block>
  );
};

const Restaurants = (props: any) => {
  const { t } = useTranslation();
  const { sizes, gradients, colors } = useTheme();
  const { newTripTemp, setNewTripTemp } = useData();
  const { lugaresGooglePorTipoResponse, getLugaresGoogle,
    getGooglePlace: obtenerDestinoPaseo, googlePlace: destinoDelPaseo,
    googlePlacesList: lugaresDelPaseo } = useGooglePlace();
  const { actualizarPaseo, paseoActualizado } = usePaseo();
  const [lugaresSeleccionados, setLugaresSeleccionados] = useState<ILugar[]>([]);
  const [lugaresGoogleDataMostrar, setLugaresGoogleDataMostrar] = useState<ILugarGoogleData[]>([]);
  const [selectedRadio, setSelectedRadio] = useState(5);
  const [notFound, setNotFound] = useState(false);
  const [showPagination, setShowPagination] = useState(false);
  const [showActivityIndicator, setShowActivityIndicator] = useState(true);
  const [isPaginationUsed, setIsPaginationUsed] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [paseoEditar, setPaseoEditar] = useState<IPaseo | null>(null);
  const navigation = useNavigation();
  const minDistanceKm = 5;
  const maxDistanceKm = 20;
  const stepDistanceKm = 5;

  //se ejecuta cuando se inicia la ventana
  useEffect(() => {
    if (props.route.params && props.route.params.paseo) {
      // se ejecuta cuando es la modificación de un paseo
      const paseo: IPaseo = props.route.params.paseo;
      obtenerDestinoPaseo(paseo.destino.idLugarGoogle!);
      setPaseoEditar(paseo);
      setIsEdit(true);
      if (paseo.seccionRestaurantes?.restaurantes?.length! > 0) {
        setLugaresSeleccionados(paseo.seccionRestaurantes?.restaurantes!);
        //const idsRestaurantesPaseo = paseo.seccionRestaurantes?.restaurantes.map(r => { return r.idLugarGoogle; });
        //obtenerLugaresDelPaseo(idsRestaurantesPaseo!);
      }
    }
    else {
      // se ejecuta cuando es la creación de un paseo
      setIsEdit(false);
      requestLugaresGoogleToService(false);
    }
  }, []);

  //se ejecuta cuando se obtiene el destino del paseo
  useEffect(() => {
    if (destinoDelPaseo) {
      //Solicita los lugares del destino
      requestLugaresGoogleToService(false);
    }
  }, [destinoDelPaseo]);

  // se ejecuta cuando se obtienen los lugares del destino seleccionado por el usuario
  useEffect(() => {
    let result: ILugarGoogleData[] = [];

    if (lugaresGooglePorTipoResponse && lugaresGooglePorTipoResponse.lugaresGoogle.length > 0) {
      //Convierte el lugar en lugarData, para agregar la bandera de seleccionado en falso
      result = lugaresGooglePorTipoResponse.lugaresGoogle.map((r) => { return { selected: false, lugarGoogle: r }; });
      setNotFound(false);
    } else {
      setNotFound(true);
    }

    const resultadoSinduplicado = concatenarConLugaresAMostrar(result);
    isPaginationUsed && setIsPaginationUsed(false);
    //!isEdit && setLugaresSeleccionados([]);
    setLugaresGoogleDataMostrar(resultadoSinduplicado);
    setShowPagination(lugaresGooglePorTipoResponse.tokenPaginacion !== '' ? true : false);
    setShowActivityIndicator(false);
  }, [lugaresGooglePorTipoResponse]);

  // se ejecuta cuando se obtienen los lugares que ya estaban seleccionados en el paseo
  useEffect(() => {
    let result: ILugarGoogleData[] = [];

    if (lugaresDelPaseo && lugaresDelPaseo.length > 0) {
      const seleccionados = lugaresDelPaseo.map(l => { return convertirILugarGoogleAILugar(l); });
      setLugaresSeleccionados(seleccionados);

      //Convierte el lugar en lugarData, para agregar la bandera de seleccionado en true
      result = lugaresDelPaseo.map((r) => { return { selected: true, lugarGoogle: r }; });
      const resultadoSinduplicado = concatenarConLugaresAMostrar(result);
      setLugaresGoogleDataMostrar(resultadoSinduplicado);
    }
  }, [lugaresDelPaseo]);

  useEffect(() => {
    if (paseoActualizado !== null) {

      const param = { id: paseoActualizado._id, from: 'restautants' };
      Alert.alert(
        t('restaurants.update'),
        t('restaurants.updateSuccessful'),
        [{
          text: 'OK', onPress: () => {
            resetNavigationStackAndNavigateToTripDetails(param);
          },
        }],
        { cancelable: false }
      );
    }
  }, [paseoActualizado]);

  const resetNavigationStackAndNavigateToTripDetails = (param: any) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'Home' },
          { name: 'TripDetails', params: param },
        ],
      })
    );
  };

  const concatenarConLugaresAMostrar = (lugares: ILugarGoogleData[]) => {
    const resultadoFotosFiltradas = lugares.filter(r => r.lugarGoogle.urlFotos.length > 0); // quita los lugares sin foto

    const lugaresConcatenados = resultadoFotosFiltradas.concat(lugaresGoogleDataMostrar); // agrega los lugares seleccionados a los cercanos del destino

    const idsSeleccionados = lugaresSeleccionados.map(lugar => { return lugar.idLugarGoogle; });

    // marca los lugares seleccionados
    const lugaresMarcadosComoSeleccionados = lugaresConcatenados.map(lugar => {
      if (idsSeleccionados.length > 0) {
        const seleccionado = idsSeleccionados.includes(lugar.lugarGoogle.idGoogle);
        return { ...lugar, selected: seleccionado };
      }
      else {
        return lugar;
      }
    });

    const lugaresOrdenados = lugaresMarcadosComoSeleccionados.sort((value) => {
      return value.selected ? -1 : 1; // ordena primero los seleccionados
    });

    const idsAgregados: string[] = [];

    // quita los lugares duplicados
    return lugaresOrdenados.filter(lugar => {
      const duplicado = idsAgregados.includes(lugar.lugarGoogle.idGoogle);
      if (duplicado) {
        return false;
      }
      else {
        idsAgregados.push(lugar.lugarGoogle.idGoogle);
        return true;
      }
    });
  };

  //Agrega los restaurantes al paseo temporal, para luego navegar a las atracciones
  const goToSights = () => {
    //agregar los reataurantes al paseo temporal
    const seccionRestaurantes: ISeccionRestaurantes = {
      esFinalizadasVotaciones: false,
      fechaFinalizacionVotaciones: new Date(),
      restaurantes: lugaresSeleccionados,
    };

    setNewTripTemp({
      ...newTripTemp,
      seccionRestaurantes: seccionRestaurantes,
    });
    navigation.navigate('Sights');
  };

  const updatePaseo = () => {
    const seccionRestaurantes: ISeccionRestaurantes = {
      esFinalizadasVotaciones: paseoEditar?.seccionRestaurantes?.esFinalizadasVotaciones!,
      fechaFinalizacionVotaciones: paseoEditar?.seccionRestaurantes?.fechaFinalizacionVotaciones!,
      restaurantes: lugaresSeleccionados,
    };

    const paseoParaActualizar: IPaseoUpdate = {
      ...paseoEditar,
      seccionRestaurantes: seccionRestaurantes,
      idPaseo: paseoEditar?._id!,
      idCreador: paseoEditar?.idCreador!,
      nombre: paseoEditar?.nombre!,
      fechaPaseo: paseoEditar?.fechaPaseo!,
      esCompartido: paseoEditar?.esCompartido!,
      destino: paseoEditar?.destino!,
      eliminado: paseoEditar?.eliminado!,
      fechaCreacion: paseoEditar?.fechaCreacion!,
    };
    actualizarPaseo(paseoParaActualizar);
  };

  const actualizar = () => {
    if (isEdit) {
      updatePaseo();
    }
    else {
      goToSights();
    }
  };

  //este es el callback que revisa si se desea ver el destino o seleccionarlo para agregarlo al paseo
  const onLugarGoogleChange = (action: ILugarGoogleAction) => {
    switch (action.action) {
      case 'select':
        updateLugaresGoogleData(action);
        break;
      case 'view':
        navigation.navigate('ViewDestination', action.lugarGoogle);
        break;
      default:
        break;
    }
  };

  const convertirILugarGoogleAILugar = (lugarGoogle: ILugarGoogle): ILugar => {
    return {
      idLugarGoogle: lugarGoogle.idGoogle,
      nombre: lugarGoogle.nombre,
      descripcion: `{"calificacion": ${lugarGoogle.calificacion}, "vecindario":"${lugarGoogle.vecindario}"}`,
      urlFotos: lugarGoogle.urlFotos,
    };

  };

  //Aqui agrego los restaurantes seleccionados
  const updateLugaresGoogleData = ({ lugarGoogle, select }: ILugarGoogleAction) => {
    if (select) {
      const selected = convertirILugarGoogleAILugar(lugarGoogle);

      setLugaresSeleccionados([...lugaresSeleccionados, selected]);
    }
    else {
      const filtered = lugaresSeleccionados.filter(r => r.idLugarGoogle !== lugarGoogle.idGoogle);
      setLugaresSeleccionados(filtered);
    }
  };

  const requestLugaresGoogleToService = (usePagination: boolean = false) => {
    setShowActivityIndicator(true);
    let latitud = 0;
    let longitud = 0;
    if (destinoDelPaseo) {
      // Utiliza las coordenadas del destino del paseo (editando paseo)
      latitud = destinoDelPaseo.latitud;
      longitud = destinoDelPaseo.longitud;
    }
    else {
      // Utiliza las coordenadas del destino seleccionado por el usuario (creando paseo)
      latitud = newTripTemp.destino.latitud!;
      longitud = newTripTemp.destino.longitud!;
    }

    const request: ISolicitudLugaresGoogle = {
      latitud: latitud,
      longitud: longitud,
      radio: selectedRadio,
      tipo: 'restaurantes',
      tokenPaginacion: usePagination ? lugaresGooglePorTipoResponse.tokenPaginacion : '',
    };

    getLugaresGoogle(request);
    setIsPaginationUsed(usePagination);

  };

  return (
    <>
      <Block flex={1} paddingHorizontal={sizes.sm} white>
        <Block row justify="center" marginLeft={sizes.xs}>
          <Text h5 bold size={13} transform="uppercase" >
            {t('restaurants.searching')} {selectedRadio} km
          </Text>
        </Block>

        <Block row marginVertical={sizes.sm}>
          <Block row justify="center" flex={1}>
            <Text h5 bold size={13} transform="uppercase" primary>
              {minDistanceKm} km
            </Text>
          </Block>
          <Block flex={5}>
            <Slider thumbTintColor={colors.primary!} style={{ height: 30 }} maximumValue={maxDistanceKm} minimumValue={minDistanceKm} step={stepDistanceKm}
              value={selectedRadio} onValueChange={sliderValue => setSelectedRadio(sliderValue)} onTouchEnd={() => requestLugaresGoogleToService(false)} />
          </Block>
          <Block row justify="center" flex={1} >
            <Text h5 bold size={13} transform="uppercase" primary>
              {maxDistanceKm} km
            </Text>
          </Block>
        </Block>
        {(lugaresSeleccionados.length > 0)
          && (
            <Button gradient={gradients.primary} marginVertical={sizes.s}
              onPress={() => actualizar()}>
              <Text white semibold transform="uppercase">
                {isEdit ? t('restaurants.update') : t('restaurants.sights')}
              </Text>
            </Button>
          )}
      </Block>

      <Block flex={4}>
        {/* lugaresGoogle list */}
        {/* not found */}
        {notFound && (
          <Block flex={0} paddingHorizontal={sizes.padding} paddingTop={sizes.padding}>
            <Text p>
              {t('restaurants.notFound1')}
            </Text>
            <Text p marginTop={sizes.s}>
              {t('restaurants.moreOptions')}
            </Text>
          </Block>
        )}

        {!notFound && (
          <Block flex={0} paddingLeft={sizes.sm} >
            <LugaresGoogleHeader />
          </Block>)}
        <Block>
          <FlatList
            refreshing={true}
            data={lugaresGoogleDataMostrar}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => `${item?.lugarGoogle.idGoogle}`}
            style={{ paddingHorizontal: sizes.s, marginBottom: sizes.s }}
            contentContainerStyle={{ paddingHorizontal: sizes.s }}
            renderItem={({ item }) => (
              <LugarGoogle lugarGoogleProp={item} onPress={(value) => onLugarGoogleChange(value)} />
            )}
            ListFooterComponent={() =>
            (<Block>
              {showActivityIndicator &&
                (<Block paddingLeft={sizes.s} marginTop={sizes.s}>
                  <ActivityIndicator size="large" color={colors.primary} />
                </Block>)
              }
              <LugaresGoogleFooter show={showPagination} onPress={() => requestLugaresGoogleToService(true)} />
            </Block>)
            }
          />
        </Block>
      </Block>

    </ >
  );
};

export default Restaurants;
