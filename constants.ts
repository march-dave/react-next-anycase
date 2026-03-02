export const MOCK_MEALS = [
  {
    id: 'meal-1',
    title: 'Lemon Herb Chicken Bowl',
    description: 'Tender chicken, quinoa, spinach, and roasted zucchini for easy digestion.',
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    tags: ['High Protein', 'Low GI'],
    protein: 42,
    calories: 510,
  },
  {
    id: 'meal-2',
    title: 'Ginger Salmon Recovery Plate',
    description: 'Omega-rich salmon with sweet potato mash and steamed asparagus.',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
    tags: ['Anti-Nausea', 'Nutrient Dense'],
    protein: 38,
    calories: 470,
  },
  {
    id: 'meal-3',
    title: 'Turkey & Lentil Comfort Stew',
    description: 'Slow-cooked turkey with lentils and carrots for gentle, sustained energy.',
    image:
      'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1200&q=80',
    tags: ['High Protein', 'Fiber Forward'],
    protein: 36,
    calories: 430,
  },
  {
    id: 'meal-4',
    title: 'Greek Yogurt Power Parfait',
    description: 'High-protein yogurt layered with chia, berries, and almonds.',
    image:
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80',
    tags: ['Snack Option', 'Protein Boost'],
    protein: 28,
    calories: 320,
  },
];

export const MOCK_LOGS = [
  { day: 'Mon', protein: 126, weight: 197, symptomFree: true },
  { day: 'Tue', protein: 134, weight: 196.4, symptomFree: true },
  { day: 'Wed', protein: 119, weight: 196, symptomFree: false },
  { day: 'Thu', protein: 141, weight: 195.6, symptomFree: true },
  { day: 'Fri', protein: 138, weight: 195.2, symptomFree: true },
  { day: 'Sat', protein: 144, weight: 194.9, symptomFree: true },
  { day: 'Sun', protein: 132, weight: 194.5, symptomFree: true },
];
