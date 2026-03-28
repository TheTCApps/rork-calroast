export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
}

export interface Meal {
  id: string;
  name: string;
  foods: FoodItem[];
  totalCalories: number;
}

export const SIGNIFICANT_FOODS: FoodItem[] = [
  {
    id: '1',
    name: 'Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    serving: '100g',
  },
  {
    id: '2',
    name: 'Brown Rice',
    calories: 112,
    protein: 2.6,
    carbs: 24,
    fat: 0.9,
    serving: '100g',
  },
  {
    id: '3',
    name: 'Broccoli',
    calories: 34,
    protein: 2.8,
    carbs: 7,
    fat: 0.4,
    serving: '100g',
  },
  {
    id: '4',
    name: 'Salmon',
    calories: 208,
    protein: 20,
    carbs: 0,
    fat: 13,
    serving: '100g',
  },
  {
    id: '5',
    name: 'Sweet Potato',
    calories: 86,
    protein: 1.6,
    carbs: 20,
    fat: 0.1,
    serving: '100g',
  },
  {
    id: '6',
    name: 'Eggs',
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
    serving: '2 large',
  },
  {
    id: '7',
    name: 'Greek Yogurt',
    calories: 59,
    protein: 10,
    carbs: 3.6,
    fat: 0.4,
    serving: '100g',
  },
  {
    id: '8',
    name: 'Oatmeal',
    calories: 71,
    protein: 2.5,
    carbs: 12,
    fat: 1.5,
    serving: '100g',
  },
  {
    id: '9',
    name: 'Almonds',
    calories: 579,
    protein: 21,
    carbs: 22,
    fat: 50,
    serving: '100g',
  },
  {
    id: '10',
    name: 'Banana',
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    serving: '1 medium',
  },
  {
    id: '11',
    name: 'Avocado',
    calories: 160,
    protein: 2,
    carbs: 9,
    fat: 15,
    serving: '100g',
  },
  {
    id: '12',
    name: 'Quinoa',
    calories: 120,
    protein: 4.4,
    carbs: 21,
    fat: 1.9,
    serving: '100g',
  },
  {
    id: '13',
    name: 'Tuna',
    calories: 132,
    protein: 28,
    carbs: 0,
    fat: 1.3,
    serving: '100g',
  },
  {
    id: '14',
    name: 'Spinach',
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    serving: '100g',
  },
  {
    id: '15',
    name: 'Apple',
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
    serving: '1 medium',
  },
  {
    id: '16',
    name: 'Beef (Lean)',
    calories: 250,
    protein: 26,
    carbs: 0,
    fat: 15,
    serving: '100g',
  },
  {
    id: '17',
    name: 'Pasta (Whole Wheat)',
    calories: 124,
    protein: 5.3,
    carbs: 26,
    fat: 0.5,
    serving: '100g',
  },
  {
    id: '18',
    name: 'Cottage Cheese',
    calories: 98,
    protein: 11,
    carbs: 3.4,
    fat: 4.3,
    serving: '100g',
  },
  {
    id: '19',
    name: 'Peanut Butter',
    calories: 588,
    protein: 25,
    carbs: 20,
    fat: 50,
    serving: '100g',
  },
  {
    id: '20',
    name: 'Orange',
    calories: 47,
    protein: 0.9,
    carbs: 12,
    fat: 0.1,
    serving: '1 medium',
  },
];
