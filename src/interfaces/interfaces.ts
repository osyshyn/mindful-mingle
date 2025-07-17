export interface BiometricConnection {
  id: string;
  provider: string;
  is_active: boolean;
  last_sync_at: string | null;
  settings: Record<string, unknown>;
}

export interface Message {
  id: string;
  message: string;
  is_ai_response: boolean;
  created_at: string;
}

export type Sentiment = 'positive' | 'negative' | 'neutral';

export interface SentimentAnalysis {
  overallSentiment: Sentiment;
  score: number;
  summary: string;
  participants: {
    name: string;
    sentiment: Sentiment;
    score: number;
    emotions: string[];
    suggestions: string[];
  }[];
}

export interface Tip {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
}

export interface DashboardData {
  recentTips: Array<{
    id: string;
    title: string;
    category: string;
    created_at: string;
  }>;
  recentChats: Array<{
    id: string;
    message: string;
    created_at: string;
  }>;
}



export interface Assessment {
  id: string;
  relationship_name: string;
  score: number;
  taken_at: string;
}

export interface Goal {
  id: string;
  title: string;
  relationship_name: string;
  due_date: string;
}

export interface Tip {
  id: string;
  title: string;
  category: string;
  created_at: string;
}

export interface StressData {
  timestamp: string;
  level: number;
}

export interface DashboardDataHome {
  relationshipCount: number;
  averageScore: number;
  recentAssessments: Assessment[];
  upcomingGoals: Goal[];
  latestTip: Tip | null;
  stressLevels: StressData[];
}


export interface FormDataLogin {
  email: string;
  password: string;
  phone_number: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}


export interface CoachingPreferences {
  methodology: string;
  focus_areas: string[];
  communication_style: string;
  spiritual_inclusion: boolean;
  preferred_experts: string[];
}

export interface OptionType {
  id: string;
  name: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  photo?: string;
  expertise?: string;
}

