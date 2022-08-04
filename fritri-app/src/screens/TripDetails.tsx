import { useTheme, useTranslation } from '../hooks';
import {Block, Button, Input, Image, Text} from '../components/';
import { useEffect, useState } from 'react';
import { usePaseo } from '../hooks/usePaseos';
import dayjs from 'dayjs';
import { TouchableOpacity } from 'react-native';
import { useUsuario } from '../hooks/useUsuario';
import { useVotacion } from '../hooks/useVotacion';
import { PlaceDetail } from '../components/PlaceDetail';

const TripDetails = (props) => {
    const {assets, sizes, colors, gradients} = useTheme();
    const {t} = useTranslation();
    const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 5;

    const {obtenerPaseo, paseoSeleccionado} = usePaseo();

    const {usuarioPaseo, obtenerUsuarioPaseo} = useUsuario();
    const { votarSeccion, votacionFinalizada } = useVotacion();

    const [ restaurantesVotar, setRestaurantesVotar] = useState<number[]>([]);
    const [ atraccionesVotar, setAtraccionesVotar] = useState<number[]>([]);
    const [ isLoadingVotacion, setIsLoadingVotacion] = useState(false);


    useEffect(() => {
      let idPaseo:string = props.route.params.id;
      obtenerPaseo(idPaseo);
    }, []);

    useEffect(() => {
      if(!votacionFinalizada) {
        obtenerUsuarioPaseo(paseoSeleccionado?.idCreador!);
      }
    }, [paseoSeleccionado]);

    const manejarVotos = (posicion: number, tipo: string) => {
      switch(tipo) {
        case 'rest':
          const existIndexRest = restaurantesVotar.findIndex(x => x === posicion);
          if(existIndexRest !== -1) {
            restaurantesVotar.splice(existIndexRest, 1);
            setRestaurantesVotar([...restaurantesVotar]);
          } else {
            setRestaurantesVotar((state) => [posicion, ...state]);
          }
        break;
        case 'attr':
          const existIndexAttr = atraccionesVotar.findIndex(x => x === posicion);
          if(existIndexAttr !== -1) {
            atraccionesVotar.splice(existIndexAttr, 1);
            setAtraccionesVotar([...atraccionesVotar]);
          } else {
            setAtraccionesVotar((state) => [posicion, ...state]);
          }
        break;
      }
    }

    const enviarVotos = (tipo: string) => {
      switch(tipo) {
        case 'rest':
          const restaurantes = paseoSeleccionado?.seccionRestaurantes?.restaurantes;
          let idSecciones: any[] = restaurantesVotar.map(x => {
            return restaurantes && restaurantes[x].idLugarGoogle
          })
          console.log('idSecciones');
          console.log(idSecciones);
          votarSeccion(paseoSeleccionado?.idCreador!, props.route.params.id, idSecciones, 'RESTAURANTE');
        break;
        case 'attr':
          
        break;
      }
    }

    useEffect(() => {
      let idPaseo:string = props.route.params.id;
      obtenerPaseo(idPaseo);
    }, [votacionFinalizada])

    return (
      <Block safe>
      <Block
        scroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingVertical: sizes.s}}
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
              <TouchableOpacity>
                <Image source={assets.share} />
              </TouchableOpacity>
            </Block>
          </Block>
        </Block>

        {/* Block para la foto y los detalles */}
        <Block marginBottom={sizes.m}>
          {/* Foto */}
          <Image
            resizeMode="cover"
            source={{uri: paseoSeleccionado?.destino.urlFotos![0]}}
            //source={assets.carousel1}
            style={{height: 250}}
          />
          {/* Destino */}
          <Block row 
            align="flex-start" 
            justify="flex-start"
            marginTop={sizes.sm}>
            <Image
                radius={0}
                source={assets.location}
                style={{tintColor: colors.secondary}}
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
                style={{tintColor: colors.secondary}}
              />
            <Text p secondary
              marginBottom={sizes.s}
              marginLeft={sizes.s}>
              { dayjs(paseoSeleccionado?.fechaPaseo).format(t('common.dateFormat'))}
            </Text>
          </Block> 
          {/* Usuario */}
          <Block row 
            marginTop={sizes.s}>
            <Image
              source={{uri: usuarioPaseo?.urlFoto}}
              style={{width: sizes.xl, height: sizes.xl, borderRadius: sizes.s}}
            />
            <Block marginLeft={sizes.s}>
              <Text p semibold>
                {usuarioPaseo?.nombreCompleto}
              </Text>
              <Text p gray>
              { dayjs(paseoSeleccionado?.fechaCreacion).format(t('common.dateFormat'))}
              </Text>
            </Block>
          </Block>
        </Block>

        <Block>
          {/* Restaurantes */}
          <Block card color={colors.card}
            marginBottom={sizes.s}>          
            <Block row marginBottom={sizes.sm}>
              <Text h5 semibold>
              {t('newTrip.restaurants')}
              </Text>
            </Block>

            {paseoSeleccionado?.seccionRestaurantes?.restaurantes.map(
              (restaurante, index) => (
                <Block row align="center" marginBottom={sizes.m}
                  key={`rest-${restaurante.idLugarGoogle}-${index}`}>
                  <PlaceDetail place={restaurante} posicion={index} tipo="rest" manejarVotos={manejarVotos} usuarioVotado={false}/>
                </Block>
            ))}

            {
              paseoSeleccionado?.seccionRestaurantes?.restaurantes.length===0 && (
                <Block row marginBottom={sizes.sm}>
                  <Text h5 color={colors.primary}>
                  {t('tripDetails.noRestaurants')}
                  </Text>
                </Block>                
              )
            }
            { restaurantesVotar.length > 0 && 
              <Button
                onPress={() => { enviarVotos('rest') }}
                gradient={gradients.primary}
                outlined
                marginVertical={sizes.s}
              >
                <Text bold white transform="uppercase">
                {t('newTrip.vote')}
                </Text>
              </Button>
            }
          </Block>

         {/* Atracciones */}
         <Block card color={colors.card}
            marginBottom={sizes.s}>          
            <Block row marginBottom={sizes.sm}>
              <Text h5 semibold>
              {t('newTrip.touristAttractions')}
              </Text>
            </Block>

            {paseoSeleccionado?.seccionAtraccionesTuristicas?.atraccionesturisticas.map(
              (attraccion, index) => (
                <Block row align="center" marginBottom={sizes.m}
                  key={`attr-${attraccion.idLugarGoogle}-${index}`}>
                    <PlaceDetail place={attraccion} posicion={index} tipo="attr" manejarVotos={manejarVotos} usuarioVotado={false}/>
                </Block>
            ))}

            {
              paseoSeleccionado?.seccionAtraccionesTuristicas?.atraccionesturisticas.length===0 && (
                <Block row marginBottom={sizes.sm}>
                  <Text h7 color={colors.primary}>
                  {t('tripDetails.noTouristAttractions')}
                  </Text>
                </Block>                
              )
            }

            { atraccionesVotar.length > 0 && 
              <Button
                onPress={() => { enviarVotos('attr') }}
                gradient={gradients.primary}
                outlined
                marginVertical={sizes.s}
              >
                <Text bold white transform="uppercase">
                {t('newTrip.vote')}
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