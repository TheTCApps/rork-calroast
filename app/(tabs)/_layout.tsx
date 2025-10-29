import { Tabs } from 'expo-router';
import { Dumbbell, Calendar, Activity, Calculator, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: isDark ? Colors.darkGray : Colors.gray,
        headerShown: true,
        headerStyle: {
          backgroundColor: isDark ? Colors.darkBackground : Colors.white,
        },
        headerTitleStyle: {
          fontWeight: '600' as const,
          fontSize: 18,
          color: isDark ? Colors.darkText : Colors.text,
        },
        tabBarStyle: {
          backgroundColor: isDark ? Colors.darkCard : Colors.white,
          borderTopWidth: 1,
          borderTopColor: isDark ? Colors.darkBorder : Colors.border,
          height: 120,
          paddingBottom: 25,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600' as const,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="planner"
        options={{
          title: 'Planner',
          headerTitle: 'Workout Planner',
          tabBarIcon: ({ color }) => <Dumbbell size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          headerTitle: 'Workout Calendar',
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Exercises',
          headerTitle: 'Exercise Library',
          tabBarIcon: ({ color }) => <Activity size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          title: 'Calculator',
          headerTitle: 'Calorie Calculator',
          tabBarIcon: ({ color }) => <Calculator size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          headerTitle: 'Progress & Stats',
          tabBarIcon: ({ color }) => <TrendingUp size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
