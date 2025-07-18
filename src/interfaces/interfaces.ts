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

export interface ProfileInterface {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  notification_preferences: {
    email: boolean;
    sms: boolean;
  };
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
}



export interface RelationshipAssessmentInterface {
  id: string;
  name: string;
  relationship_type: string;
  specific_role: string;
}

export interface Question {
  id: number;
  text: string;
  category: string;
}

export interface AssessmentAnswers {
  [questionId: number]: number;
}



export type RelationshipType = 'family' | 'friend' | 'work' | 'romantic' | 'other';
export type GoalStatus = 'not_started' | 'in_progress' | 'completed';

export interface RelationshipDetailInterface {
  id: string;
  name: string;
  relationship_type: RelationshipType;
  specific_role: string;
  notes: string;
  created_at: string;
}

export interface Assessment {
  id: string;
  score: number;
  taken_at: string;
  answers: Record<string, number>;
}

export interface GoalDetailInterface {
  id: string;
  title: string;
  description: string;
  status: GoalStatus;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface NewGoalForm {
  title: string;
  description: string;
  due_date: string;
}


export interface RelationshipInterface {
  id: string;
  name: string;
  relationship_type: RelationshipType;
  specific_role: string;
  notes: string;
  latest_score?: number;
  latest_assessment_date?: string;
  goals_count?: number;
  completed_goals_count?: number;
}

export interface RelationshipFormData {
  name: string;
  relationship_type: RelationshipType | '';
  specific_role: string;
  notes: string;
}

export interface RelationshipReports {
  id: string;
  name: string;
  latest_score: number;
  relationship_type: string;
  stress_level?: number;
}