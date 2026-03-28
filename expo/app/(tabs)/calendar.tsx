import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react-native';
import { useWorkouts } from '@/contexts/WorkoutContext';
import Colors from '@/constants/colors';
import { Workout, WorkoutType } from '@/constants/types';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { workouts } = useWorkouts();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getDayWorkouts = (date: Date): Workout[] => {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayOfWeek = dayNames[date.getDay()];
    return workouts.filter(w => w.dayOfWeek === dayOfWeek);
  };

  const hasWorkouts = (date: Date): boolean => {
    return getDayWorkouts(date).length > 0;
  };

  const days = useMemo(() => getDaysInMonth(currentDate), [currentDate]);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const getTypeColor = (type: WorkoutType) => {
    switch (type) {
      case 'cardio': return Colors.cardio;
      case 'strength': return Colors.strength;
      case 'stretching': return Colors.stretching;
      default: return Colors.primary;
    }
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSameDay = (date1: Date | null, date2: Date | null): boolean => {
    if (!date1 || !date2) return false;
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const selectedDayWorkouts = selectedDate ? getDayWorkouts(selectedDate) : [];

  const styles = getStyles(isDark);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={previousMonth} style={styles.navButton}>
          <ChevronLeft size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Text>
        <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
          <ChevronRight size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.weekDays}>
        {DAYS_OF_WEEK.map(day => (
          <View key={day} style={styles.weekDayCell}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.calendar}>
        {days.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayCell,
              !day && styles.emptyCell,
              day && isToday(day) && styles.todayCell,
              day && isSameDay(day, selectedDate) && styles.selectedCell,
            ]}
            onPress={() => day && setSelectedDate(day)}
            disabled={!day}
          >
            {day && (
              <>
                <Text style={[
                  styles.dayText,
                  isToday(day) && styles.todayText,
                  isSameDay(day, selectedDate) && styles.selectedText,
                ]}>
                  {day.getDate()}
                </Text>
                {hasWorkouts(day) && (
                  <View style={styles.workoutDot} />
                )}
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {selectedDate && (
        <View style={styles.detailsSection}>
          <View style={styles.detailsHeader}>
            <CalendarIcon size={20} color={Colors.primary} />
            <Text style={styles.detailsTitle}>
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
          </View>

          <ScrollView style={styles.workoutsList}>
            {selectedDayWorkouts.length === 0 ? (
              <View style={styles.noWorkouts}>
                <Text style={styles.noWorkoutsText}>No workouts scheduled for this day</Text>
              </View>
            ) : (
              selectedDayWorkouts.map(workout => (
                <View key={workout.id} style={styles.workoutItem}>
                  <View style={[styles.workoutIndicator, { backgroundColor: getTypeColor(workout.type) }]} />
                  <View style={styles.workoutContent}>
                    <Text style={styles.workoutName}>{workout.name}</Text>
                    <Text style={styles.workoutTime}>{workout.time}</Text>
                  </View>
                  <View style={[styles.workoutTypeBadge, { backgroundColor: getTypeColor(workout.type) }]}>
                    <Text style={styles.workoutTypeBadgeText}>{workout.type}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

function getStyles(isDark: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? Colors.darkBackground : Colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: isDark ? Colors.darkCard : Colors.white,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? Colors.darkBorder : Colors.border,
    },
  navButton: {
    padding: 8,
  },
    headerText: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: isDark ? Colors.darkText : Colors.text,
    },
    weekDays: {
      flexDirection: 'row',
      backgroundColor: isDark ? Colors.darkCard : Colors.white,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? Colors.darkBorder : Colors.border,
    },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
  },
    weekDayText: {
      fontSize: 12,
      fontWeight: '600' as const,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
    },
    calendar: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      backgroundColor: isDark ? Colors.darkCard : Colors.white,
      padding: 4,
    },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  emptyCell: {
    backgroundColor: 'transparent',
  },
  todayCell: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
  },
  selectedCell: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
    dayText: {
      fontSize: 16,
      color: isDark ? Colors.darkText : Colors.text,
    },
  todayText: {
    color: Colors.white,
    fontWeight: '600' as const,
  },
  selectedText: {
    color: Colors.white,
    fontWeight: '700' as const,
  },
  workoutDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
    detailsSection: {
      flex: 1,
      backgroundColor: isDark ? Colors.darkBackground : Colors.background,
      borderTopWidth: 1,
      borderTopColor: isDark ? Colors.darkBorder : Colors.border,
    },
    detailsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      gap: 8,
      backgroundColor: isDark ? Colors.darkCard : Colors.white,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? Colors.darkBorder : Colors.border,
    },
    detailsTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: isDark ? Colors.darkText : Colors.text,
    },
  workoutsList: {
    flex: 1,
    padding: 16,
  },
  noWorkouts: {
    alignItems: 'center',
    paddingVertical: 40,
  },
    noWorkoutsText: {
      fontSize: 14,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
    },
    workoutItem: {
      flexDirection: 'row',
      backgroundColor: isDark ? Colors.darkCard : Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  workoutIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  workoutContent: {
    flex: 1,
  },
    workoutName: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: isDark ? Colors.darkText : Colors.text,
      marginBottom: 4,
    },
    workoutTime: {
      fontSize: 14,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
    },
  workoutTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  workoutTypeBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.white,
      textTransform: 'capitalize' as const,
    },
  });
}
