import React, {useEffect, useState} from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

import {useData, useTheme, useTranslation} from '../hooks/';
import {Block, Image, Text} from '../components/';
import { useNotificacion } from '../hooks/useNotificacion';
import { INotificacion } from '../interfaces/notificacion';
import { TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: '%ds',
    m: '%dm',
    mm: '%dm',
    h: '%dh',
    hh: '%dh',
    d: '%dh',
    dd: '%dd',
    M: '%dm',
    MM: '%dm',
    y: '%dy',
    yy: '%dy',
  },
});

const Notificacion = ({
  _id,
  titulo,
  detalle,
  idPaseo,
  esLeida,
  fechaCreacion,
}: INotificacion) => {

  const {colors, icons, gradients, sizes} = useTheme();
  const navigation = useNavigation();
  const {actualizarNotificacion} = useNotificacion();

  const handlePendiente = (idNotificacion:string, idPaseo:string) => {
    console.log("idNotificacion: " + idNotificacion + ", idPaseo: " + idPaseo);
    actualizarNotificacion({
      _id:idNotificacion,
      esLeida:true,
    });
    //navigation.navigate('TripDetails', {id:idPaseo});
  };

  return (
    <Block row align="center" marginBottom={sizes.m}>
      {!esLeida && 
        <Block
          flex={0}
          width={32}
          height={32}
          align="center"
          justify="center"
          radius={sizes.s}
          marginRight={sizes.s}
          gradient={gradients[!esLeida ? 'primary' : 'secondary']}>
          
          <TouchableOpacity
            onPress={() => handlePendiente(_id!,idPaseo!)} >          
            <Image
              radius={0}
              width={14}
              height={14}
              color={colors.white}
              source={icons.notification}
            />
          </TouchableOpacity>
        </Block>
      }
      {esLeida && 
        <Block
          flex={0}
          width={32}
          height={32}
          align="center"
          justify="center"
          radius={sizes.s}
          marginRight={sizes.s}
          gradient={gradients[!esLeida ? 'primary' : 'secondary']}>
          
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('TripDetails', {id:idPaseo})} >             
            <Image
              radius={0}
              width={14}
              height={14}
              color={colors.white}
              source={icons.notification} 
            />
          </TouchableOpacity>

        </Block>

      }

      <Block>
        <TouchableOpacity
            onPress={() =>
              navigation.navigate('TripDetails', {id:idPaseo})} >

          <Block row justify="space-between">
            <Text semibold>{titulo}</Text>
            <Block row flex={0} align="center">
              <Image source={icons.clock} />
              <Text secondary size={12} marginLeft={sizes.xs}>
                {dayjs().to(dayjs(fechaCreacion))}
              </Text>
            </Block>
          </Block>
          <Text secondary size={12} lineHeight={sizes.sm}>
            {detalle}
          </Text>

        </TouchableOpacity>
      </Block>

    </Block>
  );
};

const Notifications = () => {
  const {t} = useTranslation();
  const {user} = useData();
  const {icons, colors, sizes} = useTheme();

  const { obtenerNotificaciones, notificacionesUsuario} = useNotificacion();

  const [refrescar, setRefrescar] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      console.log("User:" + user._id!)
      obtenerNotificaciones(user._id!)
    }
  }, []);

  useEffect(() => {
    if (user && refrescar) {
      console.log("Refrescar:" + user._id!)
      obtenerNotificaciones(user._id!)
    }
  }, [refrescar])
  
  const pendientes = notificacionesUsuario?.filter(
    (notificacion) => !notificacion?.esLeida,
  );
  const leidas = notificacionesUsuario?.filter(
    (notificacion) => notificacion?.esLeida,
  );
  
  return (
    <Block>

        <Block
          scroll
          nestedScrollEnabled
          padding={sizes.padding}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: sizes.xxl}}>
          {/* Pendientes */}
          {pendientes?.length!>0 && (
            <Block card padding={sizes.sm} marginBottom={sizes.sm}>
              <Text p semibold marginBottom={sizes.sm}>
                {t('notifications.unread')}
              </Text>
              {pendientes?.map((notificacion) => (
                <Notificacion
                  key={`unread-${notificacion._id}`}
                  {...notificacion}
                />
              ))}
            </Block>
          )}
          {/* Leidas */}
          {leidas?.length!>0 && (
            <Block card padding={sizes.sm}>
              <Text p semibold marginBottom={sizes.sm}>
                {t('notifications.read')}
              </Text>
              {leidas?.map((notificacion) => (
                <Notificacion
                  key={`read-${notificacion._id}`}
                  {...notificacion}
                />
              ))}
              {leidas?.map((notificacion) => (
                <Notificacion
                  key={`read-${notificacion._id}`}
                  {...notificacion}
                />
              ))}              
            </Block>
          )}
        </Block>

    </Block>
  );
};

export default Notifications;
