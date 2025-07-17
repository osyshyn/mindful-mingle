import React from 'react';
import { useSubscription } from '../hooks/useSubscription';
import PremiumOverlay from './PremiumOverlay';

interface PremiumFeatureProps {
  children: React.ReactNode;
}

export const PremiumFeature: React.FC<PremiumFeatureProps> = ({ children }) => {
  const { isActiveSubscription, isLoading, subscription } = useSubscription();

  if (isLoading) return null;

  console.log('PremiumFeature check:', {
    isActiveSubscription,
    subscription,
    currentTime: new Date().toISOString(),
  });

  if (!isActiveSubscription) {
    return (
      <div className='relative'>
        <PremiumOverlay />
        <div className='opacity-50'>{children}</div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PremiumFeature;
