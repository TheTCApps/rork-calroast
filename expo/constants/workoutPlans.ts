import { DayOfWeek, WorkoutType } from './types';

export interface WorkoutPlanExercise {
  name: string;
  sets?: string;
  reps?: string;
  duration?: string;
}

export interface WorkoutPlanDay {
  day: DayOfWeek;
  name: string;
  type: WorkoutType;
  exercises: WorkoutPlanExercise[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  daysPerWeek: number;
  duration: string;
  goal: string;
  days: WorkoutPlanDay[];
}

export const WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: 'beginner-full-body',
    name: 'Beginner Full Body',
    description: 'Perfect for those new to fitness. Build strength and endurance with full-body workouts.',
    level: 'beginner',
    daysPerWeek: 3,
    duration: '45 min',
    goal: 'Build Foundation',
    days: [
      {
        day: 'monday',
        name: 'Full Body A',
        type: 'strength',
        exercises: [
          { name: 'Squats', sets: '3', reps: '10-12' },
          { name: 'Push-ups', sets: '3', reps: '8-10' },
          { name: 'Bent-Over Rows', sets: '3', reps: '10-12' },
          { name: 'Plank', duration: '30-45 sec' },
          { name: 'Walking', duration: '10 min' },
        ],
      },
      {
        day: 'wednesday',
        name: 'Full Body B',
        type: 'strength',
        exercises: [
          { name: 'Lunges', sets: '3', reps: '10-12 each leg' },
          { name: 'Dumbbell Press', sets: '3', reps: '10-12' },
          { name: 'Lat Pulldowns', sets: '3', reps: '10-12' },
          { name: 'Russian Twists', sets: '3', reps: '15 each side' },
          { name: 'Light Cardio', duration: '10 min' },
        ],
      },
      {
        day: 'friday',
        name: 'Full Body C',
        type: 'strength',
        exercises: [
          { name: 'Leg Press', sets: '3', reps: '12-15' },
          { name: 'Bench Press', sets: '3', reps: '8-10' },
          { name: 'Pull-ups (Assisted)', sets: '3', reps: '6-8' },
          { name: 'Crunches', sets: '3', reps: '15-20' },
          { name: 'Stretching', duration: '10 min' },
        ],
      },
    ],
  },
  {
    id: 'fat-burning',
    name: 'Fat Burning',
    description: 'High-intensity program focused on burning calories and losing fat.',
    level: 'intermediate',
    daysPerWeek: 5,
    duration: '45-60 min',
    goal: 'Fat Loss',
    days: [
      {
        day: 'monday',
        name: 'HIIT Cardio',
        type: 'cardio',
        exercises: [
          { name: 'Warm-up Jog', duration: '5 min' },
          { name: 'Sprint Intervals', duration: '20 min' },
          { name: 'Jump Rope', duration: '5 min' },
          { name: 'Burpees', sets: '3', reps: '10' },
          { name: 'Cool Down', duration: '5 min' },
        ],
      },
      {
        day: 'tuesday',
        name: 'Upper Body Circuit',
        type: 'strength',
        exercises: [
          { name: 'Push-ups', sets: '4', reps: '15' },
          { name: 'Dumbbell Rows', sets: '4', reps: '12' },
          { name: 'Shoulder Press', sets: '3', reps: '12' },
          { name: 'Tricep Dips', sets: '3', reps: '12' },
          { name: 'Bicep Curls', sets: '3', reps: '15' },
        ],
      },
      {
        day: 'wednesday',
        name: 'Cardio & Core',
        type: 'cardio',
        exercises: [
          { name: 'Running', duration: '25 min' },
          { name: 'Mountain Climbers', sets: '3', reps: '20' },
          { name: 'Plank', duration: '60 sec' },
          { name: 'Russian Twists', sets: '3', reps: '20 each side' },
          { name: 'Leg Raises', sets: '3', reps: '15' },
        ],
      },
      {
        day: 'thursday',
        name: 'Lower Body',
        type: 'strength',
        exercises: [
          { name: 'Squats', sets: '4', reps: '15' },
          { name: 'Lunges', sets: '4', reps: '12 each leg' },
          { name: 'Deadlifts', sets: '3', reps: '10' },
          { name: 'Calf Raises', sets: '3', reps: '20' },
          { name: 'Wall Sit', duration: '45 sec' },
        ],
      },
      {
        day: 'friday',
        name: 'Full Body HIIT',
        type: 'cardio',
        exercises: [
          { name: 'Warm-up', duration: '5 min' },
          { name: 'Burpees', sets: '4', reps: '15' },
          { name: 'Kettlebell Swings', sets: '4', reps: '20' },
          { name: 'Box Jumps', sets: '3', reps: '12' },
          { name: 'Battle Ropes', duration: '30 sec x 4' },
          { name: 'Cool Down Stretch', duration: '10 min' },
        ],
      },
    ],
  },
  {
    id: 'muscle-gain',
    name: 'Muscle Gain',
    description: 'Build lean muscle mass with split training focused on different muscle groups.',
    level: 'intermediate',
    daysPerWeek: 4,
    duration: '60 min',
    goal: 'Build Muscle',
    days: [
      {
        day: 'monday',
        name: 'Chest & Triceps',
        type: 'strength',
        exercises: [
          { name: 'Bench Press', sets: '4', reps: '8-10' },
          { name: 'Incline Dumbbell Press', sets: '4', reps: '10-12' },
          { name: 'Dumbbell Flyes', sets: '3', reps: '12' },
          { name: 'Tricep Dips', sets: '3', reps: '10-12' },
          { name: 'Overhead Tricep Extension', sets: '3', reps: '12' },
          { name: 'Cable Pushdowns', sets: '3', reps: '15' },
        ],
      },
      {
        day: 'tuesday',
        name: 'Back & Biceps',
        type: 'strength',
        exercises: [
          { name: 'Pull-ups', sets: '4', reps: '8-10' },
          { name: 'Bent-Over Rows', sets: '4', reps: '10-12' },
          { name: 'Lat Pulldowns', sets: '3', reps: '12' },
          { name: 'Seated Cable Rows', sets: '3', reps: '12' },
          { name: 'Barbell Curls', sets: '4', reps: '10-12' },
          { name: 'Hammer Curls', sets: '3', reps: '12' },
        ],
      },
      {
        day: 'thursday',
        name: 'Legs',
        type: 'strength',
        exercises: [
          { name: 'Squats', sets: '4', reps: '8-10' },
          { name: 'Leg Press', sets: '4', reps: '12' },
          { name: 'Romanian Deadlifts', sets: '3', reps: '10' },
          { name: 'Leg Curls', sets: '3', reps: '12' },
          { name: 'Leg Extensions', sets: '3', reps: '12' },
          { name: 'Calf Raises', sets: '4', reps: '15-20' },
        ],
      },
      {
        day: 'friday',
        name: 'Shoulders & Abs',
        type: 'strength',
        exercises: [
          { name: 'Military Press', sets: '4', reps: '8-10' },
          { name: 'Lateral Raises', sets: '4', reps: '12-15' },
          { name: 'Front Raises', sets: '3', reps: '12' },
          { name: 'Rear Delt Flyes', sets: '3', reps: '12' },
          { name: 'Plank', duration: '60 sec x 3' },
          { name: 'Russian Twists', sets: '3', reps: '20 each side' },
          { name: 'Leg Raises', sets: '3', reps: '15' },
        ],
      },
    ],
  },
];
