import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert, Platform, useColorScheme } from 'react-native';
import { ChevronRight, X, Calendar as CalendarIcon, Clock, Target, Plus } from 'lucide-react-native';
import { EXERCISES } from '@/constants/exercises';
import { MuscleGroup } from '@/constants/types';
import { WORKOUT_PLANS, WorkoutPlan } from '@/constants/workoutPlans';
import { useWorkouts } from '@/contexts/WorkoutContext';
import Colors from '@/constants/colors';

const MUSCLE_GROUPS: { id: MuscleGroup; name: string; icon: string }[] = [
  { id: 'chest', name: 'Chest', icon: '💪' },
  { id: 'back', name: 'Back', icon: '🔥' },
  { id: 'legs', name: 'Legs', icon: '🦵' },
  { id: 'arms', name: 'Arms', icon: '💪' },
  { id: 'abs', name: 'Abs', icon: '⚡' },
];

type ViewMode = 'exercises' | 'plans';

export default function ExercisesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { addWorkout } = useWorkouts();
  const [viewMode, setViewMode] = useState<ViewMode>('exercises');
  const [selectedGroup, setSelectedGroup] = useState<MuscleGroup | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);

  const exercises = selectedGroup 
    ? EXERCISES.filter(e => e.muscleGroup === selectedGroup)
    : [];

  const exercise = selectedExercise 
    ? EXERCISES.find(e => e.id === selectedExercise) 
    : null;

  const styles = getStyles(isDark);

  const handleAddPlan = (plan: WorkoutPlan) => {
    plan.days.forEach((day, index) => {
      const workout = {
        id: `${Date.now()}-${index}`,
        name: day.name,
        dayOfWeek: day.day,
        time: '09:00 AM',
        type: day.type,
      };
      addWorkout(workout);
    });

    if (Platform.OS === 'web') {
      alert(`"${plan.name}" plan added to your planner!`);
    } else {
      Alert.alert('Success', `"${plan.name}" plan added to your planner!`);
    }
    setSelectedPlan(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'exercises' && styles.tabActive]}
          onPress={() => setViewMode('exercises')}
        >
          <Text style={[styles.tabText, viewMode === 'exercises' && styles.tabTextActive]}>
            Exercises
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'plans' && styles.tabActive]}
          onPress={() => setViewMode('plans')}
        >
          <Text style={[styles.tabText, viewMode === 'plans' && styles.tabTextActive]}>
            Workout Plans
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {viewMode === 'exercises' ? (
          <>
        <Text style={styles.sectionTitle}>Muscle Groups</Text>
        <View style={styles.groupGrid}>
          {MUSCLE_GROUPS.map(group => (
            <TouchableOpacity
              key={group.id}
              style={[
                styles.groupCard,
                selectedGroup === group.id && styles.groupCardActive
              ]}
              onPress={() => setSelectedGroup(group.id)}
            >
              <Text style={styles.groupIcon}>{group.icon}</Text>
              <Text style={[
                styles.groupName,
                selectedGroup === group.id && styles.groupNameActive
              ]}>
                {group.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedGroup && (
          <>
            <Text style={styles.sectionTitle}>
              {MUSCLE_GROUPS.find(g => g.id === selectedGroup)?.name} Exercises
            </Text>
            <View style={styles.exercisesList}>
              {exercises.map(ex => (
                <TouchableOpacity
                  key={ex.id}
                  style={styles.exerciseCard}
                  onPress={() => setSelectedExercise(ex.id)}
                >
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{ex.name}</Text>
                    <Text style={styles.exerciseDescription} numberOfLines={2}>
                      {ex.description}
                    </Text>
                  </View>
                  <ChevronRight size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Workout Plans</Text>
            <Text style={styles.sectionDescription}>
              Choose a plan that matches your fitness goals and add it to your planner
            </Text>
            <View style={styles.plansList}>
              {WORKOUT_PLANS.map(plan => (
                <TouchableOpacity
                  key={plan.id}
                  style={styles.planCard}
                  onPress={() => setSelectedPlan(plan)}
                >
                  <View style={styles.planHeader}>
                    <View style={styles.planTitleRow}>
                      <Text style={styles.planName}>{plan.name}</Text>
                      <View style={[styles.levelBadge, { backgroundColor: getLevelColor(plan.level) }]}>
                        <Text style={styles.levelText}>{plan.level}</Text>
                      </View>
                    </View>
                    <Text style={styles.planDescription}>{plan.description}</Text>
                  </View>
                  
                  <View style={styles.planMeta}>
                    <View style={styles.planMetaItem}>
                      <CalendarIcon size={16} color={Colors.primary} />
                      <Text style={styles.planMetaText}>{plan.daysPerWeek} days/week</Text>
                    </View>
                    <View style={styles.planMetaItem}>
                      <Clock size={16} color={Colors.primary} />
                      <Text style={styles.planMetaText}>{plan.duration}</Text>
                    </View>
                    <View style={styles.planMetaItem}>
                      <Target size={16} color={Colors.primary} />
                      <Text style={styles.planMetaText}>{plan.goal}</Text>
                    </View>
                  </View>

                  <ChevronRight size={20} color={Colors.textSecondary} style={styles.planArrow} />
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <Modal
        visible={!!exercise}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedExercise(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{exercise?.name}</Text>
              <TouchableOpacity
                onPress={() => setSelectedExercise(null)}
                style={styles.closeButton}
              >
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.descriptionSection}>
                <Text style={styles.descriptionTitle}>Description</Text>
                <Text style={styles.descriptionText}>{exercise?.description}</Text>
              </View>

              <View style={styles.techniqueSection}>
                <Text style={styles.techniqueTitle}>Technique</Text>
                {exercise?.technique.map((step, index) => (
                  <View key={index} style={styles.techniqueStep}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={!!selectedPlan}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedPlan(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>{selectedPlan?.name}</Text>
                <View style={[styles.levelBadge, { backgroundColor: getLevelColor(selectedPlan?.level || 'beginner'), marginTop: 8 }]}>
                  <Text style={styles.levelText}>{selectedPlan?.level}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedPlan(null)}
                style={styles.closeButton}
              >
                <X size={24} color={isDark ? Colors.darkText : Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.planDetailsMeta}>
                <View style={styles.planDetailsMetaItem}>
                  <CalendarIcon size={20} color={Colors.primary} />
                  <Text style={styles.planDetailsMetaText}>{selectedPlan?.daysPerWeek} days/week</Text>
                </View>
                <View style={styles.planDetailsMetaItem}>
                  <Clock size={20} color={Colors.primary} />
                  <Text style={styles.planDetailsMetaText}>{selectedPlan?.duration}</Text>
                </View>
                <View style={styles.planDetailsMetaItem}>
                  <Target size={20} color={Colors.primary} />
                  <Text style={styles.planDetailsMetaText}>{selectedPlan?.goal}</Text>
                </View>
              </View>

              <Text style={styles.planDetailsDescription}>{selectedPlan?.description}</Text>

              <Text style={styles.planDaysTitle}>Weekly Schedule</Text>
              {selectedPlan?.days.map((day, index) => (
                <View key={index} style={styles.planDayCard}>
                  <View style={styles.planDayHeader}>
                    <Text style={styles.planDayName}>
                      {day.day.charAt(0).toUpperCase() + day.day.slice(1)}
                    </Text>
                    <View style={[styles.typeBadgeSmall, { backgroundColor: getTypeColor(day.type) }]}>
                      <Text style={styles.typeBadgeTextSmall}>{day.type}</Text>
                    </View>
                  </View>
                  <Text style={styles.planDayTitle}>{day.name}</Text>
                  <View style={styles.planExercises}>
                    {day.exercises.map((exercise, exIndex) => (
                      <View key={exIndex} style={styles.planExerciseRow}>
                        <Text style={styles.planExerciseName}>{exercise.name}</Text>
                        <Text style={styles.planExerciseDetails}>
                          {exercise.sets && exercise.reps ? `${exercise.sets}×${exercise.reps}` : exercise.duration}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={styles.addPlanButton}
                onPress={() => selectedPlan && handleAddPlan(selectedPlan)}
              >
                <Plus size={20} color={Colors.white} />
                <Text style={styles.addPlanButtonText}>Add to My Planner</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function getLevelColor(level: string) {
  switch (level) {
    case 'beginner': return Colors.success;
    case 'intermediate': return Colors.warning;
    case 'advanced': return Colors.error;
    default: return Colors.gray;
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case 'cardio': return Colors.cardio;
    case 'strength': return Colors.strength;
    case 'stretching': return Colors.stretching;
    default: return Colors.primary;
  }
}

function getStyles(isDark: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? Colors.darkBackground : Colors.background,
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: isDark ? Colors.darkCard : Colors.white,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? Colors.darkBorder : Colors.border,
    },
    tab: {
      flex: 1,
      paddingVertical: 16,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    tabActive: {
      borderBottomColor: Colors.primary,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
    },
    tabTextActive: {
      color: Colors.primary,
    },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
    sectionTitle: {
      fontSize: 22,
      fontWeight: '700' as const,
      color: isDark ? Colors.darkText : Colors.text,
      marginBottom: 16,
      marginTop: 8,
    },
    sectionDescription: {
      fontSize: 14,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
      marginBottom: 20,
      lineHeight: 20,
    },
  groupGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
    groupCard: {
      width: '31%',
      aspectRatio: 1,
      backgroundColor: isDark ? Colors.darkCard : Colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  groupCardActive: {
    backgroundColor: Colors.primary,
  },
  groupIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
    groupName: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: isDark ? Colors.darkText : Colors.text,
      textAlign: 'center',
    },
  groupNameActive: {
    color: Colors.white,
  },
  exercisesList: {
    gap: 12,
  },
    exerciseCard: {
      flexDirection: 'row',
      backgroundColor: isDark ? Colors.darkCard : Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  exerciseInfo: {
    flex: 1,
    marginRight: 12,
  },
    exerciseName: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: isDark ? Colors.darkText : Colors.text,
      marginBottom: 4,
    },
    exerciseDescription: {
      fontSize: 14,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
      lineHeight: 20,
    },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
    modalContent: {
      backgroundColor: isDark ? Colors.darkCard : Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 24,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? Colors.darkBorder : Colors.border,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: isDark ? Colors.darkText : Colors.text,
      flex: 1,
    },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 24,
  },
  descriptionSection: {
    marginBottom: 24,
  },
    descriptionTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: isDark ? Colors.darkText : Colors.text,
      marginBottom: 8,
    },
    descriptionText: {
      fontSize: 16,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
      lineHeight: 24,
    },
  techniqueSection: {
    marginBottom: 24,
  },
    techniqueTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: isDark ? Colors.darkText : Colors.text,
      marginBottom: 16,
    },
  techniqueStep: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.white,
  },
    stepText: {
      flex: 1,
      fontSize: 15,
      color: isDark ? Colors.darkText : Colors.text,
      lineHeight: 22,
    },
    plansList: {
      gap: 16,
    },
    planCard: {
      backgroundColor: isDark ? Colors.darkCard : Colors.white,
      borderRadius: 16,
      padding: 20,
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
      position: 'relative',
    },
    planHeader: {
      marginBottom: 16,
    },
    planTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    planName: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: isDark ? Colors.darkText : Colors.text,
      flex: 1,
    },
    levelBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    levelText: {
      fontSize: 11,
      fontWeight: '700' as const,
      color: Colors.white,
      textTransform: 'uppercase' as const,
    },
    planDescription: {
      fontSize: 14,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
      lineHeight: 20,
    },
    planMeta: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
    },
    planMetaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    planMetaText: {
      fontSize: 13,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
      fontWeight: '600' as const,
    },
    planArrow: {
      position: 'absolute',
      right: 20,
      top: '50%',
    },
    planDetailsMeta: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      marginBottom: 20,
      padding: 16,
      backgroundColor: isDark ? Colors.darkLightGray : Colors.lightGray,
      borderRadius: 12,
    },
    planDetailsMetaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    planDetailsMetaText: {
      fontSize: 14,
      color: isDark ? Colors.darkText : Colors.text,
      fontWeight: '600' as const,
    },
    planDetailsDescription: {
      fontSize: 15,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
      lineHeight: 22,
      marginBottom: 24,
    },
    planDaysTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: isDark ? Colors.darkText : Colors.text,
      marginBottom: 16,
    },
    planDayCard: {
      backgroundColor: isDark ? Colors.darkLightGray : Colors.lightGray,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    planDayHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    planDayName: {
      fontSize: 14,
      fontWeight: '700' as const,
      color: Colors.primary,
      textTransform: 'uppercase' as const,
    },
    planDayTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: isDark ? Colors.darkText : Colors.text,
      marginBottom: 12,
    },
    typeBadgeSmall: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
    },
    typeBadgeTextSmall: {
      fontSize: 10,
      fontWeight: '600' as const,
      color: Colors.white,
      textTransform: 'capitalize' as const,
    },
    planExercises: {
      gap: 8,
    },
    planExerciseRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    planExerciseName: {
      fontSize: 14,
      color: isDark ? Colors.darkText : Colors.text,
      flex: 1,
    },
    planExerciseDetails: {
      fontSize: 13,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
      fontWeight: '600' as const,
    },
    addPlanButton: {
      flexDirection: 'row',
      backgroundColor: Colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 24,
      gap: 8,
    },
    addPlanButtonText: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: Colors.white,
    },
  });
}
