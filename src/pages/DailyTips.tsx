import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, BookOpen, Filter, Loader, ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Tip {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
}

const DailyTips = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [tips, setTips] = useState<Tip[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadTips();
  }, []);

  const loadTips = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('daily_tips')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTips(data);
      const uniqueCategories = [...new Set(data.map(tip => tip.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      toast.error('Error loading tips');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTips = selectedCategory === 'all'
    ? tips
    : tips.filter(tip => tip.category === selectedCategory);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleTipClick = (tip: Tip) => {
    // Generate a URL-friendly slug from the title
    const slug = tip.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    // In a real app, this would navigate to an actual article page
    // For now, we'll show a toast message
    toast.success(`Opening article: ${tip.title}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  // Get today's and yesterday's tips
  const todayTip = filteredTips[0];
  const yesterdayTip = filteredTips[1];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <Sparkles className="h-12 w-12 text-rose-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900">Daily EQ Tips</h1>
        <p className="text-gray-600 mt-2">
          Enhance your emotional intelligence with daily insights and practical advice
        </p>
      </div>

      {/* Category Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by Category</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${selectedCategory === 'all'
                ? 'bg-rose-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            All Tips
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Tips Display */}
      <div className="relative flex items-stretch gap-6 min-h-[400px] mb-8">
        {/* Yesterday's Tip */}
        {yesterdayTip && (
          <div 
            className="w-1/4 bg-white rounded-xl shadow-md overflow-hidden opacity-75 hover:opacity-100 transition-opacity cursor-pointer transform hover:scale-105 transition-transform"
            onClick={() => handleTipClick(yesterdayTip)}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                  Yesterday
                </span>
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                {yesterdayTip.title}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-3">
                {yesterdayTip.content}
              </p>
            </div>
          </div>
        )}

        {/* Today's Featured Tip */}
        {todayTip && (
          <div 
            className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform"
            onClick={() => handleTipClick(todayTip)}
          >
            <div className="bg-rose-500 p-4 text-white">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-rose-400 rounded-full text-sm font-medium">
                  Today's Tip
                </span>
                <Calendar className="h-5 w-5" />
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {todayTip.title}
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                {todayTip.content}
              </p>
              <div className="flex items-center text-rose-500">
                <BookOpen className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Read full article</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Previous Tips Grid */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Previous Tips</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {filteredTips.slice(2).map(tip => (
            <div 
              key={tip.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleTipClick(tip)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-sm font-medium">
                    {tip.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(tip.created_at)}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {tip.title}
                </h3>
                <p className="text-gray-600 line-clamp-3">
                  {tip.content}
                </p>
                <div className="mt-4 flex items-center text-rose-500 hover:text-rose-600">
                  <BookOpen className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">Read article</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredTips.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tips found for this category.</p>
        </div>
      )}
    </div>
  );
};

export default DailyTips;