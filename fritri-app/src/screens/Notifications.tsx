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

interface INotificacionProps {
  notificacion: INotificacion;
  onPress: (event: INotificacionAction) => void;
}

interface INotificacionAction {
  action: 'read' | 'delete' | 'trip';
  notificacion: INotificacion;
}

const Notificacion = ({ notificacion, onPress}: INotificacionProps) => {

  const {colors, icons, gradients, sizes} = useTheme();
  const navigation = useNavigation();

  const markAsRead = () => {
    onPress({ action: 'read', notificacion });
  };

  const archiveNotification = () => {
    onPress({ action: 'delete', notificacion });
  };

  return (
    <Block row align="center" marginBottom={sizes.m}>
      {!notificacion.esLeida && 
        <Block
          flex={0}
          width={32}
          height={32}
          align="center"
          justify="center"
          radius={sizes.s}
          marginRight={sizes.s}
          gradient={gradients[!notificacion.esLeida ? 'primary' : 'secondary']}>
          
          <TouchableOpacity
            onPress={() => markAsRead()} >          
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
      {notificacion.esLeida && 
        <Block
          flex={0}
          width={32}
          height={32}
          align="center"
          justify="center"
          radius={sizes.s}
          marginRight={sizes.s}
          gradient={gradients[!notificacion.esLeida ? 'primary' : 'secondary']}>
          
          <TouchableOpacity
            onPress={() => archiveNotification()} >             
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
              navigation.navigate('TripDetails', {id:notificacion.idPaseo})} >

          <Block row justify="space-between">
            <Text semibold>{notificacion.titulo}</Text>
            <Block row flex={0} align="center">
              <Image source={icons.clock} />
              <Text secondary size={12} marginLeft={sizes.xs}>
                {dayjs().to(dayjs(notificacion.fechaCreacion))}
              </Text>
            </Block>
          </Block>
          <Text secondary size={12} lineHeight={sizes.sm}>
            {notificacion.detalle}
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

  const {obtenerNotificaciones, notificacionesUsuario, actualizarNotificacion} = useNotificacion();

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
      setRefrescar(false);
    }
  }, [refrescar])
  
  const pendientes = notificacionesUsuario?.filter(
    (notificacion) => !notificacion?.esLeida,
  );
  const leidas = notificacionesUsuario?.filter(
    (notificacion) => notificacion?.esLeida,
  );

  const onNotificacionPress = (tipo: INotificacionAction) => {
    console.log(JSON.stringify(tipo));
    switch (tipo.action) {
      case 'read':
        actualizarNotificacion({
          _id:tipo.notificacion._id,
          esLeida:true,
        });
        setRefrescar(true);
        break;
      case 'delete':
        actualizarNotificacion({
          _id:tipo.notificacion._id,
          esArchivada:true,
        });
        setRefrescar(true);
        break;
      case 'trip':
        // navigation.navigate('ViewDestination', action.destination);
        break;        
      default:
        break;
    }
  };

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
              {pendientes?.map((pendiente) => (
                <Notificacion notificacion={pendiente}
                  key={`unread-${pendiente._id}`}
                  onPress={(value) => onNotificacionPress(value)}
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
              {leidas?.map((leida) => (
                <Notificacion notificacion={leida}
                key={`unread-${leida._id}`}
                onPress={(value) => onNotificacionPress(value)}
              />
              ))}             
            </Block>
          )}
        </Block>

    </Block>
  );
};

export default Notifications;
