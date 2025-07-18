import React from 'react';
import { getPasswordStrength, getStrengthColor } from '../utils/password';

interface Props {
  password: string;
}

const PasswordStrengthMeter: React.FC<Props> = ({ password }) => {
  const strength = getPasswordStrength(password);
  if (!strength) return null;

  return (
    <div className='mt-2'>
      <div className='flex gap-1 mb-1'>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full ${
              i <= strength.score
                ? getStrengthColor(strength.score)
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      {strength.feedback && (
        <p className='text-sm text-gray-600 mt-1'>{strength.feedback}</p>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
