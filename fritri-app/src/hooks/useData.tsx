import React, { useCallback, useContext, useEffect, useState } from 'react';
import Storage from '@react-native-async-storage/async-storage';

import {
  IArticle,
  ICategory,
  IProduct,
  IUseData,
  IBasket,
  INotification,
  ITheme,
} from '../constants/types';

import {
  USERS,
  FOLLOWING,
  TRENDING,
  CATEGORIES,
  ARTICLES,
  RECOMMENDATIONS,
  BASKET,
  NOTIFICATIONS,
} from '../constants/mocks';

import {light, dark} from '../constants';
import { IUsuarioFritri } from '../interfaces/usuario-fritri';
import { IPaseo } from '../interfaces/paseo';
import { INotificacion } from '../interfaces/notificacion';
import { useNotificacion } from './useNotificacion';

export const DataContext = React.createContext({});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  //Estados que se mantienen
  const [isDark, setIsDark] = useState(false);
  const [theme, setTheme] = useState<ITheme>(light);
  const [user, setUser] = useState<IUser>(USERS[0]);

  const [basket, setBasket] = useState<IBasket>(BASKET);
  const [users, setUsers] = useState<IUsuarioFritri[]>(USERS);
  const [following, setFollowing] = useState<IProduct[]>(FOLLOWING);
  const [trending, setTrending] = useState<IProduct[]>(TRENDING);
  const [categories, setCategories] = useState<ICategory[]>(CATEGORIES);
  const [recommendations, setRecommendations] =
    useState<IArticle[]>(RECOMMENDATIONS);
  const [articles, setArticles] = useState<IArticle[]>(ARTICLES);
  const [article, setArticle] = useState<IArticle>({});

  //Este estado está pendiente de analizar si se reulitiza
  const [notifications, setNotifications] =
    useState<INotification[]>(NOTIFICATIONS);

  //hook para el paseo que se está creando
  const [newTripTemp, setNewTripTemp] = useState<IPaseo | null>(null);

  //hook para el paseo que se está consultando
  const [selectedTrip, setSelectedTrip] = useState<IPaseo | null>(null);

  // get isDark mode from storage
  const getIsDark = useCallback(async () => {
    // get preferance gtom storage
    const isDarkJSON = await Storage.getItem('isDark');

    if (isDarkJSON !== null) {
      // set isDark / compare if has updated
      setIsDark(JSON.parse(isDarkJSON));
    }
  }, [setIsDark]);

  // handle isDark mode
  const handleIsDark = useCallback(
    (payload: boolean) => {
      // set isDark / compare if has updated
      setIsDark(payload);
      // save preferance to storage
      Storage.setItem('isDark', JSON.stringify(payload));
    },
    [setIsDark],
  );

  // handle users / profiles
  const handleUsers = useCallback(
    (payload: IUsuarioFritri[]) => {
      // set users / compare if has updated
      if (JSON.stringify(payload) !== JSON.stringify(users)) {
        setUsers({ ...users, ...payload });
      }
    },
    [users, setUsers],
  );

  // handle basket
  const handleBasket = useCallback(
    (payload: IBasket) => {
      // set basket items / compare if has updated
      if (JSON.stringify(payload) !== JSON.stringify(basket)) {
        const subtotal = payload?.items?.reduce((total, item) => {
          total += (item.price || 0) * (item.qty || 1);
          return total;
        }, 0);
        setBasket({ ...basket, ...payload, subtotal });
      }
    },
    [basket, setBasket],
  );

  // handle user
  const handleUser = useCallback(
    (payload: IUsuarioFritri) => {
      // set user / compare if has updated
      if (JSON.stringify(payload) !== JSON.stringify(user)) {
        setUser(payload);
      }
    },
    [user, setUser],
  );

  // handle Article
  const handleArticle = useCallback(
    (payload: IArticle) => {
      // set article / compare if has updated
      if (JSON.stringify(payload) !== JSON.stringify(article)) {
        setArticle(payload);
      }
    },
    [article, setArticle],
  );

  // handle Notifications
  const handleNotifications = useCallback(
    (payload: INotification[]) => {
      // set notifications / compare if has updated
      if (JSON.stringify(payload) !== JSON.stringify(notifications)) {
        setNotifications(payload);
      }
    },
    [notifications, setNotifications],
  );

  // get initial data for: isDark & language
  useEffect(() => {
    getIsDark();
  }, [getIsDark]);

  // change theme based on isDark updates
  useEffect(() => {
    setTheme(isDark ? dark : light);
  }, [isDark]);

  const contextValue = {
    isDark,
    handleIsDark,
    theme,
    setTheme,
    user,
    setUser,
    users,
    handleUsers,
    handleUser,
    basket,
    handleBasket,
    following,
    setFollowing,
    trending,
    setTrending,
    categories,
    setCategories,
    recommendations,
    setRecommendations,
    articles,
    setArticles,
    article,
    handleArticle,
    notifications,
    handleNotifications,
    newTripTemp,
    setNewTripTemp,
    selectedTrip,
    setSelectedTrip,    
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext) as IUseData;
