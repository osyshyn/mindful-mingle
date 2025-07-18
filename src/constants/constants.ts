import { CoachingPreferences, OptionType, FormDataLogin, Question } from "../interfaces/interfaces";
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


export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'How often do you communicate with this person?',
    category: 'communication',
  },
  {
    id: 2,
    text: 'How comfortable are you sharing your feelings with them?',
    category: 'trust',
  },
  {
    id: 3,
    text: 'How well do they understand your perspective?',
    category: 'empathy',
  },
  {
    id: 4,
    text: 'How supported do you feel in this relationship?',
    category: 'support',
  },
  {
    id: 5,
    text: 'How effectively do you resolve conflicts together?',
    category: 'conflict',
  },
  { id: 6, text: 'How much do you trust this person?', category: 'trust' },
  {
    id: 7,
    text: 'How well do you handle disagreements?',
    category: 'conflict',
  },
  {
    id: 8,
    text: 'How satisfied are you with the quality of time spent together?',
    category: 'quality',
  },
  {
    id: 9,
    text: "How well do you respect each other's boundaries?",
    category: 'boundaries',
  },
  {
    id: 10,
    text: 'How much mutual growth do you experience in this relationship?',
    category: 'growth',
  },
];

export const SCORE_LABELS: Record<number, string> = {
  1: 'Poor',
  5: 'Excellent',
};

export const RELATIONSHIP_TYPES_DETAIL = {
  family: 'Family',
  friend: 'Friend',
  work: 'Work',
  romantic: 'Romantic',
  other: 'Other',
};

export const STATUS_COLORS = {
  completed: 'bg-green-100 text-green-700',
  in_progress: 'bg-blue-100 text-blue-700',
  not_started: 'bg-gray-100 text-gray-700',
};

export const RELATIONSHIP_TYPES = [
  { value: 'family', label: 'Family' },
  { value: 'friend', label: 'Friend' },
  { value: 'work', label: 'Work' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'other', label: 'Other' }
] as const;
