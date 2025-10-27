import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  useColorScheme,
} from 'react-native';
import { Calculator as CalcIcon, UtensilsCrossed, Plus, X } from 'lucide-react-native';
import { Gender, ActivityLevel } from '@/constants/types';
import Colors from '@/constants/colors';
import { SIGNIFICANT_FOODS, FoodItem } from '@/constants/mealData';

const ACTIVITY_LEVELS: { value: ActivityLevel; label: string; multiplier: number }[] = [
  { value: 'sedentary', label: 'Sedentary (little or no exercise)', multiplier: 1.2 },
  { value: 'light', label: 'Light (exercise 1-3 days/week)', multiplier: 1.375 },
  { value: 'moderate', label: 'Moderate (exercise 3-5 days/week)', multiplier: 1.55 },
  { value: 'active', label: 'Active (exercise 6-7 days/week)', multiplier: 1.725 },
  { value: 'veryActive', label: 'Very Active (intense exercise daily)', multiplier: 1.9 },
];

interface MealPlanItem {
  food: FoodItem;
  servings: number;
}

export default function CalculatorScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [results, setResults] = useState<{ bmr: number; tdee: number } | null>(null);
  const [showMealPlanner, setShowMealPlanner] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState<MealPlanItem[]>([]);
  const [targetCalories, setTargetCalories] = useState<number>(0);

  const calculateBMR = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseFloat(age);

    if (!h || !w || !a || h <= 0 || w <= 0 || a <= 0) {
      return;
    }

    let bmr: number;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a);
    } else {
      bmr = 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);
    }

    const activityMultiplier = ACTIVITY_LEVELS.find(al => al.value === activityLevel)?.multiplier || 1.2;
    const tdee = bmr * activityMultiplier;

    setResults({ bmr: Math.round(bmr), tdee: Math.round(tdee) });
  };

  const addFood = (food: FoodItem) => {
    const existing = selectedFoods.find(item => item.food.id === food.id);
    if (existing) {
      setSelectedFoods(
        selectedFoods.map(item =>
          item.food.id === food.id ? { ...item, servings: item.servings + 1 } : item
        )
      );
    } else {
      setSelectedFoods([...selectedFoods, { food, servings: 1 }]);
    }
  };

  const removeFood = (foodId: string) => {
    setSelectedFoods(selectedFoods.filter(item => item.food.id !== foodId));
  };

  const updateServings = (foodId: string, servings: number) => {
    if (servings <= 0) {
      removeFood(foodId);
    } else {
      setSelectedFoods(
        selectedFoods.map(item =>
          item.food.id === foodId ? { ...item, servings } : item
        )
      );
    }
  };

  const getTotalNutrition = () => {
    return selectedFoods.reduce(
      (acc, item) => ({
        calories: acc.calories + item.food.calories * item.servings,
        protein: acc.protein + item.food.protein * item.servings,
        carbs: acc.carbs + item.food.carbs * item.servings,
        fat: acc.fat + item.food.fat * item.servings,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const openMealPlanner = (calories: number) => {
    setTargetCalories(calories);
    setSelectedFoods([]);
    setShowMealPlanner(true);
  };

  const styles = getStyles(isDark);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <CalcIcon size={32} color={Colors.primary} />
          <Text style={styles.headerTitle}>Calorie Calculator</Text>
          <Text style={styles.headerSubtitle}>
            Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE)
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderButtons}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'male' && styles.genderButtonActive
                ]}
                onPress={() => setGender('male')}
              >
                <Text style={[
                  styles.genderButtonText,
                  gender === 'male' && styles.genderButtonTextActive
                ]}>
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'female' && styles.genderButtonActive
                ]}
                onPress={() => setGender('female')}
              >
                <Text style={[
                  styles.genderButtonText,
                  gender === 'female' && styles.genderButtonTextActive
                ]}>
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formGroup, styles.formGroupHalf]}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput
                style={styles.input}
                value={height}
                onChangeText={setHeight}
                placeholder="170"
                placeholderTextColor={Colors.gray}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.formGroup, styles.formGroupHalf]}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="70"
                placeholderTextColor={Colors.gray}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Age (years)</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="30"
              placeholderTextColor={Colors.gray}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Activity Level</Text>
            <View style={styles.activityLevels}>
              {ACTIVITY_LEVELS.map(level => (
                <TouchableOpacity
                  key={level.value}
                  style={[
                    styles.activityButton,
                    activityLevel === level.value && styles.activityButtonActive
                  ]}
                  onPress={() => setActivityLevel(level.value)}
                >
                  <Text style={[
                    styles.activityButtonText,
                    activityLevel === level.value && styles.activityButtonTextActive
                  ]}>
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.calculateButton} onPress={calculateBMR}>
            <Text style={styles.calculateButtonText}>Calculate</Text>
          </TouchableOpacity>
        </View>

        {results && (
          <View style={styles.results}>
            <Text style={styles.resultsTitle}>Your Results</Text>
            
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Basal Metabolic Rate (BMR)</Text>
              <Text style={styles.resultValue}>{results.bmr}</Text>
              <Text style={styles.resultUnit}>calories/day</Text>
              <Text style={styles.resultDescription}>
                The number of calories your body burns at rest
              </Text>
            </View>

            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Total Daily Energy Expenditure (TDEE)</Text>
              <Text style={styles.resultValue}>{results.tdee}</Text>
              <Text style={styles.resultUnit}>calories/day</Text>
              <Text style={styles.resultDescription}>
                The total calories you burn daily including activity
              </Text>
            </View>

            <View style={styles.recommendations}>
              <Text style={styles.recommendationsTitle}>Daily Calorie Recommendations</Text>
              <TouchableOpacity
                style={styles.recommendationRow}
                onPress={() => openMealPlanner(results.tdee - 500)}
              >
                <Text style={styles.recommendationLabel}>Weight Loss:</Text>
                <View style={styles.recommendationRight}>
                  <Text style={styles.recommendationValue}>{results.tdee - 500} cal/day</Text>
                  <UtensilsCrossed size={18} color={Colors.primary} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.recommendationRow}
                onPress={() => openMealPlanner(results.tdee)}
              >
                <Text style={styles.recommendationLabel}>Maintenance:</Text>
                <View style={styles.recommendationRight}>
                  <Text style={styles.recommendationValue}>{results.tdee} cal/day</Text>
                  <UtensilsCrossed size={18} color={Colors.primary} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.recommendationRow}
                onPress={() => openMealPlanner(results.tdee + 500)}
              >
                <Text style={styles.recommendationLabel}>Weight Gain:</Text>
                <View style={styles.recommendationRight}>
                  <Text style={styles.recommendationValue}>{results.tdee + 500} cal/day</Text>
                  <UtensilsCrossed size={18} color={Colors.primary} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showMealPlanner}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Plan Your Meals</Text>
            <TouchableOpacity onPress={() => setShowMealPlanner(false)}>
              <X size={28} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.targetCaloriesBar}>
            <Text style={styles.targetCaloriesLabel}>Target: {targetCalories} cal</Text>
            <Text style={styles.currentCaloriesLabel}>
              Current: {Math.round(getTotalNutrition().calories)} cal
            </Text>
          </View>

          {selectedFoods.length > 0 && (
            <View style={styles.nutritionSummary}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Protein</Text>
                <Text style={styles.nutritionValue}>{Math.round(getTotalNutrition().protein)}g</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Carbs</Text>
                <Text style={styles.nutritionValue}>{Math.round(getTotalNutrition().carbs)}g</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Fat</Text>
                <Text style={styles.nutritionValue}>{Math.round(getTotalNutrition().fat)}g</Text>
              </View>
            </View>
          )}

          <ScrollView style={styles.modalContent}>
            {selectedFoods.length > 0 && (
              <View style={styles.selectedFoodsSection}>
                <Text style={styles.sectionTitle}>Your Meal Plan</Text>
                {selectedFoods.map(item => (
                  <View key={item.food.id} style={styles.selectedFoodCard}>
                    <View style={styles.selectedFoodInfo}>
                      <Text style={styles.selectedFoodName}>{item.food.name}</Text>
                      <Text style={styles.selectedFoodDetails}>
                        {Math.round(item.food.calories * item.servings)} cal • {item.food.serving}
                      </Text>
                    </View>
                    <View style={styles.servingControls}>
                      <TouchableOpacity
                        style={styles.servingButton}
                        onPress={() => updateServings(item.food.id, item.servings - 1)}
                      >
                        <Text style={styles.servingButtonText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.servingText}>{item.servings}x</Text>
                      <TouchableOpacity
                        style={styles.servingButton}
                        onPress={() => updateServings(item.food.id, item.servings + 1)}
                      >
                        <Text style={styles.servingButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.foodsSection}>
              <Text style={styles.sectionTitle}>Add Foods</Text>
              <View style={styles.foodsGrid}>
                {SIGNIFICANT_FOODS.map(food => (
                  <TouchableOpacity
                    key={food.id}
                    style={styles.foodCard}
                    onPress={() => addFood(food)}
                  >
                    <Plus size={20} color={Colors.primary} style={styles.foodCardIcon} />
                    <Text style={styles.foodCardName}>{food.name}</Text>
                    <Text style={styles.foodCardCalories}>{food.calories} cal</Text>
                    <Text style={styles.foodCardServing}>{food.serving}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
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
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
    headerTitle: {
      fontSize: 28,
      fontWeight: '700' as const,
      color: isDark ? Colors.darkText : Colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
    headerSubtitle: {
      fontSize: 14,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
    form: {
      backgroundColor: isDark ? Colors.darkCard : Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formGroupHalf: {
    flex: 1,
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
  genderButtons: {
    flexDirection: 'row',
    gap: 12,
  },
    genderButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: isDark ? Colors.darkLightGray : Colors.lightGray,
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: Colors.primary,
  },
    genderButtonText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
    },
  genderButtonTextActive: {
    color: Colors.white,
  },
  activityLevels: {
    gap: 10,
  },
    activityButton: {
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: isDark ? Colors.darkLightGray : Colors.lightGray,
    },
  activityButtonActive: {
    backgroundColor: Colors.primary,
  },
    activityButtonText: {
      fontSize: 14,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
    },
  activityButtonTextActive: {
    color: Colors.white,
    fontWeight: '600' as const,
  },
  calculateButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  calculateButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  results: {
    gap: 16,
  },
    resultsTitle: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: isDark ? Colors.darkText : Colors.text,
    marginBottom: 8,
  },
    resultCard: {
      backgroundColor: isDark ? Colors.darkCard : Colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
    resultLabel: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  resultValue: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 4,
  },
    resultUnit: {
      fontSize: 16,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
    marginBottom: 12,
  },
    resultDescription: {
      fontSize: 13,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
    recommendations: {
      backgroundColor: isDark ? Colors.darkCard : Colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
    recommendationsTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: isDark ? Colors.darkText : Colors.text,
    marginBottom: 16,
  },
  recommendationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
      borderBottomColor: isDark ? Colors.darkBorder : Colors.lightGray,
    },
    recommendationLabel: {
      fontSize: 15,
      color: isDark ? Colors.darkText : Colors.text,
    },
  recommendationRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recommendationValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
    modalContainer: {
      flex: 1,
      backgroundColor: isDark ? Colors.darkBackground : Colors.background,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      paddingTop: 60,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? Colors.darkBorder : Colors.border,
      backgroundColor: isDark ? Colors.darkCard : Colors.white,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: isDark ? Colors.darkText : Colors.text,
    },
    targetCaloriesBar: {
      backgroundColor: isDark ? Colors.darkCard : Colors.white,
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? Colors.darkBorder : Colors.border,
    },
    targetCaloriesLabel: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: isDark ? Colors.darkText : Colors.text,
    },
  currentCaloriesLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
    nutritionSummary: {
      flexDirection: 'row',
      backgroundColor: isDark ? Colors.darkCard : Colors.white,
      padding: 16,
      justifyContent: 'space-around',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? Colors.darkBorder : Colors.border,
    },
  nutritionItem: {
    alignItems: 'center',
  },
    nutritionLabel: {
      fontSize: 12,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  modalContent: {
    flex: 1,
  },
    selectedFoodsSection: {
      padding: 20,
      backgroundColor: isDark ? Colors.darkCard : Colors.white,
      borderBottomWidth: 8,
      borderBottomColor: isDark ? Colors.darkBackground : Colors.background,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: isDark ? Colors.darkText : Colors.text,
    marginBottom: 16,
  },
    selectedFoodCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: isDark ? Colors.darkLightGray : Colors.lightGray,
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedFoodInfo: {
    flex: 1,
  },
    selectedFoodName: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: isDark ? Colors.darkText : Colors.text,
    marginBottom: 4,
  },
    selectedFoodDetails: {
      fontSize: 13,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
    },
  servingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  servingButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  servingButtonText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.white,
  },
    servingText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: isDark ? Colors.darkText : Colors.text,
    minWidth: 35,
    textAlign: 'center',
  },
  foodsSection: {
    padding: 20,
  },
  foodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
    foodCard: {
      width: '48%',
      backgroundColor: isDark ? Colors.darkCard : Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  foodCardIcon: {
    marginBottom: 8,
  },
    foodCardName: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: isDark ? Colors.darkText : Colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  foodCardCalories: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 2,
  },
    foodCardServing: {
      fontSize: 11,
      color: isDark ? Colors.darkTextSecondary : Colors.textSecondary,
    },
  });
}
