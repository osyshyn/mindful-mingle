import { Link, useLocation } from 'react-router-dom';

interface NavItemProps {
  to: string;
  label: string;
  icon?: React.ElementType;
  onClick?: () => void;
}
const NavItem = ({ to, label, icon: Icon, onClick }: NavItemProps) => {
  const location = useLocation();
  const isCurrentPage = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
        isCurrentPage
          ? 'bg-rose-50 text-rose-600 font-medium'
          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
      }`}
    >
      {Icon && <Icon className='h-5 w-5' />}
      <span>{label}</span>
    </Link>
  );
};

export default NavItem;
