import { Exercise } from './types';

export const EXERCISES: Exercise[] = [
  {
    id: 'chest-1',
    name: 'Push-ups',
    muscleGroup: 'chest',
    description: 'A fundamental bodyweight exercise for chest and triceps development.',
    technique: [
      'Start in a plank position with hands shoulder-width apart',
      'Lower your body until chest nearly touches the floor',
      'Keep your core engaged and back straight',
      'Push back up to starting position',
      'Exhale on the way up, inhale on the way down'
    ]
  },
  {
    id: 'chest-2',
    name: 'Bench Press',
    muscleGroup: 'chest',
    description: 'Classic compound exercise for building chest strength and mass.',
    technique: [
      'Lie on bench with feet flat on floor',
      'Grip bar slightly wider than shoulder-width',
      'Lower bar to mid-chest with control',
      'Press bar up until arms are fully extended',
      'Keep shoulder blades retracted throughout'
    ]
  },
  {
    id: 'chest-3',
    name: 'Dumbbell Flyes',
    muscleGroup: 'chest',
    description: 'Isolation exercise for chest stretch and muscle activation.',
    technique: [
      'Lie on bench holding dumbbells above chest',
      'Lower weights out to sides in wide arc',
      'Keep slight bend in elbows throughout',
      'Stop when chest feels stretched',
      'Bring weights back together above chest'
    ]
  },
  {
    id: 'back-1',
    name: 'Pull-ups',
    muscleGroup: 'back',
    description: 'Excellent compound exercise for back width and arm strength.',
    technique: [
      'Hang from bar with overhand grip',
      'Pull yourself up until chin clears bar',
      'Keep core tight and avoid swinging',
      'Lower yourself with control',
      'Fully extend arms at bottom'
    ]
  },
  {
    id: 'back-2',
    name: 'Bent-Over Rows',
    muscleGroup: 'back',
    description: 'Compound movement for back thickness and strength.',
    technique: [
      'Bend at hips with slight knee bend',
      'Hold bar with overhand grip',
      'Pull bar to lower chest',
      'Squeeze shoulder blades together',
      'Lower bar with control'
    ]
  },
  {
    id: 'back-3',
    name: 'Lat Pulldowns',
    muscleGroup: 'back',
    description: 'Machine exercise targeting the latissimus dorsi muscles.',
    technique: [
      'Sit at machine with thighs secured',
      'Grip bar wider than shoulder-width',
      'Pull bar down to upper chest',
      'Keep torso upright',
      'Slowly return to starting position'
    ]
  },
  {
    id: 'legs-1',
    name: 'Squats',
    muscleGroup: 'legs',
    description: 'King of leg exercises for overall lower body development.',
    technique: [
      'Stand with feet shoulder-width apart',
      'Lower body by bending knees and hips',
      'Keep chest up and core engaged',
      'Descend until thighs parallel to ground',
      'Drive through heels to return to start'
    ]
  },
  {
    id: 'legs-2',
    name: 'Lunges',
    muscleGroup: 'legs',
    description: 'Unilateral exercise for leg strength and balance.',
    technique: [
      'Step forward with one leg',
      'Lower hips until both knees bent at 90 degrees',
      'Keep front knee aligned with ankle',
      'Push back to starting position',
      'Alternate legs or complete set on one side'
    ]
  },
  {
    id: 'legs-3',
    name: 'Leg Press',
    muscleGroup: 'legs',
    description: 'Machine exercise for quadriceps, hamstrings, and glutes.',
    technique: [
      'Sit in machine with feet on platform',
      'Lower platform by bending knees',
      'Stop when knees at 90 degrees',
      'Press platform back up',
      'Do not lock knees at top'
    ]
  },
  {
    id: 'arms-1',
    name: 'Bicep Curls',
    muscleGroup: 'arms',
    description: 'Classic isolation exercise for bicep development.',
    technique: [
      'Stand with dumbbells at sides',
      'Keep elbows close to body',
      'Curl weights up to shoulders',
      'Squeeze biceps at top',
      'Lower with control'
    ]
  },
  {
    id: 'arms-2',
    name: 'Tricep Dips',
    muscleGroup: 'arms',
    description: 'Bodyweight exercise for tricep strength.',
    technique: [
      'Position hands on parallel bars or bench',
      'Lower body by bending elbows',
      'Keep elbows pointing back',
      'Descend until upper arms parallel to ground',
      'Press back up to start'
    ]
  },
  {
    id: 'arms-3',
    name: 'Hammer Curls',
    muscleGroup: 'arms',
    description: 'Variation of bicep curl targeting brachialis and forearms.',
    technique: [
      'Hold dumbbells with neutral grip',
      'Keep palms facing each other',
      'Curl weights to shoulders',
      'Maintain neutral wrist position',
      'Lower slowly to starting position'
    ]
  },
  {
    id: 'abs-1',
    name: 'Crunches',
    muscleGroup: 'abs',
    description: 'Basic abdominal exercise for core strength.',
    technique: [
      'Lie on back with knees bent',
      'Place hands behind head or crossed on chest',
      'Lift shoulders off ground',
      'Contract abs and hold briefly',
      'Lower back down with control'
    ]
  },
  {
    id: 'abs-2',
    name: 'Plank',
    muscleGroup: 'abs',
    description: 'Isometric core exercise for stability and endurance.',
    technique: [
      'Start in forearm plank position',
      'Keep body in straight line from head to heels',
      'Engage core and squeeze glutes',
      'Hold position without sagging hips',
      'Breathe steadily throughout'
    ]
  },
  {
    id: 'abs-3',
    name: 'Russian Twists',
    muscleGroup: 'abs',
    description: 'Rotational exercise for obliques and core.',
    technique: [
      'Sit with knees bent and feet off ground',
      'Lean back slightly',
      'Hold weight at chest',
      'Rotate torso side to side',
      'Touch weight to ground on each side'
    ]
  }
];
