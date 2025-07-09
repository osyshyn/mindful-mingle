import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Watch,
  Smartphone,
  Mic,
  BarChart2,
  Loader,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface BiometricConnection {
  id: string;
  provider: string;
  is_active: boolean;
  last_sync_at: string | null;
  settings: Record<string, any>;
}

const providers = [
  {
    id: 'fitbit',
    name: 'Fitbit',
    icon: Watch,
    description: 'Track heart rate and stress levels',
    metrics: ['Heart Rate', 'Stress Level', 'Sleep Quality']
  },
  {
    id: 'apple_health',
    name: 'Apple Health',
    icon: Smartphone,
    description: 'Comprehensive health and activity data',
    metrics: ['Heart Rate', 'Activity Level', 'Sleep']
  },
  {
    id: 'google_fit',
    name: 'Google Fit',
    icon: Activity,
    description: 'Activity and wellness tracking',
    metrics: ['Heart Rate', 'Activity', 'Stress']
  },
  {
    id: 'voice_analysis',
    name: 'Voice Analysis',
    icon: Mic,
    description: 'Detect emotion and stress in voice',
    metrics: ['Voice Intensity', 'Emotion Detection']
  }
];

const BiometricSettings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [connections, setConnections] = useState<BiometricConnection[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('biometric_connections')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setConnections(data || []);
    } catch (error) {
      toast.error('Error loading biometric connections');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (providerId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('biometric_connections')
        .insert({
          user_id: user.id,
          provider: providerId,
          provider_user_id: 'demo_user',
          access_token: 'demo_token',
          is_active: true,
          settings: {
            sync_frequency: 'hourly',
            metrics: providers.find(p => p.id === providerId)?.metrics
          }
        })
        .select()
        .single();

      if (error) throw error;

      setConnections(prev => [...prev, data]);
      toast.success(`Connected to ${providers.find(p => p.id === providerId)?.name}`);
    } catch (error) {
      toast.error('Error connecting to provider');
    }
  };

  const handleDisconnect = async (providerId: string) => {
    try {
      const { error } = await supabase
        .from('biometric_connections')
        .delete()
        .eq('provider', providerId);

      if (error) throw error;

      setConnections(prev => prev.filter(conn => conn.provider !== providerId));
      toast.success(`Disconnected from ${providers.find(p => p.id === providerId)?.name}`);
    } catch (error) {
      toast.error('Error disconnecting provider');
    }
  };

  const handleSync = async (providerId: string) => {
    try {
      const { error } = await supabase
        .from('biometric_connections')
        .update({
          last_sync_at: new Date().toISOString()
        })
        .eq('provider', providerId);

      if (error) throw error;

      setConnections(prev => prev.map(conn =>
        conn.provider === providerId
          ? { ...conn, last_sync_at: new Date().toISOString() }
          : conn
      ));

      toast.success('Data synced successfully');
    } catch (error) {
      toast.error('Error syncing data');
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 bg-rose-50 border-b border-rose-100">
          <div className="flex items-center space-x-3">
            <Activity className="h-6 w-6 text-rose-500" />
            <h2 className="text-2xl font-bold text-gray-900">Biometric Tracking</h2>
          </div>
          <p className="text-gray-600 mt-2">
            Connect your devices and apps to track stress levels and emotional states
          </p>
        </div>

        <div className="p-6">
          <div className="grid gap-6">
            {providers.map(provider => {
              const connection = connections.find(c => c.provider === provider.id);
              const Icon = provider.icon;

              return (
                <div
                  key={provider.id}
                  className="border rounded-lg p-6 hover:border-rose-200 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-rose-50 rounded-lg">
                        <Icon className="h-6 w-6 text-rose-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {provider.name}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {provider.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <BarChart2 className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            Tracks: {provider.metrics.join(', ')}
                          </span>
                        </div>
                        {connection?.last_sync_at && (
                          <div className="text-sm text-gray-500 mt-2">
                            Last synced: {format(new Date(connection.last_sync_at), 'MMM d, yyyy HH:mm')}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {connection ? (
                        <>
                          <button
                            onClick={() => handleSync(provider.id)}
                            className="p-2 text-gray-400 hover:text-gray-600"
                            title="Sync data"
                          >
                            <RefreshCw className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDisconnect(provider.id)}
                            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            <XCircle className="h-5 w-5 text-gray-500" />
                            <span>Disconnect</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleConnect(provider.id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
                        >
                          <CheckCircle className="h-5 w-5" />
                          <span>Connect</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {connection && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Connected Features
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {provider.metrics.map(metric => (
                          <div
                            key={metric}
                            className="flex items-center space-x-2"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-600">{metric}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiometricSettings;