import i18n from 'i18n-js';
import { ImageSourcePropType } from 'react-native';
import { CalendarProps } from 'react-native-calendars';
import { ITheme } from './theme';
import { IUsuarioFritri } from '../../interfaces/usuario-fritri';
import { IPaseo } from '../../interfaces/paseo';
import { INotificacion } from '../../interfaces/notificacion';

export * from './components';
export * from './theme';

export interface IUsuario {
  id?: number | string;
  tipoLogin?: string;
  correoElectronico?: string;
  contrasena?: string;
  nombreCompleto?: string;
  genero?: string;
  pais?: string;
  foto?: string;
  idTerceros?: string;
}
export interface ILogin {
  correoElectronico: string;
  contrasena: string;
}
export interface ILoginValidation {
  email: boolean;
  password: boolean;
}

export enum FotoUsuario {
  Hombre = 'https://res.cloudinary.com/fritri-app/image/upload/v1657257441/fritri-app/Batman_mci2ra.png',
  Mujer = 'https://res.cloudinary.com/fritri-app/image/upload/v1657257441/fritri-app/Wonder_tox5bu.png'
}

export interface ICategory {
  id?: number;
  name?: string;
}
export interface IArticleOptions {
  id?: number;
  title?: string;
  description?: string;
  type?: 'room' | 'apartment' | 'house'; // private room | entire apartment | entire house
  sleeping?: { total?: number; type?: 'sofa' | 'bed' };
  guests?: number;
  price?: number;
  user?: IUsuarioFritri;
  image?: string;
}
export interface IArticle {
  id?: number;
  title?: string;
  description?: string;
  category?: ICategory;
  image?: string;
  location?: ILocation;
  rating?: number;
  user?: IUsuarioFritri;
  offers?: IProduct[];
  options?: IArticleOptions[];
  timestamp?: number;
  onPress?: (event?: any) => void;
}

export interface IProduct {
  id?: number;
  title?: string;
  description?: string;
  image?: string;
  timestamp?: number;
  linkLabel?: string;
  type: 'vertical' | 'horizontal';
}
export interface ILocation {
  id?: number;
  city?: string;
  country?: string;
}
export interface IUseData {
  isDark: boolean;
  handleIsDark: (isDark?: boolean) => void;
  theme: ITheme;
  setTheme: (theme?: ITheme) => void;
  user: IUsuarioFritri;
  users: IUsuarioFritri[];
  handleUser: (data?: IUsuarioFritri) => void;
  handleUsers: (data?: IUsuarioFritri[]) => void;
  clearUser: () => void;
  basket: IBasket;
  handleBasket: (data?: IBasket) => void;
  following: IProduct[];
  setFollowing: (data?: IProduct[]) => void;
  trending: IProduct[];
  setTrending: (data?: IProduct[]) => void;
  categories: ICategory[];
  setCategories: (data?: ICategory[]) => void;
  recommendations: IArticle[];
  setRecommendations: (data?: IArticle[]) => void;
  articles: IArticle[];
  setArticles: (data?: IArticle[]) => void;
  article: IArticle;
  handleArticle: (data?: IArticle) => void;
  notifications: INotification[];
  handleNotifications: (data?: INotification[]) => void;
  newTripTemp: IPaseo;
  setNewTripTemp: (trip: IPaseo | null) => void;
  selectedTrip: IPaseo;
  setSelectedTrip: (trip: IPaseo) => void;
}

export interface ITranslate {
  locale: string;
  setLocale: (locale?: string) => void;
  t: (scope?: i18n.Scope, options?: i18n.TranslateOptions) => string;
  translate: (scope?: i18n.Scope, options?: i18n.TranslateOptions) => string;
}
export interface IExtra {
  id?: number;
  name?: string;
  time?: string;
  image: ImageSourcePropType;
  saved?: boolean;
  booked?: boolean;
  available?: boolean;
  onBook?: () => void;
  onSave?: () => void;
  onTimeSelect?: (id?: number) => void;
}

export interface IBasketItem {
  id?: number;
  image?: string;
  title?: string;
  description?: string;
  stock?: boolean;
  price?: number;
  qty?: number;
  qtys?: number[];
  size?: number | string;
  sizes?: number[] | string[];
}

export interface IBasket {
  subtotal?: number;
  items?: IBasketItem[];
  recommendations?: IBasketItem[];
}

export interface INotification {
  id?: number;
  subject?: string;
  message?: string;
  read?: boolean;
  business?: boolean;
  createdAt?: number | Date;
  type:
  | 'document'
  | 'documentation'
  | 'payment'
  | 'notification'
  | 'profile'
  | 'extras'
  | 'office';
}

export interface ICalendar extends CalendarProps {
  dates?: any[];
  calendar?: { start: number; end: number };
  onClose?: (calendar?: { start?: number; end?: number }) => void;
}
