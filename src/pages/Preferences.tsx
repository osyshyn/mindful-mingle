// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Brain, Sparkles, Heart, Compass, Loader,  Leaf } from 'lucide-react';
// import { supabase } from '../lib/supabase';
// import toast from 'react-hot-toast';

// interface CoachingPreferences {
//   methodology: string;
//   focus_areas: string[];
//   communication_style: string;
//   spiritual_inclusion: boolean;
//   preferred_experts: string[];
// }

// const methodologies = [
//   {
//     id: 'goleman',
//     name: 'Goleman EQ Framework',
//     description: 'Focus on self-awareness, self-regulation, motivation, empathy, and social skills',
//     icon: Brain
//   },
//   {
//     id: 'eq-i',
//     name: 'EQ-i 2.0 Model',
//     description: 'Comprehensive approach covering self-perception, decision making, and stress management',
//     icon: Compass
//   },
//   {
//     id: 'mindfulness',
//     name: 'Mindfulness-Based EQ',
//     description: 'Integration of mindfulness practices with emotional intelligence development',
//     icon: Leaf
//   }
// ];

// const focusAreas = [
//   'Relationship Building',
//   'Conflict Resolution',
//   'Self-Awareness',
//   'Leadership Development',
//   'Stress Management',
//   'Communication Skills'
// ];

// const experts = [
//   {
//     id: 'daniel_goleman',
//     name: 'Daniel Goleman',
//     photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
//     expertise: 'Emotional Intelligence Pioneer'
//   },
//   {
//     id: 'travis_bradberry',
//     name: 'Travis Bradberry',
//     photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
//     expertise: 'EQ & Leadership Expert'
//   },
//   {
//     id: 'marc_brackett',
//     name: 'Marc Brackett',
//     photo: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=80&w=200&h=200',
//     expertise: 'Emotional Intelligence Research'
//   },
//   {
//     id: 'susan_david',
//     name: 'Susan David',
//     photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200',
//     expertise: 'Emotional Agility'
//   },
//   {
//     id: 'brene_brown',
//     name: 'Brené Brown',
//     photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
//     expertise: 'Vulnerability & Courage'
//   },
//   {
//     id: 'marshall_rosenberg',
//     name: 'Marshall Rosenberg',
//     photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
//     expertise: 'Nonviolent Communication'
//   }
// ];

// const communicationStyles = [
//   {
//     id: 'direct',
//     name: 'Direct and Straightforward',
//     description: 'Clear, concise guidance without sugarcoating'
//   },
//   {
//     id: 'supportive',
//     name: 'Supportive and Encouraging',
//     description: 'Gentle, positive reinforcement and emotional support'
//   },
//   {
//     id: 'analytical',
//     name: 'Analytical and Detailed',
//     description: 'In-depth analysis with scientific backing'
//   }
// ];

// const defaultPreferences: CoachingPreferences = {
//   methodology: '',
//   focus_areas: [],
//   communication_style: '',
//   spiritual_inclusion: false,
//   preferred_experts: []
// };

// const Preferences = () => {
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const [preferences, setPreferences] = useState<CoachingPreferences>(defaultPreferences);

//   useEffect(() => {
//     loadPreferences();
//   }, []);

//   const createProfile = async (userId: string, email: string) => {
//     try {
//       const { error } = await supabase
//         .from('profiles')
//         .insert({
//           id: userId,
//           email: email,
//           coaching_preferences: defaultPreferences
//         });

//       if (error) throw error;
//     } catch (error) {
//       console.error('Error creating profile:', error);
//       throw error;
//     }
//   };

//   const loadPreferences = async () => {
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) {
//         navigate('/login');
//         return;
//       }

//       // First, check if profile exists
//       const { data: profileData, error: profileError } = await supabase
//         .from('profiles')
//         .select('coaching_preferences, email')
//         .eq('id', user.id)
//         .maybeSingle();

//       if (profileError && profileError.code !== 'PGRST116') {
//         throw profileError;
//       }

//       // If profile doesn't exist, create it
//       if (!profileData) {
//         await createProfile(user.id, user.email || '');
//         setPreferences(defaultPreferences);
//       } else if (profileData.coaching_preferences) {
//         setPreferences(profileData.coaching_preferences);
//       }
//     } catch (error) {
//       toast.error('Error loading preferences');
//       console.error('Error:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSaving(true);

//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) throw new Error('Not authenticated');

//       const { error } = await supabase
//         .from('profiles')
//         .update({
//           coaching_preferences: preferences,
//           updated_at: new Date().toISOString()
//         })
//         .eq('id', user.id);

//       if (error) throw error;
//       toast.success('Preferences saved successfully');
//     } catch (error) {
//       toast.error('Error saving preferences');
//       console.error('Error:', error);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const toggleFocusArea = (area: string) => {
//     setPreferences(prev => ({
//       ...prev,
//       focus_areas: prev.focus_areas.includes(area)
//         ? prev.focus_areas.filter(a => a !== area)
//         : [...prev.focus_areas, area]
//     }));
//   };

//   const toggleExpert = (expertId: string) => {
//     setPreferences(prev => ({
//       ...prev,
//       preferred_experts: prev.preferred_experts.includes(expertId)
//         ? prev.preferred_experts.filter(e => e !== expertId)
//         : [...prev.preferred_experts, expertId]
//     }));
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <Loader className="h-8 w-8 animate-spin text-rose-500" />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="bg-white rounded-xl shadow-md overflow-hidden">
//         <div className="p-6 bg-rose-50 border-b border-rose-100">
//           <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <Sparkles className="h-6 w-6 text-rose-500" />
//             Coaching Preferences
//           </h2>
//           <p className="text-gray-600 mt-1">
//             Customize your coaching experience to match your personal growth journey
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-8">
//           {/* Methodology Selection */}
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Coaching Methodology</h3>
//             <div className="grid md:grid-cols-3 gap-4">
//               {methodologies.map(method => {
//                 const Icon = method.icon;
//                 return (
//                   <label
//                     key={method.id}
//                     className={`relative flex flex-col p-4 border rounded-lg cursor-pointer transition-colors
//                       ${preferences.methodology === method.id
//                         ? 'border-rose-500 bg-rose-50'
//                         : 'border-gray-200 hover:border-rose-200'
//                       }`}
//                   >
//                     <input
//                       type="radio"
//                       name="methodology"
//                       value={method.id}
//                       checked={preferences.methodology === method.id}
//                       onChange={(e) => setPreferences(prev => ({
//                         ...prev,
//                         methodology: e.target.value
//                       }))}
//                       className="sr-only"
//                     />
//                     <Icon className="h-6 w-6 text-rose-500 mb-2" />
//                     <div className="font-medium text-gray-900">{method.name}</div>
//                     <p className="text-sm text-gray-500 mt-1">{method.description}</p>
//                   </label>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Focus Areas */}
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Focus Areas</h3>
//             <div className="grid md:grid-cols-3 gap-3">
//               {focusAreas.map(area => (
//                 <label
//                   key={area}
//                   className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors
//                     ${preferences.focus_areas.includes(area)
//                       ? 'border-rose-500 bg-rose-50'
//                       : 'border-gray-200 hover:border-rose-200'
//                     }`}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={preferences.focus_areas.includes(area)}
//                     onChange={() => toggleFocusArea(area)}
//                     className="sr-only"
//                   />
//                   <Heart className={`h-5 w-5 mr-2 ${
//                     preferences.focus_areas.includes(area)
//                       ? 'text-rose-500'
//                       : 'text-gray-400'
//                   }`} />
//                   <span className="text-gray-900">{area}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Communication Style */}
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Style</h3>
//             <div className="grid md:grid-cols-3 gap-4">
//               {communicationStyles.map(style => (
//                 <label
//                   key={style.id}
//                   className={`relative flex flex-col p-4 border rounded-lg cursor-pointer transition-colors
//                     ${preferences.communication_style === style.id
//                       ? 'border-rose-500 bg-rose-50'
//                       : 'border-gray-200 hover:border-rose-200'
//                     }`}
//                 >
//                   <input
//                     type="radio"
//                     name="communication_style"
//                     value={style.id}
//                     checked={preferences.communication_style === style.id}
//                     onChange={(e) => setPreferences(prev => ({
//                       ...prev,
//                       communication_style: e.target.value
//                     }))}
//                     className="sr-only"
//                   />
//                   <div className="font-medium text-gray-900">{style.name}</div>
//                   <p className="text-sm text-gray-500 mt-1">{style.description}</p>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Spiritual Inclusion */}
//           <div>
//             <label className="flex items-center space-x-3">
//               <input
//                 type="checkbox"
//                 checked={preferences.spiritual_inclusion}
//                 onChange={(e) => setPreferences(prev => ({
//                   ...prev,
//                   spiritual_inclusion: e.target.checked
//                 }))}
//                 className="rounded border-gray-300 text-rose-500 focus:ring-rose-500"
//               />
//               <div>
//                 <span className="text-gray-900 font-medium">Include Spiritual Perspectives</span>
//                 <p className="text-sm text-gray-500">
//                   Incorporate spiritual and mindfulness elements in coaching
//                 </p>
//               </div>
//             </label>
//           </div>

//           {/* Preferred Experts */}
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               Preferred Experts & Thought Leaders
//             </h3>
//             <div className="grid md:grid-cols-3 gap-4">
//               {experts.map(expert => (
//                 <label
//                   key={expert.id}
//                   className={`flex flex-col p-4 border rounded-lg cursor-pointer transition-colors
//                     ${preferences.preferred_experts.includes(expert.id)
//                       ? 'border-rose-500 bg-rose-50'
//                       : 'border-gray-200 hover:border-rose-200'
//                     }`}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={preferences.preferred_experts.includes(expert.id)}
//                     onChange={() => toggleExpert(expert.id)}
//                     className="sr-only"
//                   />
//                   <div className="flex items-center space-x-3 mb-3">
//                     <img
//                       src={expert.photo}
//                       alt={expert.name}
//                       className="w-12 h-12 rounded-full object-cover"
//                     />
//                     <div>
//                       <div className="font-medium text-gray-900">{expert.name}</div>
//                       <div className="text-sm text-gray-500">{expert.expertise}</div>
//                     </div>
//                   </div>
//                 </label>
//               ))}
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={isSaving}
//             className="w-full bg-rose-500 text-white py-3 px-4 rounded-lg hover:bg-rose-600
//               focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2
//               disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isSaving ? (
//               <Loader className="h-5 w-5 animate-spin mx-auto" />
//             ) : (
//               'Save Preferences'
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Preferences;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Heart, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CoachingPreferences, OptionType } from '../interfaces/interfaces';
import {
  defaultPreferences,
  experts,
  methodologies,
  focusAreas,
  communicationStyles,
} from '../constants/constants';
import toast from 'react-hot-toast';

const RadioOption: React.FC<{
  option: OptionType;
  checked: boolean;
  onChange: (value: string) => void;
}> = ({ option, checked, onChange }) => {
  const Icon = option.icon;
  return (
    <label
      className={`relative flex flex-col p-4 border rounded-lg cursor-pointer transition-colors
      ${
        checked
          ? 'border-rose-500 bg-rose-50'
          : 'border-gray-200 hover:border-rose-200'
      }`}
    >
      <input
        type='radio'
        checked={checked}
        onChange={() => onChange(option.id)}
        className='sr-only'
      />
      {Icon && <Icon className='h-6 w-6 text-rose-500 mb-2' />}
      <div className='font-medium text-gray-900'>{option.name}</div>
      {option.description && (
        <p className='text-sm text-gray-500 mt-1'>{option.description}</p>
      )}
    </label>
  );
};

const CheckboxOption: React.FC<{
  option: OptionType | string;
  checked: boolean;
  onChange: (value: string) => void;
}> = ({ option, checked, onChange }) => {
  const id = typeof option === 'string' ? option : option.id;
  const name = typeof option === 'string' ? option : option.name;

  return (
    <label
      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors
      ${
        checked
          ? 'border-rose-500 bg-rose-50'
          : 'border-gray-200 hover:border-rose-200'
      }`}
    >
      <input
        type='checkbox'
        checked={checked}
        onChange={() => onChange(id)}
        className='sr-only'
      />
      <Heart
        className={`h-5 w-5 mr-2 ${
          checked ? 'text-rose-500' : 'text-gray-400'
        }`}
      />
      <span className='text-gray-900'>{name}</span>
    </label>
  );
};

const ExpertOption: React.FC<{
  expert: OptionType;
  checked: boolean;
  onChange: (value: string) => void;
}> = ({ expert, checked, onChange }) => (
  <label
    className={`flex flex-col p-4 border rounded-lg cursor-pointer transition-colors
    ${
      checked
        ? 'border-rose-500 bg-rose-50'
        : 'border-gray-200 hover:border-rose-200'
    }`}
  >
    <input
      type='checkbox'
      checked={checked}
      onChange={() => onChange(expert.id)}
      className='sr-only'
    />
    <div className='flex items-center space-x-3 mb-3'>
      <img
        src={expert.photo}
        alt={expert.name}
        className='w-12 h-12 rounded-full object-cover'
      />
      <div>
        <div className='font-medium text-gray-900'>{expert.name}</div>
        <div className='text-sm text-gray-500'>{expert.expertise}</div>
      </div>
    </div>
  </label>
);

const PreferencesForm: React.FC<{
  preferences: CoachingPreferences;
  isSaving: boolean;
  onSave: (e: React.FormEvent) => void;
  onPreferenceChange: <K extends keyof CoachingPreferences>(
    key: K,
    value: CoachingPreferences[K]
  ) => void;
}> = ({ preferences, onSave, isSaving, onPreferenceChange }) => {
  return (
    <form onSubmit={onSave} className='p-6 space-y-8'>
      {/* Methodology Selection */}
      <div>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          Coaching Methodology
        </h3>
        <div className='grid md:grid-cols-3 gap-4'>
          {methodologies.map((method) => (
            <RadioOption
              key={method.id}
              option={method}
              checked={preferences.methodology === method.id}
              onChange={(value) => onPreferenceChange('methodology', value)}
            />
          ))}
        </div>
      </div>

      {/* Focus Areas */}
      <div>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          Focus Areas
        </h3>
        <div className='grid md:grid-cols-3 gap-3'>
          {focusAreas.map((area) => (
            <CheckboxOption
              key={area}
              option={area}
              checked={preferences.focus_areas.includes(area)}
              onChange={(value) => {
                const newAreas = preferences.focus_areas.includes(value)
                  ? preferences.focus_areas.filter((a) => a !== value)
                  : [...preferences.focus_areas, value];
                onPreferenceChange('focus_areas', newAreas);
              }}
            />
          ))}
        </div>
      </div>

      {/* Communication Style */}
      <div>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          Communication Style
        </h3>
        <div className='grid md:grid-cols-3 gap-4'>
          {communicationStyles.map((style) => (
            <RadioOption
              key={style.id}
              option={style}
              checked={preferences.communication_style === style.id}
              onChange={(value) =>
                onPreferenceChange('communication_style', value)
              }
            />
          ))}
        </div>
      </div>

      {/* Spiritual Inclusion */}
      <div>
        <label className='flex items-center space-x-3'>
          <input
            type='checkbox'
            checked={preferences.spiritual_inclusion}
            onChange={(e) =>
              onPreferenceChange('spiritual_inclusion', e.target.checked)
            }
            className='rounded border-gray-300 text-rose-500 focus:ring-rose-500'
          />
          <div>
            <span className='text-gray-900 font-medium'>
              Include Spiritual Perspectives
            </span>
            <p className='text-sm text-gray-500'>
              Incorporate spiritual and mindfulness elements in coaching
            </p>
          </div>
        </label>
      </div>

      {/* Preferred Experts */}
      <div>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          Preferred Experts & Thought Leaders
        </h3>
        <div className='grid md:grid-cols-3 gap-4'>
          {experts.map((expert) => (
            <ExpertOption
              key={expert.id}
              expert={expert}
              checked={preferences.preferred_experts.includes(expert.id)}
              onChange={(value) => {
                const newExperts = preferences.preferred_experts.includes(value)
                  ? preferences.preferred_experts.filter((e) => e !== value)
                  : [...preferences.preferred_experts, value];
                onPreferenceChange('preferred_experts', newExperts);
              }}
            />
          ))}
        </div>
      </div>

      <button
        type='submit'
        disabled={isSaving}
        className='w-full bg-rose-500 text-white py-3 px-4 rounded-lg hover:bg-rose-600 
          focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 
          disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isSaving ? (
          <Loader className='h-5 w-5 animate-spin mx-auto' />
        ) : (
          'Save Preferences'
        )}
      </button>
    </form>
  );
};

// Main Component
const Preferences: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] =
    useState<CoachingPreferences>(defaultPreferences);

  const loadPreferences = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('coaching_preferences, email')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (!profileData) {
        await createProfile(user.id, user.email || '');
        setPreferences(defaultPreferences);
      } else if (profileData.coaching_preferences) {
        setPreferences(profileData.coaching_preferences);
      }
    } catch (error) {
      toast.error('Error loading preferences');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createProfile = async (userId: string, email: string) => {
    try {
      const { error } = await supabase.from('profiles').insert({
        id: userId,
        email: email,
        coaching_preferences: defaultPreferences,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({
          coaching_preferences: preferences,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success('Preferences saved successfully');
    } catch (error) {
      toast.error('Error saving preferences');
      console.error('Error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    loadPreferences();
  }, []);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader className='h-8 w-8 animate-spin text-rose-500' />
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='bg-white rounded-xl shadow-md overflow-hidden'>
        <div className='p-6 bg-rose-50 border-b border-rose-100'>
          <h2 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
            <Sparkles className='h-6 w-6 text-rose-500' />
            Coaching Preferences
          </h2>
          <p className='text-gray-600 mt-1'>
            Customize your coaching experience to match your personal growth
            journey
          </p>
        </div>

        <PreferencesForm
          preferences={preferences}
          isSaving={isSaving}
          onSave={handleSubmit}
          onPreferenceChange={(key, value) =>
            setPreferences((prev) => ({ ...prev, [key]: value }))
          }
        />
      </div>
    </div>
  );
};

export default Preferences;
