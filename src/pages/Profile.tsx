// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { User, Phone, Mail, Bell, Loader, Lock, Eye, EyeOff } from 'lucide-react';
// import { supabase } from '../lib/supabase';
// import toast from 'react-hot-toast';
// import zxcvbn from 'zxcvbn';

// interface Profile {
//   id: string;
//   email: string;
//   full_name: string | null;
//   avatar_url: string | null;
//   phone_number: string | null;
//   notification_preferences: {
//     email: boolean;
//     sms: boolean;
//   };
//   address_line1: string | null;
//   address_line2: string | null;
//   city: string | null;
//   state: string | null;
//   postal_code: string | null;
//   country: string | null;
// }

// interface PasswordForm {
//   currentPassword: string;
//   newPassword: string;
//   confirmPassword: string;
// }

// const Profile = () => {
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const [profile, setProfile] = useState<Profile | null>(null);
//   const [showPasswordSection, setShowPasswordSection] = useState(false);
//   const [showPasswords, setShowPasswords] = useState({
//     current: false,
//     new: false,
//     confirm: false
//   });
//   const [passwordForm, setPasswordForm] = useState<PasswordForm>({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });

//   useEffect(() => {
//     loadProfile();
//   }, []);

//   const loadProfile = async () => {
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) {
//         navigate('/login');
//         return;
//       }

//       const { data, error } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('id', user.id)
//         .single();

//       if (error) throw error;

//       // Set default notification preferences if they don't exist
//       const notificationPreferences = data.notification_preferences || {
//         email: true,
//         sms: false
//       };

//       setProfile({
//         ...data,
//         notification_preferences: notificationPreferences
//       });
//     } catch (error) {
//       toast.error('Error loading profile');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!profile) return;

//     setIsSaving(true);
//     try {
//       const { error } = await supabase
//         .from('profiles')
//         .update({
//           full_name: profile.full_name,
//           phone_number: profile.phone_number,
//           notification_preferences: profile.notification_preferences,
//           address_line1: profile.address_line1,
//           address_line2: profile.address_line2,
//           city: profile.city,
//           state: profile.state,
//           postal_code: profile.postal_code,
//           country: profile.country,
//           updated_at: new Date().toISOString(),
//         })
//         .eq('id', profile.id);

//       if (error) throw error;
//       toast.success('Profile updated successfully');
//     } catch (error) {
//       toast.error('Error updating profile');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handlePasswordChange = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (passwordForm.newPassword !== passwordForm.confirmPassword) {
//       toast.error('New passwords do not match');
//       return;
//     }

//     setIsSaving(true);
//     try {
//       // First verify current password
//       const { data: { user }, error: userError } = await supabase.auth.getUser();
//       if (userError) throw userError;

//       if (!user?.email) {
//         throw new Error('User email not found');
//       }

//       // Verify current password
//       const { error: signInError } = await supabase.auth.signInWithPassword({
//         email: user.email,
//         password: passwordForm.currentPassword,
//       });

//       if (signInError) {
//         throw new Error('Current password is incorrect');
//       }

//       // Update to new password
//       const { error } = await supabase.auth.updateUser({
//         password: passwordForm.newPassword
//       });

//       if (error) throw error;

//       // Navigate to confirmation page
//       navigate('/reset-confirmation');
//     } catch (error) {
//       toast.error(error.message || 'Error updating password');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const getPasswordStrength = (password: string) => {
//     if (!password) return null;
//     const result = zxcvbn(password);
//     return {
//       score: result.score,
//       feedback: result.feedback.warning || result.feedback.suggestions[0]
//     };
//   };

//   const getStrengthColor = (score: number) => {
//     switch (score) {
//       case 0: return 'bg-red-500';
//       case 1: return 'bg-orange-500';
//       case 2: return 'bg-yellow-500';
//       case 3: return 'bg-lime-500';
//       case 4: return 'bg-green-500';
//       default: return 'bg-gray-200';
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <Loader className="h-8 w-8 animate-spin text-rose-500" />
//       </div>
//     );
//   }

//   const passwordStrength = getPasswordStrength(passwordForm.newPassword);

//   return (
//     <div className="max-w-2xl mx-auto">
//       <div className="bg-white rounded-xl shadow-md overflow-hidden">
//         <div className="p-8">
//           <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Full Name
//               </label>
//               <div className="relative">
//                 <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//                 <input
//                   type="text"
//                   value={profile?.full_name || ''}
//                   onChange={(e) => setProfile(prev => ({ ...prev!, full_name: e.target.value }))}
//                   className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
//                   placeholder="Your full name"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//                 <input
//                   type="email"
//                   value={profile?.email || ''}
//                   disabled
//                   className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 bg-gray-50 cursor-not-allowed"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Phone Number
//               </label>
//               <div className="relative">
//                 <Phone className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//                 <input
//                   type="tel"
//                   value={profile?.phone_number || ''}
//                   onChange={(e) => setProfile(prev => ({ ...prev!, phone_number: e.target.value }))}
//                   className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
//                   placeholder="+1 (555) 000-0000"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-4">
//                 Notification Preferences
//               </label>
//               <div className="space-y-3">
//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={profile?.notification_preferences?.email}
//                     onChange={(e) => setProfile(prev => ({
//                       ...prev!,
//                       notification_preferences: {
//                         ...prev!.notification_preferences,
//                         email: e.target.checked
//                       }
//                     }))}
//                     className="rounded border-gray-300 text-rose-500 focus:ring-rose-500"
//                   />
//                   <Mail className="h-5 w-5 text-gray-400 ml-3" />
//                   <span className="ml-2 text-gray-700">Email notifications</span>
//                 </label>

//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={profile?.notification_preferences?.sms}
//                     onChange={(e) => setProfile(prev => ({
//                       ...prev!,
//                       notification_preferences: {
//                         ...prev!.notification_preferences,
//                         sms: e.target.checked
//                       }
//                     }))}
//                     className="rounded border-gray-300 text-rose-500 focus:ring-rose-500"
//                   />
//                   <Bell className="h-5 w-5 text-gray-400 ml-3" />
//                   <span className="ml-2 text-gray-700">SMS notifications</span>
//                 </label>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Address
//               </label>
//               <div className="space-y-3">
//                 <input
//                   type="text"
//                   value={profile?.address_line1 || ''}
//                   onChange={(e) => setProfile(prev => ({ ...prev!, address_line1: e.target.value }))}
//                   className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
//                   placeholder="Street Address"
//                 />
//                 <input
//                   type="text"
//                   value={profile?.address_line2 || ''}
//                   onChange={(e) => setProfile(prev => ({ ...prev!, address_line2: e.target.value }))}
//                   className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
//                   placeholder="Apt, Suite, etc."
//                 />
//                 <div className="grid grid-cols-2 gap-3">
//                   <input
//                     type="text"
//                     value={profile?.city || ''}
//                     onChange={(e) => setProfile(prev => ({ ...prev!, city: e.target.value }))}
//                     className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
//                     placeholder="City"
//                   />
//                   <input
//                     type="text"
//                     value={profile?.state || ''}
//                     onChange={(e) => setProfile(prev => ({ ...prev!, state: e.target.value }))}
//                     className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
//                     placeholder="State"
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-3">
//                   <input
//                     type="text"
//                     value={profile?.postal_code || ''}
//                     onChange={(e) => setProfile(prev => ({ ...prev!, postal_code: e.target.value }))}
//                     className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
//                     placeholder="Postal Code"
//                   />
//                   <input
//                     type="text"
//                     value={profile?.country || ''}
//                     onChange={(e) => setProfile(prev => ({ ...prev!, country: e.target.value }))}
//                     className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
//                     placeholder="Country"
//                   />
//                 </div>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={isSaving}
//               className="w-full bg-rose-500 text-white py-2 px-4 rounded-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isSaving ? (
//                 <Loader className="h-5 w-5 animate-spin mx-auto" />
//               ) : (
//                 'Save Changes'
//               )}
//             </button>
//           </form>

//           <div className="mt-8 pt-8 border-t">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-lg font-semibold text-gray-900">Password</h3>
//               <button
//                 onClick={() => setShowPasswordSection(!showPasswordSection)}
//                 className="text-rose-500 hover:text-rose-600 text-sm font-medium"
//               >
//                 {showPasswordSection ? 'Cancel' : 'Change Password'}
//               </button>
//             </div>

//             {showPasswordSection && (
//               <form onSubmit={handlePasswordChange} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Current Password
//                   </label>
//                   <div className="relative">
//                     <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//                     <input
//                       type={showPasswords.current ? 'text' : 'password'}
//                       value={passwordForm.currentPassword}
//                       onChange={(e) => setPasswordForm(prev => ({
//                         ...prev,
//                         currentPassword: e.target.value
//                       }))}
//                       className="pl-10 pr-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPasswords(prev => ({
//                         ...prev,
//                         current: !prev.current
//                       }))}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                     >
//                       {showPasswords.current ? (
//                         <EyeOff className="h-5 w-5" />
//                       ) : (
//                         <Eye className="h-5 w-5" />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     New Password
//                   </label>
//                   <div className="relative">
//                     <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//                     <input
//                       type={showPasswords.new ? 'text' : 'password'}
//                       value={passwordForm.newPassword}
//                       onChange={(e) => setPasswordForm(prev => ({
//                         ...prev,
//                         newPassword: e.target.value
//                       }))}
//                       className="pl-10 pr-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPasswords(prev => ({
//                         ...prev,
//                         new: !prev.new
//                       }))}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                     >
//                       {showPasswords.new ? (
//                         <EyeOff className="h-5 w-5" />
//                       ) : (
//                         <Eye className="h-5 w-5" />
//                       )}
//                     </button>
//                   </div>
//                   {passwordForm.newPassword && (
//                     <div className="mt-2">
//                       <div className="flex gap-1 mb-1">
//                         {[0, 1, 2, 3, 4].map((index) => (
//                           <div
//                             key={index}
//                             className={`h-2 flex-1 rounded-full ${
//                               passwordStrength && index <= passwordStrength.score
//                                 ? getStrengthColor(passwordStrength.score)
//                                 : 'bg-gray-200'
//                             }`}
//                           />
//                         ))}
//                       </div>
//                       {passwordStrength?.feedback && (
//                         <p className="text-sm text-gray-600 mt-1">
//                           {passwordStrength.feedback}
//                         </p>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Confirm New Password
//                   </label>
//                   <div className="relative">
//                     <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//                     <input
//                       type={showPasswords.confirm ? 'text' : 'password'}
//                       value={passwordForm.confirmPassword}
//                       onChange={(e) => setPasswordForm(prev => ({
//                         ...prev,
//                         confirmPassword: e.target.value
//                       }))}
//                       className="pl-10 pr-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPasswords(prev => ({
//                         ...prev,
//                         confirm: !prev.confirm
//                       }))}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                     >
//                       {showPasswords.confirm ? (
//                         <EyeOff className="h-5 w-5" />
//                       ) : (
//                         <Eye className="h-5 w-5" />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={isSaving}
//                   className="w-full bg-rose-500 text-white py-2 px-4 rounded-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isSaving ? (
//                     <Loader className="h-5 w-5 animate-spin mx-auto" />
//                   ) : (
//                     'Update Password'
//                   )}
//                 </button>
//               </form>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';
import InputWithIcon from '../components/InputWithIcon';
import PasswordInputWithToggle from '../components/PasswordInputWithToggle';
import NotificationToggle from '../components/NotificationToggle';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import { User, Phone, Mail, Bell } from 'lucide-react';
import { ProfileInterface } from '../interfaces/interfaces';


const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [profile, setProfile] = useState<ProfileInterface | null>(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return navigate('/login');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) throw error;

      const notificationPreferences = data.notification_preferences || {
        email: true,
        sms: false,
      };
      setProfile({
        ...data,
        notification_preferences: notificationPreferences,
      });
    } catch {
      toast.error('Error loading profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...profile,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);
      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      return toast.error('Passwords do not match');
    setIsSaving(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user?.email) throw new Error('User not found');

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: passwordForm.currentPassword,
      });
      if (signInError) throw new Error('Current password incorrect');

      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });
      if (error) throw error;

      navigate('/reset-confirmation');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Password update error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !profile) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader className='h-8 w-8 animate-spin text-rose-500' />
      </div>
    );
  }

  return (
    <div className='max-w-2xl mx-auto'>
      <div className='bg-white rounded-xl shadow-md p-8'>
        <h2 className='text-2xl font-bold mb-6'>Profile Settings</h2>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <InputWithIcon
            label='Full Name'
            value={profile.full_name || ''}
            onChange={(e) =>
              setProfile((p) => {
                if (!p) return p;
                return {
                  ...p,
                  full_name: e.target.value,
                };
              })
            }
            icon={User}
          />
          <InputWithIcon
            label='Email Address'
            value={profile.email || ''}
            disabled
            icon={Mail}
          />
          <InputWithIcon
            label='Phone Number'
            value={profile.phone_number || ''}
            onChange={(e) =>
              setProfile((p) => {
                if (!p) return p;
                return {
                  ...p,
                  phone_number: e.target.value,
                };
              })
            }
            icon={Phone}
          />

          <div>
            <label className='block text-sm font-medium mb-2'>
              Notification Preferences
            </label>
            <div className='space-y-3'>
              <NotificationToggle
                label='Email notifications'
                icon={<Mail />}
                checked={profile.notification_preferences.email}
                onChange={(checked) => {
                  if (!profile) return;
                  setProfile({
                    ...profile,
                    notification_preferences: {
                      ...profile.notification_preferences,
                      email: checked,
                    },
                  });
                }}
              />
              <NotificationToggle
                label='SMS notifications'
                icon={<Bell />}
                checked={profile.notification_preferences.sms}
                onChange={(checked) => {
                  if (!profile) return;
                  setProfile({
                    ...profile,
                    notification_preferences: {
                      ...profile.notification_preferences,
                      email: checked,
                    },
                  });
                }}
              />
            </div>
          </div>

          <InputWithIcon
            label='Address Line 1'
            value={profile.address_line1 || ''}
            onChange={(e) =>
              setProfile((p) => {
                if (!p) return p;
                return {
                  ...p,
                  address_line1: e.target.value,
                };
              })
            }
          />
          <InputWithIcon
            label='Address Line 2'
            value={profile.address_line2 || ''}
            onChange={(e) =>
              setProfile((p) => {
                if (!p) return p;
                return {
                  ...p,
                  address_line2: e.target.value,
                };
              })
            }
          />
          <div className='grid grid-cols-2 gap-3'>
            <InputWithIcon
              label='City'
              value={profile.city || ''}
              onChange={(e) =>
                setProfile((p) => {
                  if (!p) return p;
                  return {
                    ...p,
                    city: e.target.value,
                  };
                })
              }
            />
            <InputWithIcon
              label='State'
              value={profile.state || ''}
              onChange={(e) =>
                setProfile((p) => {
                  if (!p) return p;
                  return {
                    ...p,
                    state: e.target.value,
                  };
                })
              }
            />
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <InputWithIcon
              label='Postal Code'
              value={profile.postal_code || ''}
              onChange={(e) =>
                setProfile((p) => {
                  if (!p) return p;
                  return {
                    ...p,
                    postal_code: e.target.value,
                  };
                })
              }
            />
            <InputWithIcon
              label='Country'
              value={profile.country || ''}
              onChange={(e) =>
                setProfile((p) => {
                  if (!p) return p;
                  return {
                    ...p,
                    country: e.target.value,
                  };
                })
              }
            />
          </div>

          <button
            type='submit'
            disabled={isSaving}
            className='w-full bg-rose-500 text-white py-2 px-4 rounded-lg hover:bg-rose-600 disabled:opacity-50'
          >
            {isSaving ? (
              <Loader className='h-5 w-5 animate-spin mx-auto' />
            ) : (
              'Save Changes'
            )}
          </button>
        </form>

        <div className='mt-8 pt-8 border-t'>
          <div className='flex justify-between mb-6'>
            <h3 className='text-lg font-semibold'>Password</h3>
            <button
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className='text-rose-500 text-sm'
            >
              {showPasswordSection ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {showPasswordSection && (
            <form onSubmit={handlePasswordChange} className='space-y-4'>
              <PasswordInputWithToggle
                label='Current Password'
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((p) => ({
                    ...p,
                    currentPassword: e.target.value,
                  }))
                }
                isVisible={showPasswords.current}
                toggle={() =>
                  setShowPasswords((p) => ({ ...p, current: !p.current }))
                }
              />
              <PasswordInputWithToggle
                label='New Password'
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((p) => ({
                    ...p,
                    newPassword: e.target.value,
                  }))
                }
                isVisible={showPasswords.new}
                toggle={() => setShowPasswords((p) => ({ ...p, new: !p.new }))}
              />
              <PasswordStrengthMeter password={passwordForm.newPassword} />
              <PasswordInputWithToggle
                label='Confirm New Password'
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((p) => ({
                    ...p,
                    confirmPassword: e.target.value,
                  }))
                }
                isVisible={showPasswords.confirm}
                toggle={() =>
                  setShowPasswords((p) => ({ ...p, confirm: !p.confirm }))
                }
              />
              <button
                type='submit'
                disabled={isSaving}
                className='w-full bg-rose-500 text-white py-2 px-4 rounded-lg hover:bg-rose-600 disabled:opacity-50'
              >
                {isSaving ? (
                  <Loader className='h-5 w-5 animate-spin mx-auto' />
                ) : (
                  'Update Password'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
