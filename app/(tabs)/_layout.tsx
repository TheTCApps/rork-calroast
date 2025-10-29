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
          height: 150,
          paddingBottom: 40,
          paddingTop: 20,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600' as const,
          marginTop: 6,
          marginBottom: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
          justifyContent: 'flex-start',
        },
      }}
    >
      <Tabs.Screen
        name="planner"
        options={{
          title: 'Planner',
          headerTitle: 'Workout Planner',
          tabBarIcon: ({ color }) => <Dumbbell size={32} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          headerTitle: 'Workout Calendar',
          tabBarIcon: ({ color }) => <Calendar size={32} color={color} />,
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Exercises',
          headerTitle: 'Exercise Library',
          tabBarIcon: ({ color }) => <Activity size={32} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          title: 'Calculator',
          headerTitle: 'Calorie Calculator',
          tabBarIcon: ({ color }) => <Calculator size={32} color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          headerTitle: 'Progress & Stats',
          tabBarIcon: ({ color }) => <TrendingUp size={32} color={color} />,
        }}
      />
    </Tabs>
  );
}
