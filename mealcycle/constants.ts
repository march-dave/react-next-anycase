import type { DailyLog } from './types'

export const MOCK_MEALS = [
  {
    id: 1,
    title: 'Lemon Herb Salmon Bowl',
    description: 'Easy-to-digest salmon, quinoa, and roasted zucchini with ginger vinaigrette.',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
    tags: ['High Protein', 'Low GI', 'Nausea Friendly'],
    protein: 42,
    calories: 510,
  },
  {
    id: 2,
    title: 'Chicken Yogurt Power Plate',
    description: 'Grilled chicken breast, herbed greek yogurt, cucumber, and warm sweet potato.',
    image:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80',
    tags: ['High Protein', 'Gut Friendly'],
    protein: 46,
    calories: 540,
  },
  {
    id: 3,
    title: 'Tofu Miso Recovery Box',
    description: 'Soft tofu, edamame mash, jasmine rice, and steamed greens with mild miso.',
    image:
      'https://images.unsplash.com/photo-1604908554027-251d9f5fddd9?auto=format&fit=crop&w=1200&q=80',
    tags: ['Plant Protein', 'Low Fat', 'Nausea Friendly'],
    protein: 33,
    calories: 430,
  },
  {
    id: 4,
    title: 'Turkey Egg White Breakfast Kit',
    description: 'Egg white bites, sliced turkey, overnight oats, and berries.',
    image:
      'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1200&q=80',
    tags: ['High Protein', 'Morning Fuel'],
    protein: 39,
    calories: 470,
  },
]

export const MOCK_LOGS: DailyLog[] = [
  { day: 'Mon', protein: 118, weight: 199, nausea: 1 },
  { day: 'Tue', protein: 132, weight: 198.8, nausea: 0 },
  { day: 'Wed', protein: 126, weight: 198.2, nausea: 1 },
  { day: 'Thu', protein: 142, weight: 197.7, nausea: 0 },
  { day: 'Fri', protein: 136, weight: 197.4, nausea: 0 },
  { day: 'Sat', protein: 147, weight: 197.2, nausea: 0 },
  { day: 'Sun', protein: 139, weight: 196.9, nausea: 1 },
]

export const MEDICATIONS = ['Ozempic', 'Mounjaro', 'Wegovy', 'Zepbound', 'Other'] as const
export const DOSAGE_STAGES = ['Initiation', 'Titration', 'Maintenance'] as const
