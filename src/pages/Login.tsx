// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Heart, Mail, Lock, Phone, Home, Loader, Eye, EyeOff } from 'lucide-react';
// import { supabase } from '../lib/supabase';
// import toast from 'react-hot-toast';

// const Login = () => {
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [isResetPassword, setIsResetPassword] = useState(false);
//   const [resetEmail, setResetEmail] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [FormDataLogin, setFormDataLogin] = useState({
//     email: '',
//     password: '',
//     phone_number: '',
//     address_line1: '',
//     address_line2: '',
//     city: '',
//     state: '',
//     postal_code: '',
//     country: ''
//   });

//   const validateEmail = (email: string) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const sendWelcomeEmail = async (email: string) => {
//     try {
//       const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/welcome-email`;
//       const response = await fetch(functionUrl, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email })
//       });

//       console.log(`Sending welcome email to ${email}...`);

//       if (!response.ok) {
//         throw new Error('Failed to send welcome email');
//       }
//     } catch (error) {
//       console.error('Error sending welcome email:', error);
//     }
//   };

//   const createProfile = async (userId: string) => {
//     try {
//       const { data: existingProfile, error: checkError } = await supabase
//         .from('profiles')
//         .select('id')
//         .eq('id', userId)
//         .maybeSingle();

//       if (checkError) {
//         console.error('Error checking existing profile:', checkError);
//         throw checkError;
//       }

//       if (existingProfile) {
//         console.log('Profile already exists for user:', userId);
//         return;
//       }

//       const { error: insertError } = await supabase
//         .from('profiles')
//         .insert({
//           id: userId,
//           email: FormDataLogin.email,
//           phone_number: FormDataLogin.phone_number.trim() || null,
//           address_line1: FormDataLogin.address_line1.trim() || null,
//           address_line2: FormDataLogin.address_line2.trim() || null,
//           city: FormDataLogin.city.trim() || null,
//           state: FormDataLogin.state.trim() || null,
//           postal_code: FormDataLogin.postal_code.trim() || null,
//           country: FormDataLogin.country.trim() || null,
//           coaching_preferences: {
//             methodology: '',
//             focus_areas: [],
//             communication_style: '',
//             spiritual_inclusion: false,
//             preferred_experts: []
//           }
//         });

//       if (insertError) {
//         console.error('Profile creation error:', insertError);
//         throw insertError;
//       }
//     } catch (error) {
//       console.error('Error in createProfile:', error);
//       throw error;
//     }
//   };

//   const handleResetPassword = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateEmail(resetEmail)) {
//       toast.error('Please enter a valid email address');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
//         redirectTo: `${window.location.origin}/reset-password`,
//       });

//       if (error) throw error;

//       toast.success('Password reset instructions sent to your email');
//       setIsResetPassword(false);
//       setResetEmail('');
//     } catch (error) {
//       toast.error(error.message || 'Error sending reset instructions');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateEmail(FormDataLogin.email)) {
//       toast.error('Please enter a valid email address');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       if (isSignUp) {
//         const { data, error } = await supabase.auth.signUp({
//           email: FormDataLogin.email,
//           password: FormDataLogin.password,
//           options: {
//             emailRedirectTo: `${window.location.origin}/login`
//           }
//         });

//         if (error) throw error;

//         // if (data.user) {
//         //   try {
//         //     await createProfile(data.user.id);
//         //     await sendWelcomeEmail(FormDataLogin.email);
//         //     toast.success('Account created successfully! Please check your email to confirm your account.');
//         //     setIsSignUp(false);
//         //   } catch (profileError) {
//         //     console.error('Profile creation error:', profileError);
//         //     await supabase.auth.signOut();
//         //     throw new Error('Failed to create user profile. Please try again.');
//         //   }
//         // }

//         if (data.user) {
//   console.log('✅ data.user:', data.user);

//   try {
//     console.log('👉 Calling createProfile with user ID:', data.user.id);

//     // await createProfile(data.user.id);

//     console.log('✅ createProfile finished successfully');

//     console.log('👉 Sending welcome email to:', FormDataLogin.email);
//     await sendWelcomeEmail(FormDataLogin.email);
//     console.log('✅ sendWelcomeEmail finished successfully');

//     toast.success('Account created successfully! Please check your email to confirm your account.');
//     setIsSignUp(false);

//   } catch (profileError) {
//     console.error('❌ Profile creation error:', profileError);

//     console.log('👉 Signing out because createProfile failed...');
//     await supabase.auth.signOut();

//     console.log('❌ Throwing final error: Failed to create user profile.');
//     throw new Error('Failed to create user profile. Please try again.');
//   }
// } else {
//   console.log('❌ data.user is null or undefined!');
// }

//       } else {
//         const { error } = await supabase.auth.signInWithPassword({
//           email: FormDataLogin.email,
//           password: FormDataLogin.password,
//         });

//         if (error) {
//           if (error.message.includes('email_not_confirmed')) {
//             throw new Error('Please confirm your email address before signing in');
//           }
//           throw error;
//         }

//         navigate('/dashboard');
//       }
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormDataLogin(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   if (isResetPassword) {
//     return (
//       <div className="max-w-md mx-auto mt-16">
//         <div className="text-center mb-8">
//           <Heart className="h-12 w-12 text-rose-500 mx-auto mb-4" />
//           <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
//           <p className="text-gray-600 mt-2">
//             Enter your email to receive reset instructions
//           </p>
//         </div>

//         <div className="bg-white p-8 rounded-xl shadow-md">
//           <form onSubmit={handleResetPassword} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email address
//               </label>
//               <div className="relative">
//                 <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//                 <input
//                   type="email"
//                   value={resetEmail}
//                   onChange={(e) => setResetEmail(e.target.value)}
//                   className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
//                   placeholder="you@example.com"
//                   required
//                 />
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-rose-500 text-white py-2 px-4 rounded-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? (
//                 <Loader className="h-5 w-5 animate-spin mx-auto" />
//               ) : (
//                 'Send Reset Instructions'
//               )}
//             </button>

//             <button
//               type="button"
//               onClick={() => setIsResetPassword(false)}
//               className="w-full text-gray-600 hover:text-gray-900"
//             >
//               Back to Login
//             </button>
//           </form>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-md mx-auto mt-16">
//       <div className="text-center mb-8">
//         <Heart className="h-12 w-12 text-rose-500 mx-auto mb-4" />
//         <h2 className="text-3xl font-bold text-gray-900">
//           {isSignUp ? 'Create your account' : 'Welcome back'}
//         </h2>
//         <p className="text-gray-600 mt-2">
//           {isSignUp
//             ? 'Start your journey to better relationships'
//             : 'Continue your journey to better relationships'}
//         </p>
//       </div>

//       <div className="bg-white p-8 rounded-xl shadow-md">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Email address
//             </label>
//             <div className="relative">
//               <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//               <input
//                 type="email"
//                 name="email"
//                 required
//                 value={FormDataLogin.email}
//                 onChange={handleInputChange}
//                 className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
//                 placeholder="you@example.com"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Password
//             </label>
//             <div className="relative">
//               <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 required
//                 value={FormDataLogin.password}
//                 onChange={handleInputChange}
//                 className="pl-10 pr-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
//                 placeholder="••••••••"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 {showPassword ? (
//                   <EyeOff className="h-5 w-5" />
//                 ) : (
//                   <Eye className="h-5 w-5" />
//                 )}
//               </button>
//             </div>
//           </div>

//           {isSignUp && (
//             <>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Phone Number <span className="text-gray-500 text-sm font-normal">(Optional)</span>
//                 </label>
//                 <div className="relative">
//                   <Phone className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//                   <input
//                     type="tel"
//                     name="phone_number"
//                     value={FormDataLogin.phone_number}
//                     onChange={handleInputChange}
//                     className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
//                     placeholder="Phone number (Optional)"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Address <span className="text-gray-500 text-sm font-normal">(Optional)</span>
//                 </label>
//                 <div className="space-y-3">
//                   <div className="relative">
//                     <Home className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//                     <input
//                       type="text"
//                       name="address_line1"
//                       value={FormDataLogin.address_line1}
//                       onChange={handleInputChange}
//                       className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
//                       placeholder="Street Address (Optional)"
//                     />
//                   </div>
//                   <input
//                     type="text"
//                     name="address_line2"
//                     value={FormDataLogin.address_line2}
//                     onChange={handleInputChange}
//                     className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
//                     placeholder="Apt, Suite, etc. (Optional)"
//                   />
//                   <div className="grid grid-cols-2 gap-3">
//                     <input
//                       type="text"
//                       name="city"
//                       value={FormDataLogin.city}
//                       onChange={handleInputChange}
//                       className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
//                       placeholder="City (Optional)"
//                     />
//                     <input
//                       type="text"
//                       name="state"
//                       value={FormDataLogin.state}
//                       onChange={handleInputChange}
//                       className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
//                       placeholder="State (Optional)"
//                     />
//                   </div>
//                   <div className="grid grid-cols-2 gap-3">
//                     <input
//                       type="text"
//                       name="postal_code"
//                       value={FormDataLogin.postal_code}
//                       onChange={handleInputChange}
//                       className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
//                       placeholder="Postal Code (Optional)"
//                     />
//                     <input
//                       type="text"
//                       name="country"
//                       value={FormDataLogin.country}
//                       onChange={handleInputChange}
//                       className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
//                       placeholder="Country (Optional)"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-rose-500 text-white py-2 px-4 rounded-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isLoading ? (
//               <Loader className="h-5 w-5 animate-spin mx-auto" />
//             ) : (
//               isSignUp ? 'Create Account' : 'Sign In'
//             )}
//           </button>
//         </form>

//         <div className="mt-6 text-center space-y-2">
//           <button
//             onClick={() => setIsSignUp(!isSignUp)}
//             className="text-sm text-rose-600 hover:text-rose-700"
//           >
//             {isSignUp
//               ? 'Already have an account? Sign in'
//               : "Don't have an account? Sign up"}
//           </button>

//           {!isSignUp && (
//             <div>
//               <button
//                 onClick={() => setIsResetPassword(true)}
//                 className="text-sm text-gray-600 hover:text-gray-900"
//               >
//                 Forgot your password?
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import { INITIAL_FORM_DATA } from '../constants/constants';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Mail,
  Lock,
  Phone,
  Home,
  Loader,
  Eye,
  EyeOff,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FormDataLogin } from '../interfaces/interfaces';
import toast from 'react-hot-toast';

const FormHeader = ({ isSignUp }: { isSignUp: boolean }) => (
  <div className='text-center mb-8'>
    <Heart className='h-12 w-12 text-rose-500 mx-auto mb-4' />
    <h2 className='text-3xl font-bold text-gray-900'>
      {isSignUp ? 'Create your account' : 'Welcome back'}
    </h2>
    <p className='text-gray-600 mt-2'>
      {isSignUp
        ? 'Start your journey to better relationships'
        : 'Continue your journey to better relationships'}
    </p>
  </div>
);

const PasswordInput = ({
  value,
  onChange,
  showPassword,
  togglePassword,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  togglePassword: () => void;
}) => (
  <div className='relative'>
    <Lock className='h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2' />
    <input
      type={showPassword ? 'text' : 'password'}
      name='password'
      required
      value={value}
      onChange={onChange}
      className='pl-10 pr-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500'
      placeholder='••••••••'
    />
    <button
      type='button'
      onClick={togglePassword}
      className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
    >
      {showPassword ? (
        <EyeOff className='h-5 w-5' />
      ) : (
        <Eye className='h-5 w-5' />
      )}
    </button>
  </div>
);

const SubmitButton = ({
  isLoading,
  isSignUp,
}: {
  isLoading: boolean;
  isSignUp: boolean;
}) => (
  <button
    type='submit'
    disabled={isLoading}
    className='w-full bg-rose-500 text-white py-2 px-4 rounded-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  >
    {isLoading ? (
      <Loader className='h-5 w-5 animate-spin mx-auto' />
    ) : isSignUp ? (
      'Create Account'
    ) : (
      'Sign In'
    )}
  </button>
);

const FormFooter = ({
  isSignUp,
  toggleSignUpMode,
  showResetPassword,
}: {
  isSignUp: boolean;
  toggleSignUpMode: () => void;
  showResetPassword: () => void;
}) => (
  <div className='mt-6 text-center space-y-2'>
    <button
      onClick={toggleSignUpMode}
      className='text-sm text-rose-600 hover:text-rose-700'
    >
      {isSignUp
        ? 'Already have an account? Sign in'
        : "Don't have an account? Sign up"}
    </button>

    {!isSignUp && (
      <div>
        <button
          onClick={showResetPassword}
          className='text-sm text-gray-600 hover:text-gray-900'
        >
          Forgot your password?
        </button>
      </div>
    )}
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [FormDataLogin, setFormDataLogin] =
    useState<FormDataLogin>(INITIAL_FORM_DATA);

  // Helper functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataLogin((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSignUpMode = () => {
    setIsSignUp(!isSignUp);
    setFormDataLogin(INITIAL_FORM_DATA);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const showResetPasswordForm = () => setIsResetPassword(true);
  const hideResetPasswordForm = () => setIsResetPassword(false);

  // API functions
  const sendWelcomeEmail = async (email: string) => {
    try {
      const functionUrl = `${
        import.meta.env.VITE_SUPABASE_URL
      }/functions/v1/welcome-email`;
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Failed to send welcome email');
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  };

  const createProfile = async (userId: string) => {
    try {
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (checkError) throw checkError;
      if (existingProfile) return;

      const { error: insertError } = await supabase.from('profiles').insert({
        id: userId,
        email: FormDataLogin.email,
        phone_number: FormDataLogin.phone_number.trim() || null,
        address_line1: FormDataLogin.address_line1.trim() || null,
        address_line2: FormDataLogin.address_line2.trim() || null,
        city: FormDataLogin.city.trim() || null,
        state: FormDataLogin.state.trim() || null,
        postal_code: FormDataLogin.postal_code.trim() || null,
        country: FormDataLogin.country.trim() || null,
        coaching_preferences: {
          methodology: '',
          focus_areas: [],
          communication_style: '',
          spiritual_inclusion: false,
          preferred_experts: [],
        },
      });

      if (insertError) throw insertError;
    } catch (error) {
      console.error('Error in createProfile:', error);
      throw error;
    }
  };

  // Form handlers
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(resetEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success('Password reset instructions sent to your email');
      hideResetPasswordForm();
      setResetEmail('');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : String(error) || 'Error sending reset instructions'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(FormDataLogin.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: FormDataLogin.email,
          password: FormDataLogin.password,
          options: { emailRedirectTo: `${window.location.origin}` },
        });

        if (error) throw error;

        if (data.user) {
          // await createProfile(data.user.id);
          await sendWelcomeEmail(FormDataLogin.email);
          toast.success(
            'Account created successfully! Please check your email to confirm your account.'
          );
          setIsSignUp(false);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: FormDataLogin.email,
          password: FormDataLogin.password,
        });

        if (error) {
          if (error.message.includes('email_not_confirmed')) {
            throw new Error(
              'Please confirm your email address before signing in'
            );
          }
          throw error;
        }

        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id;

        if (userId) {
          await createProfile(userId);
        }

        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Render functions
  const renderResetPasswordForm = () => (
    <div className='max-w-md mx-auto mt-16'>
      <div className='text-center mb-8'>
        <Heart className='h-12 w-12 text-rose-500 mx-auto mb-4' />
        <h2 className='text-3xl font-bold text-gray-900'>Reset Password</h2>
        <p className='text-gray-600 mt-2'>
          Enter your email to receive reset instructions
        </p>
      </div>

      <div className='bg-white p-8 rounded-xl shadow-md'>
        <form onSubmit={handleResetPassword} className='space-y-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Email address
            </label>
            <div className='relative'>
              <Mail className='h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2' />
              <input
                type='email'
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className='pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500'
                placeholder='you@example.com'
                required
              />
            </div>
          </div>

          <SubmitButton isLoading={isLoading} isSignUp={false} />

          <button
            type='button'
            onClick={hideResetPasswordForm}
            className='w-full text-gray-600 hover:text-gray-900'
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );

  const renderAddressFields = () => (
    <>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Phone Number{' '}
          <span className='text-gray-500 text-sm font-normal'>(Optional)</span>
        </label>
        <div className='relative'>
          <Phone className='h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2' />
          <input
            type='tel'
            name='phone_number'
            value={FormDataLogin.phone_number}
            onChange={handleInputChange}
            className='pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500'
            placeholder='Phone number (Optional)'
          />
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Address{' '}
          <span className='text-gray-500 text-sm font-normal'>(Optional)</span>
        </label>
        <div className='space-y-3'>
          <div className='relative'>
            <Home className='h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2' />
            <input
              type='text'
              name='address_line1'
              value={FormDataLogin.address_line1}
              onChange={handleInputChange}
              className='pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500'
              placeholder='Street Address (Optional)'
            />
          </div>
          <input
            type='text'
            name='address_line2'
            value={FormDataLogin.address_line2}
            onChange={handleInputChange}
            className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500'
            placeholder='Apt, Suite, etc. (Optional)'
          />
          <div className='grid grid-cols-2 gap-3'>
            <input
              type='text'
              name='city'
              value={FormDataLogin.city}
              onChange={handleInputChange}
              className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500'
              placeholder='City (Optional)'
            />
            <input
              type='text'
              name='state'
              value={FormDataLogin.state}
              onChange={handleInputChange}
              className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500'
              placeholder='State (Optional)'
            />
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <input
              type='text'
              name='postal_code'
              value={FormDataLogin.postal_code}
              onChange={handleInputChange}
              className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500'
              placeholder='Postal Code (Optional)'
            />
            <input
              type='text'
              name='country'
              value={FormDataLogin.country}
              onChange={handleInputChange}
              className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500'
              placeholder='Country (Optional)'
            />
          </div>
        </div>
      </div>
    </>
  );

  if (isResetPassword) {
    return renderResetPasswordForm();
  }

  return (
    <div className='max-w-md mx-auto mt-16'>
      <FormHeader isSignUp={isSignUp} />

      <div className='bg-white p-8 rounded-xl shadow-md'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Email address
            </label>
            <div className='relative'>
              <Mail className='h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2' />
              <input
                type='email'
                name='email'
                required
                value={FormDataLogin.email}
                onChange={handleInputChange}
                className='pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500'
                placeholder='you@example.com'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Password
            </label>
            <PasswordInput
              value={FormDataLogin.password}
              onChange={handleInputChange}
              showPassword={showPassword}
              togglePassword={togglePasswordVisibility}
            />
          </div>

          {isSignUp && renderAddressFields()}

          <SubmitButton isLoading={isLoading} isSignUp={isSignUp} />
        </form>

        <FormFooter
          isSignUp={isSignUp}
          toggleSignUpMode={toggleSignUpMode}
          showResetPassword={showResetPasswordForm}
        />
      </div>
    </div>
  );
};

export default Login;
