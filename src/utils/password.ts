import zxcvbn from 'zxcvbn';

export const getPasswordStrength = (password: string) => {
  if (!password) return null;
  const result = zxcvbn(password);
  return {
    score: result.score,
    feedback: result.feedback.warning || result.feedback.suggestions[0] || ''
  };
};

export const getStrengthColor = (score: number) => {
  switch (score) {
    case 0: return 'bg-red-500';
    case 1: return 'bg-orange-500';
    case 2: return 'bg-yellow-500';
    case 3: return 'bg-lime-500';
    case 4: return 'bg-green-500';
    default: return 'bg-gray-200';
  }
};
