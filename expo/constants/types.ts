export type WorkoutType = 'cardio' | 'strength' | 'stretching';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Workout {
  id: string;
  name: string;
  dayOfWeek: DayOfWeek;
  time: string;
  type: WorkoutType;
  date?: string;
}

export type MuscleGroup = 'chest' | 'back' | 'legs' | 'arms' | 'abs';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  description: string;
  technique: string[];
}

export type Gender = 'male' | 'female';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';

export interface UserStats {
  height: number;
  weight: number;
  age: number;
  gender: Gender;
  activityLevel: ActivityLevel;
}
