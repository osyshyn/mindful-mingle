import { CoachingPreferences, OptionType, FormDataLogin } from "../interfaces/interfaces";
import { FeatureItemProps, BenefitCardProps } from "../pages/Premium";
import { Brain, Compass,  Leaf, MessageCircle, Activity,  BarChart as ChartBar, } from 'lucide-react';

export const INITIAL_FORM_DATA: FormDataLogin = {
  email: '',
  password: '',
  phone_number: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
};

export const defaultPreferences: CoachingPreferences = {
  methodology: '',
  focus_areas: [],
  communication_style: '',
  spiritual_inclusion: false,
  preferred_experts: []
};




export const methodologies: OptionType[] = [
  {
    id: 'goleman',
    name: 'Goleman EQ Framework',
    description: 'Focus on self-awareness, self-regulation, motivation, empathy, and social skills',
    icon: Brain
  },
  {
    id: 'eq-i',
    name: 'EQ-i 2.0 Model',
    description: 'Comprehensive approach covering self-perception, decision making, and stress management',
    icon: Compass
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness-Based EQ',
    description: 'Integration of mindfulness practices with emotional intelligence development',
    icon: Leaf
  }
];

export const focusAreas: string[] = [
  'Relationship Building',
  'Conflict Resolution',
  'Self-Awareness',
  'Leadership Development',
  'Stress Management',
  'Communication Skills'
];

export const communicationStyles: OptionType[] = [
  {
    id: 'direct',
    name: 'Direct and Straightforward',
    description: 'Clear, concise guidance without sugarcoating'
  },
  {
    id: 'supportive',
    name: 'Supportive and Encouraging',
    description: 'Gentle, positive reinforcement and emotional support'
  },
  {
    id: 'analytical',
    name: 'Analytical and Detailed',
    description: 'In-depth analysis with scientific backing'
  }
];

export const experts: OptionType[]  = [
  {
    id: 'daniel_goleman',
    name: 'Daniel Goleman',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
    expertise: 'Emotional Intelligence Pioneer'
  },
  {
    id: 'travis_bradberry',
    name: 'Travis Bradberry',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
    expertise: 'EQ & Leadership Expert'
  },
  {
    id: 'marc_brackett',
    name: 'Marc Brackett',
    photo: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=80&w=200&h=200',
    expertise: 'Emotional Intelligence Research'
  },
  {
    id: 'susan_david',
    name: 'Susan David',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200',
    expertise: 'Emotional Agility'
  },
  {
    id: 'brene_brown',
    name: 'Brené Brown',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
    expertise: 'Vulnerability & Courage'
  },
  {
    id: 'marshall_rosenberg',
    name: 'Marshall Rosenberg',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
    expertise: 'Nonviolent Communication'
  }
];


export const FEATURES: FeatureItemProps[] = [
  {
    title: "AI Chat Coach",
    description: "Get personalized advice and guidance from our AI relationship coach",
    Icon: MessageCircle
  },
  {
    title: "Biometric Tracking",
    description: "Connect your devices to track stress levels and emotional states",
    Icon: Activity
  },
  {
    title: "Conversation Analysis",
    description: "Get insights into communication patterns and emotional dynamics",
    Icon: Brain
  },
  {
    title: "Advanced Reports",
    description: "Access detailed relationship analytics and progress tracking",
    Icon: ChartBar
  }
];

export const BENEFIT_CARDS: BenefitCardProps[] = [
  {
    title: "AI Chat Coach",
    description: "Get 24/7 access to our AI coach for personalized relationship advice and emotional guidance",
    Icon: MessageCircle
  },
  {
    title: "Biometric Insights",
    description: "Track your emotional states and stress levels during interactions",
    Icon: Activity
  },
  {
    title: "Advanced Analytics",
    description: "Deep insights into your relationship patterns and communication style",
    Icon: ChartBar
  }
];
