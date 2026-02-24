import type { DailyLog, Meal } from './types';

export const MOCK_MEALS: Meal[] = [
  {
    id: 1,
    title: 'Lemon Herb Salmon Bowl',
    description: 'Flaky salmon, quinoa, and wilted spinach with ginger-citrus dressing.',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
    tags: ['High Protein', 'Low GI', 'Nausea Friendly'],
    protein: 42,
    calories: 520,
  },
  {
    id: 2,
    title: 'Turkey Ricotta Stuffed Peppers',
    description: 'Lean turkey, ricotta, and lentils for satiety without heaviness.',
    image: 'https://images.unsplash.com/photo-1604908176997-43130ad28f65?auto=format&fit=crop&w=1200&q=80',
    tags: ['High Protein', 'Fiber Rich'],
    protein: 38,
    calories: 460,
  },
  {
    id: 3,
    title: 'Chicken Soba Recovery Box',
    description: 'Shredded chicken, soba noodles, cucumber, and sesame broth shot.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
    tags: ['Hydrating', 'Low Fat'],
    protein: 36,
    calories: 430,
  },
  {
    id: 4,
    title: 'Tofu Egg Scramble Wraps',
    description: 'Soft scramble wraps with avocado crema and probiotic slaw.',
    image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1200&q=80',
    tags: ['Plant Protein', 'Gut Support'],
    protein: 31,
    calories: 410,
  },
];

export const MOCK_LOGS: DailyLog[] = [
  { day: 'Mon', protein: 122, weight: 194, symptomFree: true },
  { day: 'Tue', protein: 135, weight: 193.4, symptomFree: true },
  { day: 'Wed', protein: 110, weight: 192.8, symptomFree: false },
  { day: 'Thu', protein: 140, weight: 192.2, symptomFree: true },
  { day: 'Fri', protein: 146, weight: 191.8, symptomFree: true },
  { day: 'Sat', protein: 129, weight: 191.6, symptomFree: true },
  { day: 'Sun', protein: 137, weight: 191.2, symptomFree: true },
];
