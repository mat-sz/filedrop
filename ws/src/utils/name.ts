const adjectives: string[] = [
  'Acidic',
  'Awesome',
  'Bitter',
  'Burnt',
  'Buttery',
  'Creamy',
  'Fantastic',
  'Fresh',
  'Fried',
  'Good',
  'Juicy',
  'Moist',
  'Raw',
  'Roasted',
  'Salty',
  'Seasoned',
  'Sharp',
  'Sour',
  'Sugary',
  'Sweet',
  'Stale',
];

const nouns: string[] = [
  'Bamboo',
  'Cabbage',
  'Cactus',
  'Fern',
  'Garlic',
  'Lemon',
  'Lily',
  'Melon',
  'Onion',
  'Palm',
  'Plum',
  'Tofu',
  'Tomato',
  'Watermelon',
];

function arrayRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export const generateClientName = () => {
  const adjective = arrayRandom(adjectives);
  const noun = arrayRandom(nouns);

  return `${adjective} ${noun}`;
};
