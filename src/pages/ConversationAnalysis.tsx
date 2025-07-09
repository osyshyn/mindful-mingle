import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquareText, Loader, AlertTriangle, ThumbsUp, ThumbsDown, Meh } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface SentimentAnalysis {
  overallSentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  participants: {
    name: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
    emotions: string[];
    suggestions: string[];
  }[];
  summary: string;
}

const ConversationAnalysis = () => {
  const navigate = useNavigate();
  const [conversation, setConversation] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SentimentAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!conversation.trim()) {
      toast.error('Please enter a conversation to analyze');
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-conversation`;
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversation })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze conversation');
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (error) {
      toast.error('Error analyzing conversation');
      console.error('Error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="h-6 w-6 text-green-500" />;
      case 'negative':
        return <ThumbsDown className="h-6 w-6 text-red-500" />;
      default:
        return <Meh className="h-6 w-6 text-yellow-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 bg-rose-50 border-b border-rose-100">
          <div className="flex items-center space-x-3">
            <MessageSquareText className="h-6 w-6 text-rose-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              Conversation Analysis
            </h2>
          </div>
          <p className="text-gray-600 mt-2">
            Analyze the sentiment and emotional dynamics of your conversations
          </p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paste your conversation
            </label>
            <textarea
              value={conversation}
              onChange={(e) => setConversation(e.target.value)}
              className="w-full h-48 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="Paste your conversation here..."
            />
            <p className="text-sm text-gray-500 mt-2">
              Format: Name: Message
              Example:
              John: Hey, how are you doing?
              Sarah: I'm good, thanks for asking!
            </p>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !conversation.trim()}
            className="w-full bg-rose-500 text-white py-2 px-4 rounded-lg hover:bg-rose-600 
              focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <Loader className="h-5 w-5 animate-spin mx-auto" />
            ) : (
              'Analyze Conversation'
            )}
          </button>

          {analysis && (
            <div className="mt-8 space-y-6">
              {/* Overall Analysis */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  {getSentimentIcon(analysis.overallSentiment)}
                  <h3 className="text-lg font-semibold text-gray-900">
                    Overall Analysis
                  </h3>
                </div>
                <p className="text-gray-700">{analysis.summary}</p>
              </div>

              {/* Participant Analysis */}
              <div className="grid gap-4">
                {analysis.participants.map((participant, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:border-rose-200 transition-colors"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      {getSentimentIcon(participant.sentiment)}
                      <h4 className="font-medium text-gray-900">
                        {participant.name}
                      </h4>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Emotional State:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {participant.emotions.map((emotion, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                            >
                              {emotion}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Suggestions:</p>
                        <ul className="mt-1 space-y-1">
                          {participant.suggestions.map((suggestion, i) => (
                            <li key={i} className="text-sm text-gray-700">
                              • {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationAnalysis;