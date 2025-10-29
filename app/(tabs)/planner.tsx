import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Platform,
  useColorScheme,
} from 'react-native';
import { Plus, Dumbbell, Trash2, Clock } from 'lucide-react-native';
import { useWorkouts } from '@/contexts/WorkoutContext';
import { Workout, WorkoutType, DayOfWeek } from '@/constants/types';
import Colors from '@/constants/colors';

const DAYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const WORKOUT_TYPES: WorkoutType[] = ['cardio', 'strength', 'stretching'];

export default function WorkoutPlannerScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { workouts, addWorkout, deleteWorkout } = useWorkouts();
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dayOfWeek: 'monday' as DayOfWeek,
    time: '',
    type: 'strength' as WorkoutType,
  });

  const handleAddWorkout = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter workout name');
      return;
    }
    if (!formData.time.trim()) {
      Alert.alert('Error', 'Please enter workout time');
      return;
    }

    const newWorkout: Workout = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      dayOfWeek: formData.dayOfWeek,
      time: formData.time.trim(),
      type: formData.type,
    };

    addWorkout(newWorkout);
    setFormData({ name: '', dayOfWeek: 'monday', time: '', type: 'strength' });
    setModalVisible(false);
  };

  const handleDeleteWorkout = (id: string, name: string) => {
    if (Platform.OS === 'web') {
      if (confirm(`Delete "${name}"?`)) {
        deleteWorkout(id);
      }
    } else {
      Alert.alert(
        'Delete Workout',
        `Are you sure you want to delete "${name}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => deleteWorkout(id) },
        ]
      );
    }
  };

  const getTypeColor = (type: WorkoutType) => {
    switch (type) {
      case 'cardio': return Colors.cardio;
      case 'strength': return Colors.strength;
      case 'stretching': return Colors.stretching;
      default: return Colors.primary;
    }
  };

  const groupedWorkouts = DAYS.reduce((acc, day) => {
    acc[day] = workouts.filter(w => w.dayOfWeek === day);
    return acc;
  }, {} as Record<DayOfWeek, Workout[]>);

  const styles = getStyles(isDark);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {DAYS.map(day => (
          <View key={day} style={styles.daySection}>
            <Text style={styles.dayTitle}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
            {groupedWorkouts[day].length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No workouts scheduled</Text>
              </View>
            ) : (
              groupedWorkouts[day].map(workout => (
                <View key={workout.id} style={styles.workoutCard}>
                  <View style={[styles.typeIndicator, { backgroundColor: getTypeColor(workout.type) }]} />
                  <View style={styles.workoutInfo}>
                    <Text style={styles.workoutName}>{workout.name}</Text>
                    <View style={styles.workoutMeta}>
                      <Clock size={14} color={Colors.textSecondary} />
                      <Text style={styles.workoutTime}>{workout.time}</Text>
                      <View style={styles.typeBadge}>
                        <Text style={styles.typeBadgeText}>{workout.type}</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteWorkout(workout.id, workout.name)}
                    style={styles.deleteButton}
                  >
                    <Trash2 size={20} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Plus size={28} color={Colors.white} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Dumbbell size={24} color={Colors.primary} />
              <Text style={styles.modalTitle}>New Workout</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Workout Name</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="e.g., Morning Run"
                placeholderTextColor={Colors.gray}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Day of Week</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
                {DAYS.map(day => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.optionButton,
                      formData.dayOfWeek === day && styles.optionButtonActive
                    ]}
                    onPress={() => setFormData({ ...formData, dayOfWeek: day })}
                  >
                    <Text style={[
                      styles.optionText,
                      formData.dayOfWeek === day && styles.optionTextActive
                    ]}>
                      {day.slice(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Time</Text>
              <TextInput
                style={styles.input}
                value={formData.time}
                onChangeText={(text) => setFormData({ ...formData, time: text })}
                placeholder="e.g., 07:00 AM"
                placeholderTextColor={Colors.gray}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Workout Type</Text>
              <View style={styles.typeOptions}>
                {WORKOUT_TYPES.map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      formData.type === type && { backgroundColor: getTypeColor(type) }
                    ]}
                    onPress={() => setFormData({ ...formData, type })}
                  >
                    <Text style={[
                      styles.typeButtonText,
                      formData.type === type && styles.typeButtonTextActive
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setFormData({ name: '', dayOfWeek: 'monday', time: '', type: 'strength' });
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={handleAddWorkout}
              >
                <Text style={styles.addButtonText}>Add Workout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function getStyles(isDark: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? Colors.darkBackground : Colors.background,
    },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  daySection: {
    marginBottom: 24,
  },
    dayTitle: {
      fontSize: 20,
      fontWeight: '600' as const,
      color: isDark ? Colors.darkText : Colors.text,
      marginBottom: 12,
    },
    emptyState: {
      backgroundColor: isDark ? Colors.darkLightGray : Colors.lightGray,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
    emptyText: {
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
    fontSize: 14,
  },
    workoutCard: {
      flexDirection: 'row',
      backgroundColor: isDark ? Colors.darkCard : Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  typeIndicator: {
    width: 4,
    height: 48,
    borderRadius: 2,
    marginRight: 12,
  },
  workoutInfo: {
    flex: 1,
  },
    workoutName: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: isDark ? Colors.darkText : Colors.text,
      marginBottom: 6,
    },
  workoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
    workoutTime: {
      fontSize: 14,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
      marginRight: 8,
    },
    typeBadge: {
      backgroundColor: isDark ? Colors.darkLightGray : Colors.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
    typeBadgeText: {
      fontSize: 12,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
    textTransform: 'capitalize' as const,
  },
  deleteButton: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
    modalTitle: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: isDark ? Colors.darkText : Colors.text,
    },
  formGroup: {
    marginBottom: 20,
  },
    label: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: isDark ? Colors.darkText : Colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: isDark ? Colors.darkLightGray : Colors.lightGray,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: isDark ? Colors.darkText : Colors.text,
    },
  optionsScroll: {
    flexGrow: 0,
  },
    optionButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: isDark ? Colors.darkLightGray : Colors.lightGray,
      marginRight: 8,
    },
  optionButtonActive: {
    backgroundColor: Colors.primary,
  },
    optionText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
    textTransform: 'capitalize' as const,
  },
  optionTextActive: {
    color: Colors.white,
  },
  typeOptions: {
    flexDirection: 'row',
    gap: 10,
  },
    typeButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: isDark ? Colors.darkLightGray : Colors.lightGray,
      alignItems: 'center',
    },
    typeButtonText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
    textTransform: 'capitalize' as const,
  },
  typeButtonTextActive: {
    color: Colors.white,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
    cancelButton: {
      backgroundColor: isDark ? Colors.darkLightGray : Colors.lightGray,
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: isDark ? Colors.darkText : Colors.text,
    },
  addButton: {
    backgroundColor: Colors.primary,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
      color: Colors.white,
    },
  });
}
