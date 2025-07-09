import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Brain, MessageCircle, Sparkles, TrendingUp, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface DashboardData {
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    recentTips: [],
    recentChats: []
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Fetch recent tips
      const { data: tipsData, error: tipsError } = await supabase
        .from('daily_tips')
        .select('id, title, category, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      if (tipsError) throw tipsError;

      // Fetch recent chat messages
      const { data: chatsData, error: chatsError } = await supabase
        .from('chat_messages')
        .select('id, message, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (chatsError) throw chatsError;

      setData({
        recentTips: tipsData || [],
        recentChats: chatsData || []
      });
    } catch (error) {
      toast.error('Error loading dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-xl p-8 text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to Your EQ Journey</h1>
        <p className="text-rose-100 max-w-2xl">
          Track your emotional intelligence progress, get personalized advice, and develop stronger relationships.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/chat"
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
        >
          <MessageCircle className="h-8 w-8 text-rose-500 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Chat with Coach</h3>
          <p className="text-gray-600">Get personalized advice and guidance for your relationships</p>
        </Link>

        <Link
          to="/daily-tips"
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
        >
          <Sparkles className="h-8 w-8 text-rose-500 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Daily Tips</h3>
          <p className="text-gray-600">Discover new insights to improve your emotional intelligence</p>
        </Link>

        <Link
          to="/profile"
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
        >
          <Brain className="h-8 w-8 text-rose-500 mb-3" />
          <h3 className="text-lg font-semibold mb-2">EQ Progress</h3>
          <p className="text-gray-600">Track your emotional intelligence development</p>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Tips */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 bg-rose-50 border-b border-rose-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-rose-500" />
                <h2 className="text-lg font-semibold text-gray-900">Recent Tips</h2>
              </div>
              <Link to="/daily-tips" className="text-rose-500 hover:text-rose-600 text-sm font-medium">
                View All
              </Link>
            </div>
          </div>
          <div className="p-4">
            {data.recentTips.map(tip => (
              <div key={tip.id} className="mb-4 last:mb-0">
                <div className="flex items-start space-x-3">
                  <div className="bg-rose-100 rounded-full p-2">
                    <TrendingUp className="h-4 w-4 text-rose-500" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-medium">{tip.title}</h4>
                    <p className="text-sm text-gray-500">
                      {format(new Date(tip.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Chats */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 bg-rose-50 border-b border-rose-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-rose-500" />
                <h2 className="text-lg font-semibold text-gray-900">Recent Conversations</h2>
              </div>
              <Link to="/chat" className="text-rose-500 hover:text-rose-600 text-sm font-medium">
                Continue Chat
              </Link>
            </div>
          </div>
          <div className="p-4">
            {data.recentChats.map(chat => (
              <div key={chat.id} className="mb-4 last:mb-0">
                <div className="flex items-start space-x-3">
                  <div className="bg-rose-100 rounded-full p-2">
                    <MessageCircle className="h-4 w-4 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">
                      {chat.message.length > 100
                        ? `${chat.message.substring(0, 100)}...`
                        : chat.message}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {format(new Date(chat.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;