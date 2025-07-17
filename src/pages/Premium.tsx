// import React, { useState, useEffect } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { MessageCircle, Activity, Brain, BarChart as ChartBar, Check, Loader, RefreshCw } from 'lucide-react';
// import { supabase } from '../lib/supabase';
// import { useSubscription } from '../hooks/useSubscription';
// import { loadStripe } from '@stripe/stripe-js';
// import toast from 'react-hot-toast';

// // Use different Stripe keys based on environment
// const stripePublicKey = import.meta.env.STRIPE_ENVIRONMENT === 'production'
//   ? import.meta.env.VITE_STRIPE_LIVE_PUBLIC_KEY
//   : import.meta.env.VITE_STRIPE_TEST_PUBLIC_KEY;

// const stripePromise = loadStripe(stripePublicKey);

// const Premium = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const { subscription, isLoading: isLoadingSubscription, loadSubscription } = useSubscription();

//   useEffect(() => {
//     const subscriptionStatus = searchParams.get('subscription');
//     if (subscriptionStatus === 'success') {
//       // Remove the query parameters
//       window.history.replaceState({}, '', '/dashboard');
//       toast.success('Subscription activated successfully!');
//       // Redirect to dashboard after successful subscription
//       navigate('/dashboard');
//     } else if (subscriptionStatus === 'canceled') {
//       // Remove the query parameters
//       window.history.replaceState({}, '', '/premium');
//       toast.error('Subscription process was canceled');
//     }
//   }, [searchParams, navigate]);

//   const handleRefreshStatus = async () => {
//     setIsRefreshing(true);
//     try {
//       await loadSubscription();
//       toast.success('Subscription status refreshed');
//     } catch (error) {
//       toast.error('Failed to refresh subscription status');
//     } finally {
//       setIsRefreshing(false);
//     }
//   };

//   const handleSubscribe = async () => {
//     try {
//       setIsProcessing(true);
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) {
//         navigate('/login');
//         return;
//       }

//       // Create Stripe Checkout Session
//       const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-subscription`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           userId: user.id,
//           email: user.email,
//           returnUrl: window.location.origin
//         })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to create subscription session');
//       }

//       const { sessionId } = await response.json();

//       // Redirect to Stripe Checkout
//       const stripe = await stripePromise;
//       if (!stripe) {
//         throw new Error('Failed to load Stripe');
//       }

//       const { error } = await stripe.redirectToCheckout({ sessionId });

//       if (error) {
//         throw error;
//       }
//     } catch (error) {
//       console.error('Subscription error:', error);
//       toast.error('Failed to process subscription');
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   if (isLoadingSubscription) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <Loader className="h-8 w-8 animate-spin text-rose-500" />
//       </div>
//     );
//   }

//   const isActive = subscription?.status === 'active' &&
//     new Date(subscription.current_period_end) > new Date();

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="text-center mb-12">
//         <h1 className="text-4xl font-bold text-gray-900 mb-4">
//           Upgrade to Premium
//         </h1>
//         <p className="text-xl text-gray-600">
//           Unlock advanced features to deepen your relationships and emotional intelligence
//         </p>
//       </div>

//       <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//         <div className="p-8">
//           <div className="flex justify-center mb-8">
//             <div className="text-center">
//               <div className="text-4xl font-bold text-gray-900">$5</div>
//               <div className="text-gray-500">/month</div>
//             </div>
//           </div>

//           <div className="space-y-6 mb-8">
//             <div className="flex items-start">
//               <div className="flex-shrink-0">
//                 <Check className="h-6 w-6 text-green-500" />
//               </div>
//               <div className="ml-3">
//                 <h3 className="text-lg font-medium text-gray-900">AI Chat Coach</h3>
//                 <p className="text-gray-500">
//                   Get personalized advice and guidance from our AI relationship coach
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-start">
//               <div className="flex-shrink-0">
//                 <Check className="h-6 w-6 text-green-500" />
//               </div>
//               <div className="ml-3">
//                 <h3 className="text-lg font-medium text-gray-900">Biometric Tracking</h3>
//                 <p className="text-gray-500">
//                   Connect your devices to track stress levels and emotional states
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-start">
//               <div className="flex-shrink-0">
//                 <Check className="h-6 w-6 text-green-500" />
//               </div>
//               <div className="ml-3">
//                 <h3 className="text-lg font-medium text-gray-900">Conversation Analysis</h3>
//                 <p className="text-gray-500">
//                   Get insights into communication patterns and emotional dynamics
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-start">
//               <div className="flex-shrink-0">
//                 <Check className="h-6 w-6 text-green-500" />
//               </div>
//               <div className="ml-3">
//                 <h3 className="text-lg font-medium text-gray-900">Advanced Reports</h3>
//                 <p className="text-gray-500">
//                   Access detailed relationship analytics and progress tracking
//                 </p>
//               </div>
//             </div>
//           </div>

//           {isActive ? (
//             <div className="text-center space-y-4">
//               <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
//                 <Check className="h-5 w-5 mr-2" />
//                 Active Subscription
//               </div>
//               <div>
//                 <button
//                   onClick={handleRefreshStatus}
//                   disabled={isRefreshing}
//                   className="inline-flex items-center text-gray-500 hover:text-gray-700"
//                 >
//                   <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
//                   Refresh Status
//                 </button>
//               </div>
//               <p className="text-sm text-gray-500">
//                 Next billing date: {new Date(subscription.current_period_end).toLocaleDateString()}
//               </p>
//             </div>
//           ) : (
//             <button
//               onClick={handleSubscribe}
//               disabled={isProcessing}
//               className="w-full bg-rose-500 text-white py-3 px-4 rounded-lg hover:bg-rose-600
//                 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2
//                 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isProcessing ? (
//                 <Loader className="h-5 w-5 animate-spin mx-auto" />
//               ) : (
//                 'Subscribe Now'
//               )}
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="grid md:grid-cols-3 gap-8 mt-12">
//         <div className="bg-white p-6 rounded-xl shadow-md">
//           <MessageCircle className="h-12 w-12 text-rose-500 mb-4" />
//           <h3 className="text-xl font-semibold mb-2">AI Chat Coach</h3>
//           <p className="text-gray-600">
//             Get 24/7 access to our AI coach for personalized relationship advice and emotional guidance
//           </p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-md">
//           <Activity className="h-12 w-12 text-rose-500 mb-4" />
//           <h3 className="text-xl font-semibold mb-2">Biometric Insights</h3>
//           <p className="text-gray-600">
//             Track your emotional states and stress levels during interactions
//           </p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-md">
//           <ChartBar className="h-12 w-12 text-rose-500 mb-4" />
//           <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
//           <p className="text-gray-600">
//             Deep insights into your relationship patterns and communication style
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Premium;

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Loader, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSubscription } from '../hooks/useSubscription';
import { loadStripe } from '@stripe/stripe-js';
import { FEATURES, BENEFIT_CARDS } from '../constants/constants';
import toast from 'react-hot-toast';

// Types
export type FeatureItemProps = {
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
};

export type ActiveSubscriptionProps = {
  refreshStatus: () => void;
  isRefreshing: boolean;
  nextBillingDate: string;
};

export type BenefitCardProps = {
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const STRIPE_ENV = import.meta.env.STRIPE_ENVIRONMENT;
const STRIPE_PUBLIC_KEY =
  STRIPE_ENV === 'production'
    ? import.meta.env.VITE_STRIPE_LIVE_PUBLIC_KEY
    : import.meta.env.VITE_STRIPE_TEST_PUBLIC_KEY;

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const Premium = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {
    subscription,
    isLoading: isLoadingSubscription,
    loadSubscription,
  } = useSubscription();

  useEffect(() => {
    const subscriptionStatus = searchParams.get('subscription');
    if (!subscriptionStatus) return;

    window.history.replaceState(
      {},
      '',
      subscriptionStatus === 'success' ? '/dashboard' : '/premium'
    );

    if (subscriptionStatus === 'success') {
      toast.success('Subscription activated successfully!');
      navigate('/dashboard');
    } else if (subscriptionStatus === 'canceled') {
      toast.error('Subscription process was canceled');
    }
  }, [searchParams, navigate]);

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    try {
      await loadSubscription();
      toast.success('Subscription status refreshed');
    } catch {
      toast.error('Failed to refresh subscription status');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      setIsProcessing(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate('/login');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-subscription`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            email: user.email,
            returnUrl: window.location.origin,
          }),
        }
      );

      if (!response.ok)
        throw new Error('Failed to create subscription session');

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Failed to load Stripe');

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) throw error;
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to process subscription');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoadingSubscription) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader className='h-8 w-8 animate-spin text-rose-500' />
      </div>
    );
  }

  const isActive =
    subscription?.status === 'active' &&
    new Date(subscription.current_period_end) > new Date();

  return (
    <div className='max-w-4xl mx-auto'>
      {/* Header Section */}
      <div className='text-center mb-12'>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
          Upgrade to Premium
        </h1>
        <p className='text-xl text-gray-600'>
          Unlock advanced features to deepen your relationships and emotional
          intelligence
        </p>
      </div>

      {/* Pricing Card */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden mb-12'>
        <div className='p-8'>
          <div className='flex justify-center mb-8'>
            <div className='text-center'>
              <div className='text-4xl font-bold text-gray-900'>$5</div>
              <div className='text-gray-500'>/month</div>
            </div>
          </div>

          {/* Features List */}
          <div className='space-y-6 mb-8'>
            {FEATURES.map((feature, index) => (
              <FeatureItem
                key={index}
                title={feature.title}
                description={feature.description}
                Icon={feature.Icon}
              />
            ))}
          </div>

          {/* Subscription Status or Subscribe Button */}
          {isActive ? (
            <ActiveSubscription
              refreshStatus={handleRefreshStatus}
              isRefreshing={isRefreshing}
              nextBillingDate={subscription.current_period_end}
            />
          ) : (
            <button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className='w-full bg-rose-500 text-white py-3 px-4 rounded-lg hover:bg-rose-600 
                focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'
            >
              {isProcessing ? (
                <Loader className='h-5 w-5 animate-spin mx-auto' />
              ) : (
                'Subscribe Now'
              )}
            </button>
          )}
        </div>
      </div>

      {/* Benefits Section */}
      <div className='grid md:grid-cols-3 gap-8'>
        {BENEFIT_CARDS.map((benefit, index) => (
          <BenefitCard
            key={index}
            title={benefit.title}
            description={benefit.description}
            Icon={benefit.Icon}
          />
        ))}
      </div>
    </div>
  );
};

// Sub-components with proper TypeScript types
const FeatureItem: React.FC<FeatureItemProps> = ({ title, description }) => (
  <div className='flex items-start'>
    <div className='flex-shrink-0'>
      <Check className='h-6 w-6 text-green-500' />
    </div>
    <div className='ml-3'>
      <h3 className='text-lg font-medium text-gray-900'>{title}</h3>
      <p className='text-gray-500'>{description}</p>
    </div>
  </div>
);

const ActiveSubscription: React.FC<ActiveSubscriptionProps> = ({
  refreshStatus,
  isRefreshing,
  nextBillingDate,
}) => (
  <div className='text-center space-y-4'>
    <div className='inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full'>
      <Check className='h-5 w-5 mr-2' />
      Active Subscription
    </div>
    <div>
      <button
        onClick={refreshStatus}
        disabled={isRefreshing}
        className='inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200'
      >
        <RefreshCw
          className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`}
        />
        Refresh Status
      </button>
    </div>
    <p className='text-sm text-gray-500'>
      Next billing date: {new Date(nextBillingDate).toLocaleDateString()}
    </p>
  </div>
);

const BenefitCard: React.FC<BenefitCardProps> = ({
  title,
  description,
  Icon,
}) => (
  <div className='bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200'>
    <Icon className='h-12 w-12 text-rose-500 mb-4' />
    <h3 className='text-xl font-semibold mb-2'>{title}</h3>
    <p className='text-gray-600'>{description}</p>
  </div>
);

export default Premium;
