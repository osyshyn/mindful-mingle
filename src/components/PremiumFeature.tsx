import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

interface PremiumFeatureProps {
  children: React.ReactNode;
}

export const PremiumFeature: React.FC<PremiumFeatureProps> = ({ children }) => {
  const { isActiveSubscription, isLoading, subscription } = useSubscription();

  if (isLoading) return null;

  console.log('PremiumFeature check:', { 
    isActiveSubscription, 
    subscription,
    currentTime: new Date().toISOString()
  });

  if (!isActiveSubscription) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gray-100 bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center p-6">
            <Lock className="h-8 w-8 text-rose-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Premium Feature
            </h3>
            <p className="text-gray-600 mb-4">
              Upgrade to premium to access this feature
            </p>
            <Link
              to="/premium"
              className="inline-flex items-center px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
            >
              Upgrade Now
            </Link>
          </div>
        </div>
        <div className="opacity-50">
          {children}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PremiumFeature;