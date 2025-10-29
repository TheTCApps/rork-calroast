import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Workout } from '@/constants/types';

const STORAGE_KEY = '@calroast_workouts';

export const [WorkoutProvider, useWorkouts] = createContextHook(() => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const workoutsQuery = useQuery({
    queryKey: ['workouts'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
  });

  const { mutate: saveWorkouts, isPending: isSaving } = useMutation({
    mutationFn: async (updatedWorkouts: Workout[]) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWorkouts));
      return updatedWorkouts;
    }
  });

  useEffect(() => {
    if (workoutsQuery.data) {
      setWorkouts(workoutsQuery.data);
    }
  }, [workoutsQuery.data]);

  const addWorkout = useCallback((workout: Workout) => {
    const updated = [...workouts, workout];
    setWorkouts(updated);
    saveWorkouts(updated);
  }, [workouts, saveWorkouts]);

  const updateWorkout = useCallback((id: string, workout: Partial<Workout>) => {
    const updated = workouts.map((w) => (w.id === id ? { ...w, ...workout } : w));
    setWorkouts(updated);
    saveWorkouts(updated);
  }, [workouts, saveWorkouts]);

  const deleteWorkout = useCallback((id: string) => {
    const updated = workouts.filter((w) => w.id !== id);
    setWorkouts(updated);
    saveWorkouts(updated);
  }, [workouts, saveWorkouts]);

  const getWorkoutsByDay = useCallback((dayOfWeek: string) => {
    return workouts.filter((w) => w.dayOfWeek === dayOfWeek.toLowerCase());
  }, [workouts]);

  const getWorkoutsByDate = useCallback((date: string) => {
    return workouts.filter((w) => w.date === date);
  }, [workouts]);

  return useMemo(() => ({
    workouts,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    getWorkoutsByDay,
    getWorkoutsByDate,
    isLoading: workoutsQuery.isLoading,
    isSaving,
  }), [workouts, addWorkout, updateWorkout, deleteWorkout, getWorkoutsByDay, getWorkoutsByDate, workoutsQuery.isLoading, isSaving]);
});
