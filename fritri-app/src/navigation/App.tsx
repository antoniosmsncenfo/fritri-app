import React, {useEffect, useState} from 'react';
import {Platform, StatusBar} from 'react-native';
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import * as Linking from 'expo-linking';
import Storage from '@react-native-async-storage/async-storage';

import Menu from './Menu';
import {useData, ThemeProvider, TranslationProvider} from '../hooks';

const prefix = Linking.createURL('/');


export default () => {
  const {isDark, theme, setTheme, handleUser} = useData();
  const [ data, setData ] = useState({});

  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
          Screens: {
            screens: {
              TripDetails: 'tripDetails/:id',
            }
        }
      }
    }
  };

  

  useEffect(() => {
    async function getInitialURL() {
      const initialURL = await Linking.getInitialURL();
      if(initialURL) setData(Linking.parse(initialURL));
    }
    
    Linking.addEventListener('url', handleDeepLink);
    if(!data) {
      getInitialURL();
    }
    return () => {
      Linking.removeEventListener('url', () => {});
    }
  }, [])

  const handleDeepLink = (event) => {
    let dataTemp = Linking.parse(event.url);
    setData(dataTemp);
  }

  /* set the status bar based on isDark constant */
  useEffect(() => {
    Platform.OS === 'android' && StatusBar.setTranslucent(true);
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
    return () => {
      StatusBar.setBarStyle('default');
    };
  }, [isDark]);

  useEffect(() => {
    const getGUser = async() => {
      let userG = await Storage.getItem('userG');
      if(userG) {
        handleUser(JSON.parse(userG));
      }
    }
    getGUser();
  }, [])

  // load custom fonts
  const [fontsLoaded] = useFonts({
    'OpenSans-Light': theme.assets.OpenSansLight,
    'OpenSans-Regular': theme.assets.OpenSansRegular,
    'OpenSans-SemiBold': theme.assets.OpenSansSemiBold,
    'OpenSans-ExtraBold': theme.assets.OpenSansExtraBold,
    'OpenSans-Bold': theme.assets.OpenSansBold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const navigationTheme = {
    ...DefaultTheme,
    dark: isDark,
    colors: {
      ...DefaultTheme.colors,
      border: 'rgba(0,0,0,0)',
      text: String(theme.colors.text),
      card: String(theme.colors.card),
      primary: String(theme.colors.primary),
      notification: String(theme.colors.primary),
      background: String(theme.colors.background),
    },
  };

  return (
    <TranslationProvider>
      <ThemeProvider theme={theme} setTheme={setTheme}>
        <NavigationContainer theme={navigationTheme} linking={linking}>
          <Menu />
        </NavigationContainer>
      </ThemeProvider>
    </TranslationProvider>
  );
};
