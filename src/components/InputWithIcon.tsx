// import React from 'react';

// interface InputWithIconProps {
//   label: string;
//   value: string;
//   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   type?: string;
//   placeholder?: string;
//   disabled?: boolean;
//   icon?: React.ReactNode;
//   className?: string;
// }

// const InputWithIcon: React.FC<InputWithIconProps> = ({
//   label,
//   value,
//   onChange,
//   type = 'text',
//   placeholder = '',
//   disabled = false,
//   icon,
//   className = '',
// }) => {
//   return (
//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
//       <div className="relative">
//         {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
//         <input
//           type={type}
//           value={value}
//           onChange={onChange}
//           disabled={disabled}
//           placeholder={placeholder}
//           className={`pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''} ${className}`}
//         />
//       </div>
//     </div>
//   );
// };

// export default InputWithIcon;


import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputWithIconProps {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  icon?: LucideIcon; // Изменено на тип LucideIcon
  className?: string;
}

const InputWithIcon: React.FC<InputWithIconProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  disabled = false,
  icon: Icon, // Переименовано в Icon с большой буквы
  className = '',
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`${Icon ? 'pl-10' : 'pl-4'} w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''} ${className}`}
        />
      </div>
    </div>
  );
};

export default InputWithIcon;