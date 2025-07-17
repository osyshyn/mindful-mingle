import { Watch, Smartphone, Activity, Mic } from 'lucide-react';

export interface BiometricProvider {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  metrics: string[];
}

export const biometricProviders = [
  {
    id: 'fitbit',
    name: 'Fitbit',
    icon: Watch,
    description: 'Track heart rate and stress levels',
    metrics: ['Heart Rate', 'Stress Level', 'Sleep Quality'],
  },
  {
    id: 'apple_health',
    name: 'Apple Health',
    icon: Smartphone,
    description: 'Comprehensive health and activity data',
    metrics: ['Heart Rate', 'Activity Level', 'Sleep'],
  },
  {
    id: 'google_fit',
    name: 'Google Fit',
    icon: Activity,
    description: 'Activity and wellness tracking',
    metrics: ['Heart Rate', 'Activity', 'Stress'],
  },
  {
    id: 'voice_analysis',
    name: 'Voice Analysis',
    icon: Mic,
    description: 'Detect emotion and stress in voice',
    metrics: ['Voice Intensity', 'Emotion Detection'],
  },
];
