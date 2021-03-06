import dayjs from 'dayjs';
import {
  IArticle,
  IArticleOptions,
  IBasket,
  ICategory,
  IExtra,
  ILocation,
  INotification,
  IProduct,
  IUser,
} from './types';

// users
export const USERS: IUser[] = [
  {
    id: 1,
    name: 'Devin Coldewey',
    department: 'Marketing Manager',
    stats: {posts: 323, followers: 53200, following: 749000},
    social: {twitter: 'CreativeTim', dribbble: 'creativetim'},
    about:
      'Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).',
    avatar:
      'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?fit=crop&w=80&q=80',
  },
  {
    id: 2,
    name: 'Bella Audrey',
    department: 'Marketing Manager',
    stats: {posts: 323, followers: 53200, following: 749000},
    social: {twitter: 'CreativeTim', dribbble: 'creativetim'},
    about:
      'Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=80&q=80',
  },
  {
    id: 3,
    name: 'Miriam Lendra',
    department: 'Desktop Publisher',
    stats: {posts: 323, followers: 53200, following: 749000},
    social: {twitter: 'CreativeTim', dribbble: 'creativetim'},
    about:
      'Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=80&q=80',
  },
  {
    id: 4,
    name: 'David Bishop',
    department: 'Marketing Manager',
    stats: {posts: 323, followers: 53200, following: 749000},
    social: {twitter: 'CreativeTim', dribbble: 'creativetim'},
    about:
      'Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).',
    avatar:
      'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?fit=crop&w=80&q=80',
  },
  {
    id: 5,
    name: 'Mathew Glock',
    department: 'HR Manager',
    stats: {posts: 323, followers: 53200, following: 749000},
    social: {twitter: 'CreativeTim', dribbble: 'creativetim'},
    about:
      'Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).',
    avatar:
      'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?fit=crop&w=80&q=80',
  },
  {
    id: 6,
    name: 'Emma Roberts',
    department: 'HR Manager',
    stats: {posts: 323, followers: 53200, following: 749000},
    social: {twitter: 'CreativeTim', dribbble: 'creativetim'},
    about:
      'Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).',
    avatar:
      'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?fit=crop&w=80&q=80',
  },
];

// following cards
export const FOLLOWING: IProduct[] = [
  {
    id: 1,
    type: 'vertical',
    title: 'Paseo a Puerto Viejo 2022',
    image:
      'https://lh3.googleusercontent.com/places/AKR5kUjb2sWEAnv_Xk5GAJJtJI20MzeK8wT1LlZZJW2dq_mnLl7lbsXBEzrmTx4CLwb_lXB-ZJf2U-amxpbveg-8sIefzoHgsBKlNNQ=s1600-w640-h480',
  },
];

// trending cards
export const TRENDING: IProduct[] = [
  {
    id: 1,
    type: 'vertical',
    title: 'Paseo a Puerto Viejo 2019',
    image:
      'https://lh3.googleusercontent.com/places/AKR5kUjb2sWEAnv_Xk5GAJJtJI20MzeK8wT1LlZZJW2dq_mnLl7lbsXBEzrmTx4CLwb_lXB-ZJf2U-amxpbveg-8sIefzoHgsBKlNNQ=s1600-w640-h480',
  },
  {
    id: 2,
    type: 'vertical',
    title: 'Paseo a Flamingo 2019',
    image:
      'https://lh3.googleusercontent.com/places/AKR5kUhwi1QmDB9OkGrD1kf1u3TQTPRaAiT_f2Pks8druC3_rzVgJnGzcTHBbQFhYE0rwj6bxAY3nTslRUjXLsHShu7qwYdmzqTikcg=s1600-w640-h480',
  },
  {
    id: 3,
    type: 'vertical',
    title: 'Paseo a Playa Conchal 2018',
    image:
      'https://lh3.googleusercontent.com/places/AKR5kUjDAuGmdK4mtqKSzScYQ7CpIySdwUTw5s0yzh_qHiuq-0Sq0cfGe6SIcJDABjC0-Y3SGUeh3cUSnL9s1EETdphhjUvZTmamEEM=s1600-w640-h480',
  },
  {
    id: 4,
    type: 'vertical',
    title: 'Paseo a Playa Uvita 2018',
    image:
      'https://lh3.googleusercontent.com/places/AKR5kUj4vOYmvzOIielEJYnJazi6hFr6GLM-Yi2Jd3pT1pBFCyQzxDpNopVfmD9TO-s_XMPYB50J-6xtZ-86sojuPyIJiypP0BsUghg=s1600-w640-h480',
  },
];

// categories
export const CATEGORIES: ICategory[] = [
  {id: 1, name: 'Popular'},
  {id: 2, name: 'Newest'},
  {id: 3, name: 'Fashion'},
  {id: 4, name: 'Best deal'},
];

// article options
export const ARTICLE_OPTIONS: IArticleOptions[] = [
  {
    id: 1,
    title: 'Single room in center',
    description:
      'As Uber works through a huge amount of internal management turmoil, the company is also consolidating.',
    type: 'room',
    guests: 1,
    sleeping: {total: 1, type: 'sofa'},
    price: 89,
    user: USERS[0],
    image:
      'https://images.unsplash.com/photo-1543489822-c49534f3271f?fit=crop&w=450&q=80',
  },
  {
    id: 2,
    title: 'Cosy apartment',
    description:
      'Different people have different taste, and various types of music have many ways of leaving an impact on someone.',
    type: 'apartment',
    guests: 3,
    sleeping: {total: 2, type: 'bed'},
    price: 200,
    user: USERS[0],
    image:
      'https://images.unsplash.com/photo-1603034203013-d532350372c6?fit=crop&w=450&q=80',
  },
  {
    id: 3,
    title: 'Single room in center',
    description:
      'As Uber works through a huge amount of internal management turmoil, the company is also consolidating.',
    type: 'room',
    guests: 1,
    sleeping: {total: 1, type: 'sofa'},
    price: 89,
    user: USERS[0],
    image:
      'https://images.unsplash.com/photo-1543489822-c49534f3271f?fit=crop&w=450&q=80',
  },
];

// offers
export const OFFERS: IProduct[] = [
  {
    id: 1,
    type: 'vertical',
    title: 'Unique activities with local experts.',
    image:
      'https://images.unsplash.com/photo-1604998103924-89e012e5265a?fit=crop&w=450&q=80',
  },
  {
    id: 2,
    type: 'vertical',
    title: 'The highest status people.',
    image:
      'https://images.unsplash.com/photo-1563492065599-3520f775eeed?fit=crop&w=450&q=80',
  },
  {
    id: 3,
    type: 'vertical',
    title: 'Get more followers and grow.',
    image:
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?fit=crop&w=450&q=80',
  },
  {
    id: 4,
    type: 'vertical',
    title: 'New ways to meet your business goals.',
    image:
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?fit=crop&w=450&q=80',
  },
];

// rental locations
export const LOCATIONS: ILocation[] = [
  {id: 1, city: 'Paris', country: 'France'},
  {id: 2, city: 'Rome', country: 'Italy'},
  {id: 3, city: 'London', country: 'United Kingdom'},
];

// articles
export const ARTICLES: IArticle[] = [
  {
    id: 1,
    title: 'Flexible office space means growth.',
    description:
      'Rather than worrying about switching offices every couple years, you can instead stay in the same location.',
    category: CATEGORIES[0],
    options: ARTICLE_OPTIONS,
    image:
      'https://images.unsplash.com/photo-1604998103924-89e012e5265a?fit=crop&w=450&q=80',
    user: USERS[0],
    timestamp: dayjs().unix(),
  },
  {
    id: 2,
    title: 'Global payments in a single integration.',
    description:
      'Rather than worrying about switching offices every couple years, you can instead stay.',
    category: CATEGORIES[0],
    options: ARTICLE_OPTIONS,
    image:
      'https://images.unsplash.com/photo-1563492065599-3520f775eeed?fit=crop&w=450&q=80',
    user: USERS[1],
    timestamp: dayjs().unix(),
  },
  {
    id: 3,
    title: 'Working with the latest technologies.',
    description:
      'Rather than worrying about switching offices every couple years, you can instead stay in the same location.',
    category: CATEGORIES[0],
    options: ARTICLE_OPTIONS,
    image:
      'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?fit=crop&w=450&q=80',
    user: USERS[2],
    timestamp: dayjs().unix(),
  },
  {
    id: 4,
    title: 'Office space means growth.',
    description:
      'Rather than worrying about switching offices every couple years, you can instead stay in the same location.',
    category: CATEGORIES[0],
    options: ARTICLE_OPTIONS,
    image:
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?fit=crop&w=450&q=80',
    user: USERS[3],
    timestamp: dayjs().unix(),
  },
  {
    id: 5,
    title: 'Office space means growth.',
    description: `The mission of LinkedIn is simple: connect the world's professionals.`,
    category: CATEGORIES[1],
    options: ARTICLE_OPTIONS,
    image:
      'https://images.unsplash.com/photo-1596720426673-e4e14290f0cc?fit=crop&w=450&q=80',
    user: USERS[4],
    timestamp: dayjs().unix(),
  },
  {
    id: 6,
    title: 'Office space means growth.',
    description:
      'Rather than worrying about switching offices every couple years, you can instead stay in the same location.',
    category: CATEGORIES[1],
    options: ARTICLE_OPTIONS,
    image:
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?fit=crop&w=450&q=80',
    user: USERS[5],
    timestamp: dayjs().unix(),
  },
  {
    id: 7,
    title: 'Office space means growth.',
    description:
      'Rather than worrying about switching offices every couple years, you can instead stay in the same location.',
    category: CATEGORIES[1],
    options: ARTICLE_OPTIONS,
    image:
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?fit=crop&w=450&q=80',
    user: USERS[6],
    timestamp: dayjs().unix(),
  },
  {
    id: 8,
    title: 'Office space means growth.',
    description:
      'Rather than worrying about switching offices every couple years, you can instead stay in the same location.',
    category: CATEGORIES[2],
    options: ARTICLE_OPTIONS,
    image:
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?fit=crop&w=450&q=80',
    user: USERS[1],
    timestamp: dayjs().unix(),
  },
  {
    id: 9,
    title: 'Office space means growth.',
    description:
      'Rather than worrying about switching offices every couple years, you can instead stay in the same location.',
    category: CATEGORIES[2],
    options: ARTICLE_OPTIONS,
    image:
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?fit=crop&w=450&q=80',
    user: USERS[5],
    timestamp: dayjs().unix(),
  },
  {
    id: 10,
    title: 'Office space means growth.',
    description:
      'Rather than worrying about switching offices every couple years, you can instead stay in the same location.',
    category: CATEGORIES[2],
    options: ARTICLE_OPTIONS,
    image:
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?fit=crop&w=450&q=80',
    user: USERS[6],
    timestamp: dayjs().unix(),
  },
  {
    id: 11,
    description:
      'A great to stay in Paris without feeling you are in the city!',
    category: CATEGORIES[3], // best deal
    options: ARTICLE_OPTIONS,
    image:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?fit=crop&w=450&q=80',
    location: LOCATIONS[0],
    rating: 4.9,
    timestamp: dayjs().unix(),
  },
  {
    id: 12,
    description: 'Best Italy location in a bustling neighbourhood, 2 min.',
    category: CATEGORIES[3], // best deal
    options: ARTICLE_OPTIONS,
    image:
      'https://images.unsplash.com/photo-1529154036614-a60975f5c760?fit=crop&w=450&q=80',
    location: LOCATIONS[1],
    rating: 4.5,
    timestamp: dayjs().unix(),
  },
  {
    id: 13,
    description:
      'The most beautiful and complex UI Kits built by Creative Tim.',
    category: CATEGORIES[3], // best deal
    options: ARTICLE_OPTIONS,
    image:
      'https://images.unsplash.com/photo-1486299267070-83823f5448dd?fit=crop&w=450&q=80',
    location: LOCATIONS[2],
    rating: 4.8,
    timestamp: dayjs().unix(),
  },
];

// rental recommendations
export const RECOMMENDATIONS: IArticle[] = [
  {
    id: 1,
    description:
      'A great to stay in Paris without feeling you are in the city!',
    category: CATEGORIES[3], // best deal
    options: ARTICLE_OPTIONS,
    image:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?fit=crop&w=450&q=80',
    location: LOCATIONS[0],
    rating: 4.9,
    offers: OFFERS,
    timestamp: dayjs().unix(),
  },
  {
    id: 2,
    description: 'Best Italy location in a bustling neighbourhood, 2 min.',
    category: CATEGORIES[3], // best deal
    options: ARTICLE_OPTIONS,
    image:
      'https://images.unsplash.com/photo-1529154036614-a60975f5c760?fit=crop&w=450&q=80',
    location: LOCATIONS[1],
    rating: 4.5,
    offers: OFFERS,
    timestamp: dayjs().unix(),
  },
  {
    id: 3,
    description:
      'The most beautiful and complex UI Kits built by Creative Tim.',
    category: CATEGORIES[3], // best deal
    options: ARTICLE_OPTIONS,
    image:
      'https://images.unsplash.com/photo-1486299267070-83823f5448dd?fit=crop&w=450&q=80',
    location: LOCATIONS[2],
    rating: 4.8,
    offers: OFFERS,
    timestamp: dayjs().unix(),
  },
];

// chat messages
export const MESSSAGES = [
  {
    _id: 1,
    text: 'Bye, bye 👋🏻',
    createdAt: dayjs().subtract(1, 'm').toDate(),
    user: {
      _id: USERS[0].id,
      name: USERS[0].name,
      avatar: USERS[0].avatar,
    },
  },
  {
    _id: 2,
    text: 'Ok. Cool! See you 😁',
    createdAt: dayjs().subtract(2, 'm').toDate(),
    user: {
      _id: USERS[1].id,
      name: USERS[1].name,
      avatar: USERS[1].avatar,
    },
  },
  {
    _id: 3,
    text: 'Sure, just let me finish somerhing and I’ll call you.',
    createdAt: dayjs().subtract(3, 'm').toDate(),
    user: {
      _id: USERS[0].id,
      name: USERS[0].name,
      avatar: USERS[0].avatar,
    },
  },
  {
    _id: 4,
    text: 'Hey there! How are you today? Can we meet and talk about location? Thanks!',
    createdAt: dayjs().subtract(4, 'm').toDate(),
    user: {
      _id: USERS[1].id,
      name: USERS[1].name,
      avatar: USERS[1].avatar,
    },
  },
];

// extras cards
export const EXTRAS: IExtra[] = [
  {
    id: 1,
    name: 'BMW X5',
    time: dayjs().format('hh:00'),
    image: require('../assets/images/x5.png'),
    saved: false,
    booked: false,
    available: true,
  },
  {
    id: 2,
    name: 'Tesla',
    time: dayjs().format('hh:00'),
    image: require('../assets/images/tesla.png'),
    saved: false,
    booked: false,
    available: true,
  },
  {
    id: 3,
    name: 'Mercedes GLE',
    time: dayjs().format('hh:00'),
    image: require('../assets/images/gle.png'),
    saved: false,
    booked: false,
    available: false,
  },
];

// shopping basket recommentations
export const BASKET_RECOMMENDATIONS: IBasket['items'] = [
  {
    id: 4,
    title: 'Polo T-Shirt',
    description: 'Impeccably tailored in Italy.',
    image:
      'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?fit=crop&w=450&q=80',
    stock: true,
    qty: 1,
    size: 'M',
    price: 200,
  },
  {
    id: 5,
    title: 'Orange Jacket',
    description: 'Mustard About Me - South Africa',
    image:
      'https://images.unsplash.com/photo-1599407950360-8b8642d423dc?fit=crop&w=450&q=80',
    stock: true,
    qty: 1,
    size: 'M',
    price: 489,
  },
];

// shopping basket
export const BASKET: IBasket = {
  subtotal: 750,
  recommendations: BASKET_RECOMMENDATIONS,
  items: [
    {
      id: 1,
      title: 'Leather Jacket',
      description: 'Impeccably tailored in Italy from lightweight navy.',
      image:
        'https://images.unsplash.com/photo-1562751361-ac86e0a245d1?fit=crop&w=450&q=80',
      stock: true,
      qty: 1,
      size: 'M',
      price: 250,
      qtys: [1, 2, 3, 4, 5],
      sizes: ['xs', 's', 'm', 'l', 'xl', 'xxl'],
    },
    {
      id: 2,
      title: 'Dark T-Shirt',
      description: 'Dark-grey slub wool, pintucked notch lapels.',
      image:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?fit=crop&w=450&q=80',
      stock: true,
      qty: 1,
      size: 'l',
      price: 150,
      qtys: [1, 2, 3, 4, 5],
      sizes: ['xs', 's', 'm', 'l', 'xl', 'xxl'],
    },
    {
      id: 3,
      title: 'Leather Handbag',
      description: "Immaculate tailoring is TOM FORD's forte",
      image:
        'https://images.unsplash.com/photo-1608060434411-0c3fa9049e7b?fit=crop&w=450&q=80',
      stock: true,
      qty: 1,
      size: 'm',
      price: 350,
      qtys: [1, 2, 3],
      sizes: ['s', 'm', 'l'],
    },
  ],
};

// notifications
export const NOTIFICATIONS: INotification[] = [
  {
    id: 1,
    subject: 'New trip',
    message: 'Enrique has invited you to Paseo mediados de año',
    type: 'notification',
    read: false,
    createdAt: dayjs().subtract(2, 'h').toDate(),
  },
  {
    id: 2,
    subject: 'New trip',
    message: 'Enrique has invited you to Paseo mediados de año',
    type: 'notification',
    read: false,
    createdAt: dayjs().subtract(4, 'h').toDate(),
  },
  {
    id: 3,
    subject: 'Update from trip',
    message: 'Owner has added new restaurant',
    type: 'notification',
    read: false,
    createdAt: dayjs().subtract(6, 'h').toDate(),
  },
  {
    id: 4,
    subject: 'Update from trip',
    message: 'Owner has added new restaurant',
    type: 'notification',
    read: false,
    createdAt: dayjs().subtract(2, 'd').toDate(),
  },
  {
    id: 5,
    subject: 'Update from trip',
    message: 'Owner has added new restaurant',
    type: 'notification',
    read: true,
    createdAt: dayjs().subtract(3, 'd').toDate(),
  },
  {
    id: 6,
    subject: 'Update from trip',
    message: 'Owner has added new tourist attraction',
    type: 'notification',
    read: true,
    createdAt: dayjs().subtract(2, 'w').toDate(),
  }
];

export default {
  USERS,
  FOLLOWING,
  TRENDING,
  CATEGORIES,
  ARTICLES,
  RECOMMENDATIONS,
  MESSSAGES,
  EXTRAS,
  NOTIFICATIONS,
};
