import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Calendar, Clock, Flame } from 'lucide-react-native';
import { useWorkouts } from '@/contexts/WorkoutContext';
import Colors from '@/constants/colors';

type TimeRange = 'week' | 'month';

export default function ProgressScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { workouts } = useWorkouts();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');

  const styles = getStyles(isDark);

  const stats = useMemo(() => {
    const now = new Date();
    const end = now;
    const start = new Date();
    
    if (timeRange === 'week') {
      start.setDate(now.getDate() - 7);
    } else {
      start.setDate(now.getDate() - 30);
    }
    
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    const frequencyByDay: Record<string, number> = {};
    days.forEach(day => {
      frequencyByDay[day] = 0;
    });

    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dayName = days[currentDate.getDay()];
      const dayWorkouts = workouts.filter(w => w.dayOfWeek === dayName);
      frequencyByDay[dayName] += dayWorkouts.length;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const typeBreakdown: Record<string, number> = {
      cardio: 0,
      strength: 0,
      stretching: 0,
    };

    workouts.forEach(workout => {
      typeBreakdown[workout.type] = (typeBreakdown[workout.type] || 0) + 1;
    });

    const totalWorkouts = Object.values(frequencyByDay).reduce((a, b) => a + b, 0);
    const avgPerDay = totalWorkouts / (timeRange === 'week' ? 7 : 30);
    
    const estimatedCaloriesBurned = totalWorkouts * 300;

    return {
      frequencyByDay,
      typeBreakdown,
      totalWorkouts,
      avgPerDay,
      estimatedCaloriesBurned,
    };
  }, [workouts, timeRange]);

  const maxFrequency = Math.max(...Object.values(stats.frequencyByDay), 1);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cardio': return Colors.cardio;
      case 'strength': return Colors.strength;
      case 'stretching': return Colors.stretching;
      default: return Colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={[styles.filterButton, timeRange === 'week' && styles.filterButtonActive]}
          onPress={() => setTimeRange('week')}
        >
          <Text style={[styles.filterText, timeRange === 'week' && styles.filterTextActive]}>
            Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, timeRange === 'month' && styles.filterButtonActive]}
          onPress={() => setTimeRange('month')}
        >
          <Text style={[styles.filterText, timeRange === 'month' && styles.filterTextActive]}>
            Month
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsOverview}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.primary + '20' }]}>
              <Calendar size={24} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>{stats.totalWorkouts}</Text>
            <Text style={styles.statLabel}>Total Workouts</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.success + '20' }]}>
              <Clock size={24} color={Colors.success} />
            </View>
            <Text style={styles.statValue}>{stats.avgPerDay.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Avg/Day</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.warning + '20' }]}>
              <Flame size={24} color={Colors.warning} />
            </View>
            <Text style={styles.statValue}>{stats.estimatedCaloriesBurned}</Text>
            <Text style={styles.statLabel}>Est. Calories</Text>
          </View>
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Workout Frequency by Day</Text>
          <View style={styles.barChart}>
            {Object.entries(stats.frequencyByDay).map(([day, count]) => {
              const height = (count / maxFrequency) * 150;
              return (
                <View key={day} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        { 
                          height: Math.max(height, 0),
                          backgroundColor: Colors.primary,
                        },
                      ]}
                    >
                      {count > 0 && (
                        <Text style={styles.barValue}>{count}</Text>
                      )}
                    </View>
                  </View>
                  <Text style={styles.barLabel}>
                    {day.slice(0, 3).toUpperCase()}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Workout Types</Text>
          <View style={styles.pieChartContainer}>
            {Object.entries(stats.typeBreakdown).map(([type, count]) => {
              if (count === 0) return null;
              const percentage = (count / Object.values(stats.typeBreakdown).reduce((a, b) => a + b, 0)) * 100;
              return (
                <View key={type} style={styles.typeRow}>
                  <View style={styles.typeInfo}>
                    <View
                      style={[
                        styles.typeIndicator,
                        { backgroundColor: getTypeColor(type) },
                      ]}
                    />
                    <Text style={styles.typeName}>{type}</Text>
                  </View>
                  <View style={styles.typeStats}>
                    <Text style={styles.typeCount}>{count} workouts</Text>
                    <Text style={styles.typePercentage}>{percentage.toFixed(0)}%</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {stats.totalWorkouts === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No workouts scheduled yet. Add workouts to see your progress!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function getStyles(isDark: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? Colors.darkBackground : Colors.background,
    },
    filterBar: {
      flexDirection: 'row',
      padding: 16,
      gap: 12,
      backgroundColor: isDark ? Colors.darkCard : Colors.white,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? Colors.darkBorder : Colors.border,
    },
    filterButton: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: isDark ? Colors.darkLightGray : Colors.lightGray,
      alignItems: 'center',
    },
    filterButtonActive: {
      backgroundColor: Colors.primary,
    },
    filterText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
    },
    filterTextActive: {
      color: Colors.white,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
    },
    statsOverview: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },
    statCard: {
      flex: 1,
      backgroundColor: isDark ? Colors.darkCard : Colors.white,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    statIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    statValue: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: isDark ? Colors.darkText : Colors.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
      textAlign: 'center',
    },
    chartSection: {
      backgroundColor: isDark ? Colors.darkCard : Colors.white,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    chartTitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: isDark ? Colors.darkText : Colors.text,
      marginBottom: 20,
    },
    barChart: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      height: 180,
      gap: 4,
    },
    barContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    barWrapper: {
      flex: 1,
      width: '100%',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    bar: {
      width: '80%',
      minHeight: 4,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingTop: 4,
    },
    barValue: {
      fontSize: 10,
      fontWeight: '700' as const,
      color: Colors.white,
    },
    barLabel: {
      fontSize: 10,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
      marginTop: 8,
      fontWeight: '600' as const,
    },
    pieChartContainer: {
      gap: 12,
    },
    typeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? Colors.darkBorder : Colors.lightGray,
    },
    typeInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    typeIndicator: {
      width: 16,
      height: 16,
      borderRadius: 8,
    },
    typeName: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: isDark ? Colors.darkText : Colors.text,
      textTransform: 'capitalize' as const,
    },
    typeStats: {
      alignItems: 'flex-end',
    },
    typeCount: {
      fontSize: 14,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
      marginBottom: 2,
    },
    typePercentage: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: Colors.primary,
    },
    emptyState: {
      padding: 40,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 14,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
      textAlign: 'center',
    },
  });
}
