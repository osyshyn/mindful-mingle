import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Subscription {
  status: string;
  plan: string;
  current_period_end: string;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
    // Poll every 5 seconds for subscription updates
    const interval = setInterval(loadSubscription, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error in loadSubscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isActiveSubscription = subscription?.status === 'active' && 
    new Date(subscription.current_period_end) > new Date();

  return {
    subscription,
    isLoading,
    isActiveSubscription,
    loadSubscription
  };
}