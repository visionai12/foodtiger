import { FoodItem } from './types';

export const CATEGORIES = [
  'All',
  'Burgers',
  'Sushi & Bowls',
  'Artisan Pizza',
  'Fresh Salads',
  'Desserts',
  'Drinks'
];

export const FOOD_ITEMS: FoodItem[] = [
  {
    id: '1',
    name: 'The Golden Tiger Double',
    category: 'Burgers',
    price: 14.50,
    rating: 4.9,
    prepTime: '12-15 min',
    calories: 820,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    description: 'Double dry-aged Angus beef patties, molten sharp cheddar, sweet tiger relish, and house-made truffle glaze on a toasted artisan brioche bun.',
    popular: true
  },
  {
    id: '2',
    name: 'Tiger Tail Roll Platter',
    category: 'Sushi & Bowls',
    price: 16.00,
    rating: 4.8,
    prepTime: '15-18 min',
    calories: 450,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80',
    description: 'Premium spicy bluefin tuna, sliced avocado, cucumber, and toasted sesame seeds, drizzled with sweet unagi reduction and fiery tiger-chili aioli.',
    popular: true
  },
  {
    id: '3',
    name: 'Fireside Margherita Pizza',
    category: 'Artisan Pizza',
    price: 13.00,
    rating: 4.7,
    prepTime: '10-12 min',
    calories: 680,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    description: 'Authentic Neapolitan pizza blistered in our clay ovens, featuring crushed San Marzano tomatoes, fresh Fior di Latte, hand-torn sweet basil, and organic olive oil.'
  },
  {
    id: '4',
    name: 'Wild Tiger Crunch Salad',
    category: 'Fresh Salads',
    price: 11.50,
    rating: 4.6,
    prepTime: '8-10 min',
    calories: 320,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    description: 'Organic romaine hearts, shredded purple carrots, toasted almond flakes, crispy wonton ribbons, and organic edamame tossed in a signature creamy sesame-ginger vinaigrette.'
  },
  {
    id: '5',
    name: 'Midnight Fudge Brownie',
    category: 'Desserts',
    price: 7.50,
    rating: 4.9,
    prepTime: '5-8 min',
    calories: 490,
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80',
    description: 'Ultra-decadent, warm dark chocolate fudge brownie infused with custom-swirled premium salted caramel, finished with crushed roasted hazelnut soil.',
    popular: true
  },
  {
    id: '6',
    name: 'Siberian Peach Nectar',
    category: 'Drinks',
    price: 5.00,
    rating: 4.7,
    prepTime: '3-5 min',
    calories: 120,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    description: 'Freshly extracted sweet peach nectar, brewed premium organic white tea, and crushed mint leaves, served ice cold with craft sphere blocks.'
  },
  {
    id: '7',
    name: 'Volcanic Hot Crispy Burger',
    category: 'Burgers',
    price: 12.50,
    rating: 4.8,
    prepTime: '10-13 min',
    calories: 710,
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80',
    description: 'Spicy buttermilk crisped chicken breast tossed in dry cayenne spices, accompanied by organic honey mustard slaw, dill pickles, and creamy tiger mayo.'
  },
  {
    id: '8',
    name: 'Crispy Salmon Zen Bowl',
    category: 'Sushi & Bowls',
    price: 15.50,
    rating: 4.7,
    prepTime: '12-14 min',
    calories: 540,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    description: 'Pan-seared hand-cut Atlantic salmon filet on warm jasmine rice, with sesame avocado, dynamic sweet corn, sea grapes, and pickled pink ginger flakes.'
  }
];

export const SUGGESTED_ADDRESSES = [
  '742 Evergreen Terrace, Springfield',
  '1209 Tiger Forest Drive, Portland',
  '350 Fifth Avenue, New York NY',
  '221B Baker Street, London',
  'Infinite Loop 1, Cupertino CA'
];
