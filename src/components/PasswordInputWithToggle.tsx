import React from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordInputWithToggleProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isVisible: boolean;
  toggle: () => void;
}

const PasswordInputWithToggle: React.FC<PasswordInputWithToggleProps> = ({
  label,
  value,
  onChange,
  isVisible,
  toggle
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className="pl-10 pr-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
          required
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {isVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
};

export default PasswordInputWithToggle;
