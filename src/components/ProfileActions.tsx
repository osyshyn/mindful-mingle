import { Link, useLocation } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';

interface ProfileActionsProps {
  displayName: string;
  onSignOut: () => void;
  isMobile?: boolean;
  onClick?: () => void; 
}

const ProfileActions = ({
  displayName,
  onSignOut,
  isMobile = false,
  onClick,
}: ProfileActionsProps) => {
  const location = useLocation();
  const isCurrent = location.pathname === '/profile';

  const linkClasses = `flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors ${
    isCurrent
      ? 'bg-rose-50 text-rose-600 font-medium'
      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
  }`;

  const buttonClasses =
    'flex items-center space-x-1 text-gray-600 hover:text-gray-800 px-2 py-1 rounded-lg hover:bg-gray-50';

  const mobileLinkClasses = linkClasses.replace('px-2 py-1', 'p-2');
  const mobileButtonClasses = buttonClasses.replace(
    'px-2 py-1',
    'p-2 w-full'
  );

  return (
    <>
      <Link
        to='/profile'
        onClick={onClick}
        className={isMobile ? mobileLinkClasses : linkClasses}
      >
        <User className='h-4 w-4' />
        <span>{displayName}</span>
      </Link>
      <button
        onClick={() => {
          onSignOut();
          if (onClick) onClick();
        }}
        className={isMobile ? mobileButtonClasses : buttonClasses}
      >
        <LogOut className='h-4 w-4' />
        <span>Sign Out</span>
      </button>
    </>
  );
};

export default ProfileActions;
