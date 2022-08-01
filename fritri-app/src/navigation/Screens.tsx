import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
  About,
  Agreement,
  Articles,
  Chat,
  Components,
  Extras,
  Home,
  Notifications,
  Privacy,
  Profile,
  Register,
  Login,
  ResetPassword,
  NewPassword,
  Rental,
  Rentals,
  Booking,
  Settings,
  Shopping,
  NotificationsSettings,
  LoginFacebook,
  ViewDestination,
  Restaurants,
  NewTrip,
  TripDetails
} from '../screens';

import { useScreenOptions, useTranslation } from '../hooks';

const Stack = createStackNavigator();

export default () => {
  const { t } = useTranslation();
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions.stack}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{ ...screenOptions.back, title: t('navigation.resetPassword') }}
      />
      <Stack.Screen
        name="NewPassword"
        component={NewPassword}
        options={{ ...screenOptions.back, title: t('navigation.resetPassword') }}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ title: t('navigation.home') }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ ...screenOptions.back }}
      />
      <Stack.Screen
        name="Components"
        component={Components}
        options={screenOptions.components}
      />
      <Stack.Screen
        name="Articles"
        component={Articles}
        options={{ title: t('navigation.articles') }}
      />
      <Stack.Screen
        name="Rentals"
        component={Rentals}
        options={{ title: t('navigation.rentals'), ...screenOptions.profile }}
      />
      <Stack.Screen
        name="Rental"
        component={Rental}
        options={{ title: t('navigation.rental'), ...screenOptions.rental }}
      />
      <Stack.Screen
        name="Booking"
        component={Booking}
        options={{ title: t('navigation.booking'), ...screenOptions.rental }}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{ title: t('navigation.chat'), ...screenOptions.chat }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{ title: t('navigation.settings'), ...screenOptions.profile }}
      />
      <Stack.Screen
        name="NotificationsSettings"
        component={NotificationsSettings}
        options={{ title: t('navigation.notifications'), ...screenOptions.back }}
      />
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{ title: t('navigation.notifications'), ...screenOptions.back }}
      />
      <Stack.Screen
        name="Agreement"
        component={Agreement}
        options={{ title: t('navigation.agreement'), ...screenOptions.back }}
      />
      <Stack.Screen
        name="About"
        component={About}
        options={{ title: t('navigation.about'), ...screenOptions.back }}
      />
      <Stack.Screen
        name="Privacy"
        component={Privacy}
        options={{ title: t('navigation.privacy'), ...screenOptions.back }}
      />
      <Stack.Screen
        name="LoginFacebook"
        component={LoginFacebook}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ViewDestination"
        component={ViewDestination}
        options={{ title: t('navigation.returnToTrip'), ...screenOptions.back }}
      />

      <Stack.Screen
        name="Extra"
        component={Extras}
        options={{ title: t('navigation.extra'), headerRight: () => null }}
      />
      <Stack.Screen
        name="Shopping"
        component={Shopping}
        options={{ title: t('navigation.shopping'), ...screenOptions.back }}
      />
      <Stack.Screen
        name="NewTrip"
        component={NewTrip}
        options={{ title: t('navigation.newTrip'), headerRight: () => null }}
      />
      <Stack.Screen
        name="Restaurants"
        component={Restaurants}
        options={{ title: t('navigation.restaurants'), ...screenOptions.back }}
      />
      <Stack.Screen
        name="TripDetails"
        component={TripDetails}
        options={{ title: t('navigation.tripDetails'), ...screenOptions.back }}
      />      
    </Stack.Navigator>
  );
};
