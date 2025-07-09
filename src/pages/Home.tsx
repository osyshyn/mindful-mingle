import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Brain, 
  MessageCircle, 
  Sparkles, 
  Activity, 
  TrendingUp, 
  Calendar,
  Users,
  Target,
  ArrowRight,
  Loader
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';

interface DashboardData {
  relationshipCount: number;
  averageScore: number;
  recentAssessments: Array<{
    id: string;
    relationship_name: string;
    score: number;
    taken_at: string;
  }>;
  upcomingGoals: Array<{
    id: string;
    title: string;
    relationship_name: string;
    due_date: string;
  }>;
  latestTip: {
    id: string;
    title: string;
    category: string;
    created_at: string;
  } | null;
  stressLevels: Array<{
    timestamp: string;
    level: number;
  }>;
}

const Home = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    relationshipCount: 0,
    averageScore: 0,
    recentAssessments: [],
    upcomingGoals: [],
    latestTip: null,
    stressLevels: []
  });

  useEffect(() => {
    checkUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        loadDashboardData(session.user.id);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      setUser(session?.user || null);
      if (session?.user) {
        await loadDashboardData(session.user.id);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDashboardData = async (userId: string) => {
    try {
      // Fetch relationships and assessments
      const { data: relationships, error: relationshipsError } = await supabase
        .from('relationships')
        .select(`
          id,
          name,
          relationship_assessments (
            id,
            score,
            taken_at
          ),
          relationship_goals (
            id,
            title,
            due_date
          )
        `)
        .eq('user_id', userId);

      if (relationshipsError) throw relationshipsError;

      // Fetch latest daily tip
      const { data: tips, error: tipsError } = await supabase
        .from('daily_tips')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (tipsError && tipsError.code !== 'PGRST116') throw tipsError;

      // Fetch recent stress levels
      const { data: stressData, error: stressError } = await supabase
        .from('biometric_data')
        .select('timestamp, stress_level')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(7);

      if (stressError) throw stressError;

      // Process relationships data
      const assessments = relationships
        ?.flatMap(rel => 
          rel.relationship_assessments?.map(assessment => ({
            id: assessment.id,
            relationship_name: rel.name,
            score: assessment.score,
            taken_at: assessment.taken_at
          })) || []
        )
        .sort((a, b) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime())
        .slice(0, 3);

      const goals = relationships
        ?.flatMap(rel =>
          rel.relationship_goals?.map(goal => ({
            id: goal.id,
            title: goal.title,
            relationship_name: rel.name,
            due_date: goal.due_date
          })) || []
        )
        .filter(goal => goal.due_date && new Date(goal.due_date) > new Date())
        .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
        .slice(0, 3);

      const totalScore = assessments?.reduce((sum, a) => sum + a.score, 0);
      const averageScore = assessments?.length 
        ? Math.round(totalScore / assessments.length) 
        : 0;

      setDashboardData({
        relationshipCount: relationships?.length || 0,
        averageScore,
        recentAssessments: assessments || [],
        upcomingGoals: goals || [],
        latestTip: tips,
        stressLevels: stressData?.map(d => ({
          timestamp: d.timestamp,
          level: d.stress_level
        })) || []
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Error loading dashboard data. Please try refreshing the page.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-16">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Connect Mindfully, Grow Together
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Join MindfulMingle for personalized guidance, daily mindfulness tips, and expert relationship advice
          </p>
          <Link
            to="/login"
            className="bg-rose-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-rose-600 transition-colors"
          >
            Start Your Journey
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 py-12">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <Brain className="h-12 w-12 text-rose-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered Guidance</h3>
            <p className="text-gray-600">
              Get personalized advice from our mindful AI coach trained in emotional intelligence and relationship dynamics
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <Sparkles className="h-12 w-12 text-rose-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Daily Mindfulness Tips</h3>
            <p className="text-gray-600">
              Receive curated insights to enhance your mindfulness practice and strengthen relationships
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <MessageCircle className="h-12 w-12 text-rose-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community Support</h3>
            <p className="text-gray-600">
              Connect with others on their mindfulness journey through various communication channels
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center space-x-3 mb-3">
            <Users className="h-6 w-6 text-rose-500" />
            <h3 className="text-lg font-semibold text-gray-900">Relationships</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{dashboardData.relationshipCount}</p>
          <Link
            to="/relationships"
            className="text-rose-500 hover:text-rose-600 text-sm flex items-center mt-2"
          >
            View all
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center space-x-3 mb-3">
            <TrendingUp className="h-6 w-6 text-rose-500" />
            <h3 className="text-lg font-semibold text-gray-900">Average Score</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{dashboardData.averageScore}%</p>
          <span className="text-gray-500 text-sm">Overall relationship health</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center space-x-3 mb-3">
            <Activity className="h-6 w-6 text-rose-500" />
            <h3 className="text-lg font-semibold text-gray-900">Stress Level</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {dashboardData.stressLevels[0]?.level || 0}%
          </p>
          <span className="text-gray-500 text-sm">Current level</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center space-x-3 mb-3">
            <Target className="h-6 w-6 text-rose-500" />
            <h3 className="text-lg font-semibold text-gray-900">Active Goals</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{dashboardData.upcomingGoals.length}</p>
          <span className="text-gray-500 text-sm">In progress</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Assessments */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Recent Assessments</h2>
          </div>
          <div className="p-6">
            {dashboardData.recentAssessments.length === 0 ? (
              <p className="text-gray-500 text-center">No recent assessments</p>
            ) : (
              <div className="space-y-4">
                {dashboardData.recentAssessments.map(assessment => (
                  <div key={assessment.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{assessment.relationship_name}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(assessment.taken_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {assessment.score}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Goals */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Goals</h2>
          </div>
          <div className="p-6">
            {dashboardData.upcomingGoals.length === 0 ? (
              <p className="text-gray-500 text-center">No upcoming goals</p>
            ) : (
              <div className="space-y-4">
                {dashboardData.upcomingGoals.map(goal => (
                  <div key={goal.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{goal.title}</p>
                      <p className="text-sm text-gray-500">
                        {goal.relationship_name} • Due {format(new Date(goal.due_date), 'MMM d')}
                      </p>
                    </div>
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Latest Tip */}
      {dashboardData.latestTip && (
        <div className="mt-8 bg-rose-50 rounded-xl shadow-md p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Sparkles className="h-6 w-6 text-rose-500" />
                <h2 className="text-xl font-semibold text-gray-900">Today's Tip</h2>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {dashboardData.latestTip.title}
              </h3>
              <p className="text-sm text-gray-500">
                Category: {dashboardData.latestTip.category}
              </p>
            </div>
            <Link
              to="/daily-tips"
              className="text-rose-500 hover:text-rose-600 flex items-center"
            >
              View all tips
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;