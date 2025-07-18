// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Heart, Star, Target, Clock, ChevronRight, Plus, Loader, CheckCircle2 } from 'lucide-react';
// import { supabase } from '../lib/supabase';
// import toast from 'react-hot-toast';
// import { format } from 'date-fns';

// interface Relationship {
//   id: string;
//   name: string;
//   relationship_type: string;
//   specific_role: string;
//   notes: string;
//   created_at: string;
// }

// interface Assessment {
//   id: string;
//   score: number;
//   taken_at: string;
//   answers: Record<string, number>;
// }

// interface Goal {
//   id: string;
//   title: string;
//   description: string;
//   status: 'not_started' | 'in_progress' | 'completed';
//   due_date: string | null;
//   completed_at: string | null;
//   created_at: string;
// }

// const relationshipTypes = {
//   family: 'Family',
//   friend: 'Friend',
//   work: 'Work',
//   romantic: 'Romantic',
//   other: 'Other'
// };

// const RelationshipDetail = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(true);
//   const [relationship, setRelationship] = useState<Relationship | null>(null);
//   const [assessments, setAssessments] = useState<Assessment[]>([]);
//   const [goals, setGoals] = useState<Goal[]>([]);
//   const [showAddGoalModal, setShowAddGoalModal] = useState(false);
//   const [newGoal, setNewGoal] = useState({
//     title: '',
//     description: '',
//     due_date: ''
//   });

//   useEffect(() => {
//     loadRelationshipData();
//   }, [id]);

//   const loadRelationshipData = async () => {
//     try {
//       if (!id) return;

//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) {
//         navigate('/login');
//         return;
//       }

//       // Load relationship details
//       const { data: relationshipData, error: relationshipError } = await supabase
//         .from('relationships')
//         .select('*')
//         .eq('id', id)
//         .eq('user_id', user.id)
//         .single();

//       if (relationshipError) throw relationshipError;
//       if (!relationshipData) {
//         toast.error('Relationship not found');
//         navigate('/relationships');
//         return;
//       }

//       setRelationship(relationshipData);

//       // Load assessments
//       const { data: assessmentData, error: assessmentError } = await supabase
//         .from('relationship_assessments')
//         .select('*')
//         .eq('relationship_id', id)
//         .order('taken_at', { ascending: false });

//       if (assessmentError) throw assessmentError;
//       setAssessments(assessmentData || []);

//       // Load goals
//       const { data: goalData, error: goalError } = await supabase
//         .from('relationship_goals')
//         .select('*')
//         .eq('relationship_id', id)
//         .order('created_at', { ascending: false });

//       if (goalError) throw goalError;
//       setGoals(goalData || []);
//     } catch (error) {
//       toast.error('Error loading relationship details');
//       console.error('Error:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAddGoal = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!relationship) return;

//     try {
//       const { data, error } = await supabase
//         .from('relationship_goals')
//         .insert({
//           relationship_id: relationship.id,
//           title: newGoal.title,
//           description: newGoal.description,
//           due_date: newGoal.due_date || null,
//           status: 'not_started'
//         })
//         .select()
//         .single();

//       if (error) throw error;

//       setGoals(prev => [data, ...prev]);
//       setShowAddGoalModal(false);
//       setNewGoal({ title: '', description: '', due_date: '' });
//       toast.success('Goal added successfully');
//     } catch (error) {
//       toast.error('Error adding goal');
//       console.error('Error:', error);
//     }
//   };

//   const handleUpdateGoalStatus = async (goalId: string, newStatus: 'not_started' | 'in_progress' | 'completed') => {
//     try {
//       const { error } = await supabase
//         .from('relationship_goals')
//         .update({
//           status: newStatus,
//           completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
//           updated_at: new Date().toISOString()
//         })
//         .eq('id', goalId);

//       if (error) throw error;

//       setGoals(prev => prev.map(goal =>
//         goal.id === goalId
//           ? { ...goal, status: newStatus, completed_at: newStatus === 'completed' ? new Date().toISOString() : null }
//           : goal
//       ));

//       toast.success('Goal status updated');
//     } catch (error) {
//       toast.error('Error updating goal status');
//       console.error('Error:', error);
//     }
//   };

//   const getScoreColor = (score: number) => {
//     if (score >= 80) return 'bg-green-100 text-green-700';
//     if (score >= 60) return 'bg-yellow-100 text-yellow-700';
//     return 'bg-red-100 text-red-700';
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'completed':
//         return 'bg-green-100 text-green-700';
//       case 'in_progress':
//         return 'bg-blue-100 text-blue-700';
//       default:
//         return 'bg-gray-100 text-gray-700';
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <Loader className="h-8 w-8 animate-spin text-rose-500" />
//       </div>
//     );
//   }

//   if (!relationship) return null;

//   const latestAssessment = assessments[0];
//   const completedGoalsCount = goals.filter(g => g.status === 'completed').length;

//   return (
//     <div className="max-w-6xl mx-auto">
//       {/* Header */}
//       <div className="mb-8">
//         <button
//           onClick={() => navigate('/relationships')}
//           className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
//         >
//           <ChevronRight className="h-5 w-5 mr-2 rotate-180" />
//           Back to Relationships
//         </button>

//         <div className="flex items-start justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">{relationship.name}</h1>
//             <div className="flex items-center space-x-3 mt-2">
//               <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
//                 {relationshipTypes[relationship.relationship_type as keyof typeof relationshipTypes]}
//               </span>
//               <span className="text-gray-500">{relationship.specific_role}</span>
//             </div>
//             {relationship.notes && (
//               <p className="text-gray-600 mt-2">{relationship.notes}</p>
//             )}
//           </div>

//           <button
//             onClick={() => navigate(`/relationships/${relationship.id}/assess`)}
//             className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors"
//           >
//             Take Assessment
//           </button>
//         </div>
//       </div>

//       {/* Stats Overview */}
//       <div className="grid md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white rounded-xl shadow-sm p-6">
//           <div className="flex items-center space-x-3">
//             <div className={`p-2 rounded-lg ${latestAssessment ? getScoreColor(latestAssessment.score) : 'bg-gray-100 text-gray-600'}`}>
//               <Star className="h-6 w-6" />
//             </div>
//             <div>
//               <div className="text-sm text-gray-500">Latest Score</div>
//               <div className="font-semibold">
//                 {latestAssessment ? `${latestAssessment.score}%` : 'Not assessed'}
//               </div>
//               {latestAssessment && (
//                 <div className="text-sm text-gray-500">
//                   {format(new Date(latestAssessment.taken_at), 'MMM d, yyyy')}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm p-6">
//           <div className="flex items-center space-x-3">
//             <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
//               <Target className="h-6 w-6" />
//             </div>
//             <div>
//               <div className="text-sm text-gray-500">Goals Progress</div>
//               <div className="font-semibold">
//                 {completedGoalsCount} of {goals.length} completed
//               </div>
//               <div className="text-sm text-gray-500">
//                 {goals.length === 0 ? 'No goals set' : `${Math.round((completedGoalsCount / goals.length) * 100)}% complete`}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm p-6">
//           <div className="flex items-center space-x-3">
//             <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
//               <Clock className="h-6 w-6" />
//             </div>
//             <div>
//               <div className="text-sm text-gray-500">Tracking Since</div>
//               <div className="font-semibold">
//                 {format(new Date(relationship.created_at), 'MMM d, yyyy')}
//               </div>
//               <div className="text-sm text-gray-500">
//                 {assessments.length} assessments taken
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Goals Section */}
//       <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
//         <div className="p-6 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <Target className="h-6 w-6 text-rose-500" />
//             <h2 className="text-xl font-semibold text-gray-900">Relationship Goals</h2>
//           </div>
//           <button
//             onClick={() => setShowAddGoalModal(true)}
//             className="flex items-center space-x-2 text-rose-500 hover:text-rose-600"
//           >
//             <Plus className="h-5 w-5" />
//             <span>Add Goal</span>
//           </button>
//         </div>

//         <div className="p-6">
//           {goals.length === 0 ? (
//             <div className="text-center py-8">
//               <Target className="h-12 w-12 text-gray-400 mx-auto mb-3" />
//               <p className="text-gray-500">No goals set yet</p>
//               <button
//                 onClick={() => setShowAddGoalModal(true)}
//                 className="mt-4 text-rose-500 hover:text-rose-600 font-medium"
//               >
//                 Set your first goal
//               </button>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {goals.map(goal => (
//                 <div
//                   key={goal.id}
//                   className="border rounded-lg p-4 hover:border-rose-200 transition-colors"
//                 >
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <h3 className="font-medium text-gray-900">{goal.title}</h3>
//                       {goal.description && (
//                         <p className="text-gray-600 mt-1">{goal.description}</p>
//                       )}
//                       <div className="flex items-center space-x-3 mt-2">
//                         <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
//                           {goal.status.replace('_', ' ').charAt(0).toUpperCase() + goal.status.slice(1).replace('_', ' ')}
//                         </span>
//                         {goal.due_date && (
//                           <span className="text-sm text-gray-500">
//                             Due {format(new Date(goal.due_date), 'MMM d, yyyy')}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     <select
//                       value={goal.status}
//                       onChange={(e) => handleUpdateGoalStatus(goal.id, e.target.value as 'not_started' | 'in_progress' | 'completed')}
//                       className="ml-4 rounded-lg border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
//                     >
//                       <option value="not_started">Not Started</option>
//                       <option value="in_progress">In Progress</option>
//                       <option value="completed">Completed</option>
//                     </select>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Assessment History */}
//       <div className="bg-white rounded-xl shadow-md overflow-hidden">
//         <div className="p-6 bg-rose-50 border-b border-rose-100">
//           <div className="flex items-center space-x-3">
//             <Heart className="h-6 w-6 text-rose-500" />
//             <h2 className="text-xl font-semibold text-gray-900">Assessment History</h2>
//           </div>
//         </div>

//         <div className="p-6">
//           {assessments.length === 0 ? (
//             <div className="text-center py-8">
//               <Star className="h-12 w-12 text-gray-400 mx-auto mb-3" />
//               <p className="text-gray-500">No assessments taken yet</p>
//               <button
//                 onClick={() => navigate(`/relationships/${relationship.id}/assess`)}
//                 className="mt-4 text-rose-500 hover:text-rose-600 font-medium"
//               >
//                 Take your first assessment
//               </button>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {assessments.map(assessment => (
//                 <div
//                   key={assessment.id}
//                   className="border rounded-lg p-4"
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-3">
//                       <div className={`p-2 rounded-lg ${getScoreColor(assessment.score)}`}>
//                         <Star className="h-5 w-5" />
//                       </div>
//                       <div>
//                         <div className="font-medium">{assessment.score}%</div>
//                         <div className="text-sm text-gray-500">
//                           {format(new Date(assessment.taken_at), 'MMM d, yyyy')}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Add Goal Modal */}
//       {showAddGoalModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
//             <div className="p-6">
//               <h3 className="text-xl font-semibold text-gray-900 mb-4">
//                 Add New Goal
//               </h3>
//               <form onSubmit={handleAddGoal} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Goal Title
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     value={newGoal.title}
//                     onChange={(e) => setNewGoal(prev => ({
//                       ...prev,
//                       title: e.target.value
//                     }))}
//                     className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
//                     placeholder="Enter goal title"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Description
//                   </label>
//                   <textarea
//                     value={newGoal.description}
//                     onChange={(e) => setNewGoal(prev => ({
//                       ...prev,
//                       description: e.target.value
//                     }))}
//                     className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
//                     rows={3}
//                     placeholder="Describe your goal"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Due Date (Optional)
//                   </label>
//                   <input
//                     type="date"
//                     value={newGoal.due_date}
//                     onChange={(e) => setNewGoal(prev => ({
//                       ...prev,
//                       due_date: e.target.value
//                     }))}
//                     className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
//                   />
//                 </div>

//                 <div className="flex justify-end space-x-3 mt-6">
//                   <button
//                     type="button"
//                     onClick={() => setShowAddGoalModal(false)}
//                     className="px-4 py-2 text-gray-700 hover:text-gray-900"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors"
//                   >
//                     Add Goal
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RelationshipDetail;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Heart,
  Star,
  Target,
  Clock,
  ChevronRight,
  Plus,
  Loader,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { RELATIONSHIP_TYPES_DETAIL, STATUS_COLORS } from '../constants/constants';
import {
  RelationshipDetailInterface,
  Assessment,
  GoalDetailInterface,
  NewGoalForm,
  GoalStatus,
} from '../interfaces/interfaces';
import { format } from 'date-fns';

const RelationshipDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [relationship, setRelationship] =
    useState<RelationshipDetailInterface | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [goals, setGoals] = useState<GoalDetailInterface[]>([]);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState<NewGoalForm>({
    title: '',
    description: '',
    due_date: '',
  });

  // Effects
  useEffect(() => {
    if (id) {
      loadRelationshipData();
    }
  }, [id]);

  // Data fetching
  const loadRelationshipData = async () => {
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      await Promise.all([
        fetchRelationshipDetails(user.id),
        fetchAssessments(),
        fetchGoals(),
      ]);
    } catch (error) {
      handleDataLoadError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRelationshipDetails = async (userId: string) => {
    const { data, error } = await supabase
      .from('relationships')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    if (!data) {
      toast.error('Relationship not found');
      navigate('/relationships');
      return;
    }

    setRelationship(data);
  };

  const fetchAssessments = async () => {
    const { data, error } = await supabase
      .from('relationship_assessments')
      .select('*')
      .eq('relationship_id', id)
      .order('taken_at', { ascending: false });

    if (error) throw error;
    setAssessments(data || []);
  };

  const fetchGoals = async () => {
    const { data, error } = await supabase
      .from('relationship_goals')
      .select('*')
      .eq('relationship_id', id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setGoals(data || []);
  };

  const handleDataLoadError = (error: unknown) => {
    toast.error('Error loading relationship details');
    console.error('Error:', error);
  };

  // Goal management
  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!relationship) return;

    try {
      const { data, error } = await supabase
        .from('relationship_goals')
        .insert({
          relationship_id: relationship.id,
          ...newGoal,
          due_date: newGoal.due_date || null,
          status: 'not_started',
        })
        .select()
        .single();

      if (error) throw error;

      setGoals((prev) => [data, ...prev]);
      closeGoalModal();
      toast.success('Goal added successfully');
    } catch (error) {
      handleGoalError(error);
    }
  };

  const handleUpdateGoalStatus = async (
    goalId: string,
    newStatus: GoalStatus
  ) => {
    try {
      const { error } = await supabase
        .from('relationship_goals')
        .update({
          status: newStatus,
          completed_at:
            newStatus === 'completed' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', goalId);

      if (error) throw error;

      updateGoalState(goalId, newStatus);
      toast.success('Goal status updated');
    } catch (error) {
      handleGoalError(error);
    }
  };

  const updateGoalState = (goalId: string, newStatus: GoalStatus) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              status: newStatus,
              completed_at:
                newStatus === 'completed' ? new Date().toISOString() : null,
            }
          : goal
      )
    );
  };

  const handleGoalError = (error: unknown) => {
    toast.error('Error processing goal');
    console.error('Error:', error);
  };

  const closeGoalModal = () => {
    setShowAddGoalModal(false);
    setNewGoal({ title: '', description: '', due_date: '' });
  };


  // const getScoreColor = (score: number) => {
  //   if (score >= 80) return 'bg-green-100 text-green-700';
  //   if (score >= 60) return 'bg-yellow-100 text-yellow-700';
  //   return 'bg-red-100 text-red-700';
  // };

  // const getStatusDisplay = (status: string) => {
  //   return (
  //     status.replace('_', ' ').charAt(0).toUpperCase() +
  //     status.slice(1).replace('_', ' ')
  //   );
  // };

  const completedGoalsCount = goals.filter(
    (g) => g.status === 'completed'
  ).length;
  const latestAssessment = assessments[0];

  // Loading state
  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader className='h-8 w-8 animate-spin text-rose-500' />
      </div>
    );
  }

  if (!relationship) return null;

  return (
    <div className='max-w-6xl mx-auto'>
      <Header
        relationship={relationship}
        onBack={() => navigate('/relationships')}
        onAssess={() => navigate(`/relationships/${relationship.id}/assess`)}
      />

      <StatsOverview
        latestAssessment={latestAssessment}
        completedGoalsCount={completedGoalsCount}
        goalsCount={goals.length}
        createdAt={relationship.created_at}
        assessmentsCount={assessments.length}
      />

      <GoalsSection
        goals={goals}
        onAddGoal={() => setShowAddGoalModal(true)}
        onUpdateGoalStatus={handleUpdateGoalStatus}
      />

      <AssessmentHistory
        assessments={assessments}
        relationshipId={relationship.id}
      />

      <AddGoalModal
        isOpen={showAddGoalModal}
        newGoal={newGoal}
        onClose={closeGoalModal}
        onSubmit={handleAddGoal}
        onChange={setNewGoal}
      />
    </div>
  );
};

// Sub-components
const Header = ({
  relationship,
  onBack,
  onAssess,
}: {
  relationship: RelationshipDetailInterface;
  onBack: () => void;
  onAssess: () => void;
}) => (
  <div className='mb-8'>
    <button
      onClick={onBack}
      className='flex items-center text-gray-600 hover:text-gray-900 mb-4'
    >
      <ChevronRight className='h-5 w-5 mr-2 rotate-180' />
      Back to Relationships
    </button>

    <div className='flex items-start justify-between'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>
          {relationship.name}
        </h1>
        <div className='flex items-center space-x-3 mt-2'>
          <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800'>
            {RELATIONSHIP_TYPES_DETAIL[relationship.relationship_type]}
          </span>
          <span className='text-gray-500'>{relationship.specific_role}</span>
        </div>
        {relationship.notes && (
          <p className='text-gray-600 mt-2'>{relationship.notes}</p>
        )}
      </div>

      <button
        onClick={onAssess}
        className='bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors'
      >
        Take Assessment
      </button>
    </div>
  </div>
);

const StatsOverview = ({
  latestAssessment,
  completedGoalsCount,
  goalsCount,
  createdAt,
  assessmentsCount,
}: {
  latestAssessment?: Assessment;
  completedGoalsCount: number;
  goalsCount: number;
  createdAt: string;
  assessmentsCount: number;
}) => {
  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-600';
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className='grid md:grid-cols-3 gap-6 mb-8'>
      <StatCard
        icon={<Star className='h-6 w-6' />}
        iconClass={getScoreColor(latestAssessment?.score)}
        title='Latest Score'
        value={latestAssessment ? `${latestAssessment.score}%` : 'Not assessed'}
        subtext={
          latestAssessment &&
          format(new Date(latestAssessment.taken_at), 'MMM d, yyyy')
        }
      />

      <StatCard
        icon={<Target className='h-6 w-6' />}
        iconClass='bg-blue-100 text-blue-700'
        title='Goals Progress'
        value={`${completedGoalsCount} of ${goalsCount} completed`}
        subtext={
          goalsCount === 0
            ? 'No goals set'
            : `${Math.round(
                (completedGoalsCount / goalsCount) * 100
              )}% complete`
        }
      />

      <StatCard
        icon={<Clock className='h-6 w-6' />}
        iconClass='bg-rose-100 text-rose-700'
        title='Tracking Since'
        value={format(new Date(createdAt), 'MMM d, yyyy')}
        subtext={`${assessmentsCount} assessments taken`}
      />
    </div>
  );
};

const StatCard = ({
  icon,
  iconClass,
  title,
  value,
  subtext,
}: {
  icon: React.ReactNode;
  iconClass: string;
  title: string;
  value: string;
  subtext?: string;
}) => (
  <div className='bg-white rounded-xl shadow-sm p-6'>
    <div className='flex items-center space-x-3'>
      <div className={`p-2 rounded-lg ${iconClass}`}>{icon}</div>
      <div>
        <div className='text-sm text-gray-500'>{title}</div>
        <div className='font-semibold'>{value}</div>
        {subtext && <div className='text-sm text-gray-500'>{subtext}</div>}
      </div>
    </div>
  </div>
);

const GoalsSection = ({
  goals,
  onAddGoal,
  onUpdateGoalStatus,
}: {
  goals: GoalDetailInterface[];
  onAddGoal: () => void;
  onUpdateGoalStatus: (id: string, status: GoalStatus) => void;
}) => (
  <div className='bg-white rounded-xl shadow-md overflow-hidden mb-8'>
    <SectionHeader
      icon={<Target className='h-6 w-6 text-rose-500' />}
      title='Relationship Goals'
      action={
        <button
          onClick={onAddGoal}
          className='flex items-center space-x-2 text-rose-500 hover:text-rose-600'
        >
          <Plus className='h-5 w-5' />
          <span>Add Goal</span>
        </button>
      }
    />

    <div className='p-6'>
      {goals.length === 0 ? (
        <EmptyState
          icon={<Target className='h-12 w-12 text-gray-400' />}
          message='No goals set yet'
          actionText='Set your first goal'
          onAction={onAddGoal}
        />
      ) : (
        <div className='space-y-4'>
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onUpdateStatus={onUpdateGoalStatus}
            />
          ))}
        </div>
      )}
    </div>
  </div>
);

const GoalCard = ({
  goal,
  onUpdateStatus,
}: {
  goal: GoalDetailInterface;
  onUpdateStatus: (id: string, status: GoalStatus) => void;
}) => (
  <div className='border rounded-lg p-4 hover:border-rose-200 transition-colors'>
    <div className='flex items-start justify-between'>
      <div>
        <h3 className='font-medium text-gray-900'>{goal.title}</h3>
        {goal.description && (
          <p className='text-gray-600 mt-1'>{goal.description}</p>
        )}
        <div className='flex items-center space-x-3 mt-2'>
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              STATUS_COLORS[goal.status]
            }`}
          >
            {goal.status.replace('_', ' ').charAt(0).toUpperCase() +
              goal.status.slice(1).replace('_', ' ')}
          </span>
          {goal.due_date && (
            <span className='text-sm text-gray-500'>
              Due {format(new Date(goal.due_date), 'MMM d, yyyy')}
            </span>
          )}
        </div>
      </div>
      <select
        value={goal.status}
        onChange={(e) => onUpdateStatus(goal.id, e.target.value as GoalStatus)}
        className='ml-4 rounded-lg border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500'
      >
        <option value='not_started'>Not Started</option>
        <option value='in_progress'>In Progress</option>
        <option value='completed'>Completed</option>
      </select>
    </div>
  </div>
);

const AssessmentHistory = ({
  assessments,
  relationshipId,
}: {
  assessments: Assessment[];
  relationshipId: string;
}) => {
  const navigate = useNavigate();
  return (
    <div className='bg-white rounded-xl shadow-md overflow-hidden'>
      <SectionHeader
        icon={<Heart className='h-6 w-6 text-rose-500' />}
        title='Assessment History'
      />

      <div className='p-6'>
        {assessments.length === 0 ? (
          <EmptyState
            icon={<Star className='h-12 w-12 text-gray-400' />}
            message='No assessments taken yet'
            actionText='Take your first assessment'
            onAction={() => navigate(`/relationships/${relationshipId}/assess`)}
          />
        ) : (
          <div className='space-y-4'>
            {assessments.map((assessment) => (
              <AssessmentCard key={assessment.id} assessment={assessment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AssessmentCard = ({ assessment }: { assessment: Assessment }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className='border rounded-lg p-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <div className={`p-2 rounded-lg ${getScoreColor(assessment.score)}`}>
            <Star className='h-5 w-5' />
          </div>
          <div>
            <div className='font-medium'>{assessment.score}%</div>
            <div className='text-sm text-gray-500'>
              {format(new Date(assessment.taken_at), 'MMM d, yyyy')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({
  icon,
  title,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}) => (
  <div className='p-6 bg-rose-50 border-b border-rose-100 flex items-center justify-between'>
    <div className='flex items-center space-x-3'>
      {icon}
      <h2 className='text-xl font-semibold text-gray-900'>{title}</h2>
    </div>
    {action}
  </div>
);

const EmptyState = ({
  icon,
  message,
  actionText,
  onAction,
}: {
  icon: React.ReactNode;
  message: string;
  actionText: string;
  onAction: () => void;
}) => (
  <div className='text-center py-8'>
    <div className='mx-auto mb-3 h-12 w-12'>{icon}</div>
    <p className='text-gray-500'>{message}</p>
    <button
      onClick={onAction}
      className='mt-4 text-rose-500 hover:text-rose-600 font-medium'
    >
      {actionText}
    </button>
  </div>
);

const AddGoalModal = ({
  isOpen,
  newGoal,
  onClose,
  onSubmit,
  onChange,
}: {
  isOpen: boolean;
  newGoal: NewGoalForm;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (form: NewGoalForm) => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-xl shadow-lg max-w-md w-full'>
        <div className='p-6'>
          <h3 className='text-xl font-semibold text-gray-900 mb-4'>
            Add New Goal
          </h3>
          <form onSubmit={onSubmit} className='space-y-4'>
            <FormField
              label='Goal Title'
              required
              value={newGoal.title}
              onChange={(value) => onChange({ ...newGoal, title: value })}
              placeholder='Enter goal title'
            />

            <FormField
              label='Description'
              as='textarea'
              value={newGoal.description}
              onChange={(value) => onChange({ ...newGoal, description: value })}
              placeholder='Describe your goal'
              rows={3}
            />

            <FormField
              label='Due Date (Optional)'
              type='date'
              value={newGoal.due_date}
              onChange={(value) => onChange({ ...newGoal, due_date: value })}
            />

            <div className='flex justify-end space-x-3 mt-6'>
              <button
                type='button'
                onClick={onClose}
                className='px-4 py-2 text-gray-700 hover:text-gray-900'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors'
              >
                Add Goal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const FormField = ({
  label,
  value,
  onChange,
  type = 'text',
  as = 'input',
  required = false,
  placeholder = '',
  rows = 1,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  as?: 'input' | 'textarea';
  required?: boolean;
  placeholder?: string;
  rows?: number;
}) => (
  <div>
    <label className='block text-sm font-medium text-gray-700 mb-1'>
      {label}
    </label>
    {as === 'input' ? (
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500'
        placeholder={placeholder}
      />
    ) : (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500'
        rows={rows}
        placeholder={placeholder}
      />
    )}
  </div>
);

export default RelationshipDetail;
