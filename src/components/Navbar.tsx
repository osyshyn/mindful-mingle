import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  MessageCircle, 
  User, 
  LogOut, 
  Settings, 
  Heart, 
  Activity, 
  BarChart2, 
  MessageSquareText,
  Menu,
  X,
  LayoutDashboard
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import Logo from './Logo';

interface Profile {
  id: string;
  full_name: string | null;
  email: string;
}

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    loadUserAndProfile();
  }, []);

  const loadUserAndProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .eq('id', user.id)
          .single();

        if (!error) {
          setProfile(profileData);
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/relationships', icon: Heart, label: 'Relationships' },
    { to: '/reports', icon: BarChart2, label: 'Reports' },
    { to: '/analyze', icon: MessageSquareText, label: 'Analyze' },
    { to: '/daily-tips', icon: null, label: 'Daily Tips' },
    { to: '/chat', icon: MessageCircle, label: 'Chat' },
    { to: '/biometric-settings', icon: Activity, label: 'Biometrics' },
    { to: '/preferences', icon: Settings, label: 'Preferences' }
  ];

  const isCurrentPage = (path: string) => {
    return location.pathname === path;
  };

  // Get display name - use full name if available, otherwise email, or fallback to "Profile"
  const getDisplayName = () => {
    if (profile?.full_name) return profile.full_name;
    if (profile?.email) return profile.email.split('@')[0];
    return 'Profile';
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Logo />
            <span className="text-xl font-bold text-gray-800">MindfulMingle</span>
          </Link>
          
          {/* Mobile menu button */}
          {user && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors ${
                      isCurrentPage(item.to)
                        ? 'bg-rose-50 text-rose-600 font-medium'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </Link>
                ))}
                <div className="flex items-center space-x-4">
                  <Link
                    to="/profile"
                    className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors ${
                      isCurrentPage('/profile')
                        ? 'bg-rose-50 text-rose-600 font-medium'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span>{getDisplayName()}</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 px-2 py-1 rounded-lg hover:bg-gray-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className={`bg-rose-500 text-white px-6 py-2 rounded-full hover:bg-rose-600 transition-colors ${
                  isCurrentPage('/login') ? 'ring-2 ring-rose-300' : ''
                }`}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {user && (
          <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} mt-4`}>
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                    isCurrentPage(item.to)
                      ? 'bg-rose-50 text-rose-600 font-medium'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {item.icon && <item.icon className="h-5 w-5" />}
                  <span>{item.label}</span>
                </Link>
              ))}
              <Link
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                  isCurrentPage('/profile')
                    ? 'bg-rose-50 text-rose-600 font-medium'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <User className="h-5 w-5" />
                <span>{getDisplayName()}</span>
              </Link>
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-50 w-full"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;