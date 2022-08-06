import { useTheme, useTranslation } from '../hooks';
import {Block, Button, Input, Image, Text} from '../components/';
import { useEffect } from 'react';
import { usePaseo } from '../hooks/usePaseos';
import dayjs from 'dayjs';
import { TouchableOpacity } from 'react-native';
import { useUsuario } from '../hooks/useUsuario';

const TripDetails = (props) => {
    const {assets, sizes, colors} = useTheme();
    const {t} = useTranslation();
    const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 5;

    const {obtenerPaseo, paseoSeleccionado} = usePaseo();

    const {usuarioPaseo, obtenerUsuarioPaseo} = useUsuario();


    useEffect(() => {
      let idPaseo:string = props.route.params.id;
      obtenerPaseo(idPaseo);
    }, []);

    useEffect(() => {
      if (paseoSeleccionado?.idCreador!) {
        obtenerUsuarioPaseo(paseoSeleccionado?.idCreador!);
      }
    }, [paseoSeleccionado]);

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
                {t('tripDetails.tripCreated')}
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
              (restaurante) => (
                <Block row align="center" marginBottom={sizes.m}
                  key={`rest-${restaurante.idLugarGoogle}`}>
                  <Block
                    flex={0} width={64} height={64}
                    align="center" justify="center" 
                    marginRight={sizes.s}>
                    <TouchableOpacity>
                      {restaurante.urlFotos.length>0 && (
                      <Image
                        radius={sizes.s} width={64} height={64}
                        source={{uri: restaurante.urlFotos![0]}}
                        style={{
                          height: IMAGE_SIZE,
                          width: IMAGE_SIZE,
                        }}
                      />
                      )}
                      {restaurante.urlFotos.length===0 && (
                      <Image
                        radius={sizes.s} width={64} height={64}
                        source={assets.restaurant}
                        style={{
                          height: IMAGE_SIZE,
                          width: IMAGE_SIZE,
                        }}
                      />
                      )}
                    </TouchableOpacity>                    
                  </Block>

                  <Block>
                    <Block row justify="space-between">
                      <Text semibold>{restaurante.nombre}</Text>
                      <TouchableOpacity
                        //onPress={() => handleVote()}
                        >
                        <Block row flex={0} align="flex-start">
                        <Image
                          radius={0}
                          source={assets.unchecked}
                          style={{tintColor: colors.secondary}}
                          width={sizes.m}
                          height={sizes.m}
                        />
                        </Block>
                      </TouchableOpacity>
                    </Block>
                    <TouchableOpacity
                      //onPress={() => handleViewDetails(_id!)}
                      >
                      <Block row flex={0} align="center">
                        <Text
                          p
                          color={colors.primary}
                          semibold
                          size={sizes.linkSize}
                          marginRight={sizes.s}>
                          {t('tripDetails.otherVotes')}
                        </Text>
                        <Image source={assets.arrow} color={colors.primary} />
                      </Block>
                    </TouchableOpacity>                    
                  </Block>                  

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
              (attraccion) => (
                <Block row align="center" marginBottom={sizes.m}
                  key={`rest-${attraccion.idLugarGoogle}`}>
                  <Block
                    flex={0} width={64} height={64}
                    align="center" justify="center" 
                    marginRight={sizes.s}>
                    <TouchableOpacity>
                      {attraccion.urlFotos.length>0 && (
                      <Image
                        radius={sizes.s} width={64} height={64}
                        source={{uri: attraccion.urlFotos![0]}}
                        style={{
                          height: IMAGE_SIZE,
                          width: IMAGE_SIZE,
                        }}
                      />
                      )}
                      {attraccion.urlFotos.length===0 && (
                      <Image
                        radius={sizes.s} width={64} height={64}
                        source={assets.attraction}
                        style={{
                          height: IMAGE_SIZE,
                          width: IMAGE_SIZE,
                        }}
                      />
                      )}
                    </TouchableOpacity> 
                  </Block>

                  <Block>
                    <Block row justify="space-between">
                      <Text semibold>{attraccion.nombre}</Text>
                      <TouchableOpacity
                        //onPress={() => handleVote()}
                        >
                        <Block row flex={0} align="flex-start">
                        <Image
                          radius={0}
                          source={assets.unchecked}
                          style={{tintColor: colors.secondary}}
                          width={sizes.m}
                          height={sizes.m}
                        />
                        </Block>
                      </TouchableOpacity>
                    </Block>
                    <TouchableOpacity
                      //onPress={() => handleViewDetails(_id!)}
                      >
                      <Block row flex={0} align="center">
                        <Text
                          p
                          color={colors.primary}
                          semibold
                          size={sizes.linkSize}
                          marginRight={sizes.s}>
                          {t('tripDetails.otherVotes')}
                        </Text>
                        <Image source={assets.arrow} color={colors.primary} />
                      </Block>
                    </TouchableOpacity>                    
                  </Block>                   

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
          </Block>

          </Block>
        </Block>
      </Block>
    );
  };

  export default TripDetails;