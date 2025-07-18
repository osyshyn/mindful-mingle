import React from 'react';

interface NotificationToggleProps {
  label: string;
  icon: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({
  label,
  icon,
  checked,
  onChange
}) => {
  return (
    <label className="flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-gray-300 text-rose-500 focus:ring-rose-500"
      />
      <div className="ml-3 text-gray-700 flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
    </label>
  );
};

export default NotificationToggle;
