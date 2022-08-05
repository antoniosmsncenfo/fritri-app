import React, {useState} from 'react';
import dayjs from 'dayjs';
import PagerView from 'react-native-pager-view';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

import {useData, useTheme, useTranslation} from '../hooks/';
import {INotification} from '../constants/types';
import {Block, Button, Image, Text} from '../components/';
import { useNotificacion } from '../hooks/useNotificacion';
import { INotificacion } from '../interfaces/notificacion';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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

// const Notification = ({
//   subject,
//   message,
//   type,
//   read,
//   createdAt,
// }: INotification) => {
//   const {colors, icons, gradients, sizes} = useTheme();

//   return (
//     <Block row align="center" marginBottom={sizes.m}>
//       <Block
//         flex={0}
//         width={32}
//         height={32}
//         align="center"
//         justify="center"
//         radius={sizes.s}
//         marginRight={sizes.s}
//         gradient={gradients[!read ? 'primary' : 'secondary']}>
//         <Image
//           radius={0}
//           width={14}
//           height={14}
//           color={colors.white}
//           source={icons?.[type]}
//         />
//       </Block>
//       <Block>
//         <Block row justify="space-between">
//           <Text semibold>{subject}</Text>
//           <Block row flex={0} align="center">
//             <Image source={icons.clock} />
//             <Text secondary size={12} marginLeft={sizes.xs}>
//               {dayjs().to(dayjs(createdAt))}
//             </Text>
//           </Block>
//         </Block>
//         <Text secondary size={12} lineHeight={sizes.sm}>
//           {message}
//         </Text>
//       </Block>
//     </Block>
//   );
// };

const Notificacion = ({
  titulo,
  detalle,
  idPaseo,
  esLeida,
  fechaCreacion,
}: INotificacion) => {

  const {colors, icons, gradients, sizes} = useTheme();
  const navigation = useNavigation();

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

// const Personal = ({subject, message, type, read, createdAt}: INotification) => {
//   const {colors, icons, gradients, sizes} = useTheme();

//   return (
//     <Block card padding={sizes.sm} marginBottom={sizes.sm}>
//       <Block row align="center" justify="space-between">
//         <Block
//           flex={0}
//           width={32}
//           height={32}
//           align="center"
//           justify="center"
//           radius={sizes.s}
//           gradient={gradients[!read ? 'primary' : 'secondary']}>
//           <Image
//             radius={0}
//             width={12}
//             height={12}
//             color={colors.white}
//             source={icons[type]}
//           />
//         </Block>
//         <Block row flex={0} align="center">
//           <Image source={icons.clock} radius={0} />
//           <Text secondary size={12} marginLeft={sizes.xs}>
//             {dayjs().to(dayjs(createdAt))}
//           </Text>
//         </Block>
//       </Block>
//       <Block marginTop={sizes.s}>
//         <Text p semibold marginBottom={sizes.s}>
//           {subject}
//         </Text>
//         <Text secondary lineHeight={22}>
//           {message}
//         </Text>
//       </Block>
//     </Block>
//   );
// };

const Notifications = () => {
  const {t} = useTranslation();
  const {notifications, notificaciones} = useData();
  const [tab, setTab] = useState('business');
  const pagerRef = React.createRef<PagerView>();
  const {icons, colors, sizes} = useTheme();

  const {notificacionesUsuario} = useNotificacion();

  const unread = notifications?.filter(
    (notification) => !notification?.read,
  );
  const read = notifications?.filter(
    (notification) => notification?.read,
  );

  const pendientes = notificaciones?.filter(
    (notificacion) => !notificacion?.esLeida,
  );
  const leidas = notificaciones?.filter(
    (notificacion) => notificacion?.esLeida,
  );

  console.log(JSON.stringify("Notificaciones en el screen:" + JSON.stringify(notificaciones)));
  
  return (
    <Block>
      {/* <PagerView
        ref={pagerRef}
        style={{flex: 1}}
        scrollEnabled={false}
        initialPage={1}> */}

        <Block
          scroll
          nestedScrollEnabled
          padding={sizes.padding}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: sizes.xxl}}>
          {/* Pendientes */}
          {pendientes?.length>0 && (
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
          {leidas?.length>0 && (
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

      {/* </PagerView> */}
    </Block>
  );
};

export default Notifications;
