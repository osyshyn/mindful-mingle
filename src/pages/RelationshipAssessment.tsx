// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ClipboardList, ArrowLeft, Loader } from 'lucide-react';
// import { supabase } from '../lib/supabase';
// import toast from 'react-hot-toast';

// interface Relationship {
//   id: string;
//   name: string;
//   relationship_type: string;
//   specific_role: string;
// }

// interface Question {
//   id: number;
//   text: string;
//   category: string;
// }

// // Assessment questions covering different aspects of relationships
// const questions: Question[] = [
//   {
//     id: 1,
//     text: "How often do you communicate with this person?",
//     category: "communication"
//   },
//   {
//     id: 2,
//     text: "How comfortable are you sharing your feelings with them?",
//     category: "trust"
//   },
//   {
//     id: 3,
//     text: "How well do they understand your perspective?",
//     category: "empathy"
//   },
//   {
//     id: 4,
//     text: "How supported do you feel in this relationship?",
//     category: "support"
//   },
//   {
//     id: 5,
//     text: "How effectively do you resolve conflicts together?",
//     category: "conflict"
//   },
//   {
//     id: 6,
//     text: "How much do you trust this person?",
//     category: "trust"
//   },
//   {
//     id: 7,
//     text: "How well do you handle disagreements?",
//     category: "conflict"
//   },
//   {
//     id: 8,
//     text: "How satisfied are you with the quality of time spent together?",
//     category: "quality"
//   },
//   {
//     id: 9,
//     text: "How well do you respect each other's boundaries?",
//     category: "boundaries"
//   },
//   {
//     id: 10,
//     text: "How much mutual growth do you experience in this relationship?",
//     category: "growth"
//   }
// ];

// const RelationshipAssessment = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const [relationship, setRelationship] = useState<Relationship | null>(null);
//   const [answers, setAnswers] = useState<Record<number, number>>({});
//   const [currentQuestion, setCurrentQuestion] = useState(0);

//   useEffect(() => {
//     loadRelationship();
//   }, [id]);

//   const loadRelationship = async () => {
//     try {
//       if (!id) return;

//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) {
//         navigate('/login');
//         return;
//       }

//       const { data, error } = await supabase
//         .from('relationships')
//         .select('*')
//         .eq('id', id)
//         .eq('user_id', user.id)
//         .single();

//       if (error) throw error;
//       if (!data) {
//         toast.error('Relationship not found');
//         navigate('/relationships');
//         return;
//       }

//       setRelationship(data);
//     } catch (error) {
//       toast.error('Error loading relationship');
//       navigate('/relationships');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAnswer = (score: number) => {
//     setAnswers(prev => ({
//       ...prev,
//       [questions[currentQuestion].id]: score
//     }));

//     if (currentQuestion < questions.length - 1) {
//       setCurrentQuestion(prev => prev + 1);
//     }
//   };

//   const calculateScore = () => {
//     const totalPossible = Object.keys(answers).length * 5;
//     const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
//     return Math.round((totalScore / totalPossible) * 100);
//   };

//   const handleSubmit = async () => {
//     if (!relationship) return;

//     setIsSaving(true);
//     try {
//       const score = calculateScore();

//       const { error } = await supabase
//         .from('relationship_assessments')
//         .insert({
//           relationship_id: relationship.id,
//           score,
//           answers
//         });

//       if (error) throw error;

//       toast.success(`Assessment completed! ${relationship.name}'s relationship score: ${score}%`);
//       navigate('/relationships');
//     } catch (error) {
//       toast.error('Error saving assessment');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <Loader className="h-8 w-8 animate-spin text-rose-500" />
//       </div>
//     );
//   }

//   if (!relationship) {
//     return null;
//   }

//   const currentQuestionData = questions[currentQuestion];
//   const progress = (currentQuestion / questions.length) * 100;
//   const isLastQuestion = currentQuestion === questions.length - 1;

//   return (
//     <div className="max-w-2xl mx-auto">
//       <div className="mb-8">
//         <button
//           onClick={() => navigate('/relationships')}
//           className="flex items-center text-gray-600 hover:text-gray-900"
//         >
//           <ArrowLeft className="h-5 w-5 mr-2" />
//           Back to Relationships
//         </button>
//       </div>

//       <div className="bg-white rounded-xl shadow-md overflow-hidden">
//         <div className="p-6 bg-rose-50 border-b border-rose-100">
//           <div className="flex items-center space-x-3">
//             <ClipboardList className="h-6 w-6 text-rose-500" />
//             <h1 className="text-2xl font-bold text-gray-900">
//               Relationship Assessment
//             </h1>
//           </div>
//           <p className="text-gray-600 mt-2">
//             Assess your relationship with {relationship.name}
//           </p>
//         </div>

//         <div className="p-6">
//           {/* Progress bar */}
//           <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
//             <div
//               className="h-full bg-rose-500 rounded-full transition-all duration-300"
//               style={{ width: `${progress}%` }}
//             />
//           </div>

//           <div className="mb-8">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">
//               {currentQuestionData.text}
//             </h3>

//             <div className="grid grid-cols-5 gap-4">
//               {[1, 2, 3, 4, 5].map((score) => (
//                 <button
//                   key={score}
//                   onClick={() => handleAnswer(score)}
//                   className={`p-4 rounded-lg border-2 transition-colors
//                     ${answers[currentQuestionData.id] === score
//                       ? 'border-rose-500 bg-rose-50'
//                       : 'border-gray-200 hover:border-rose-200'
//                     }`}
//                 >
//                   <div className="text-2xl font-bold text-center mb-2">
//                     {score}
//                   </div>
//                   <div className="text-sm text-center text-gray-600">
//                     {score === 1 ? 'Poor' : score === 5 ? 'Excellent' : ''}
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="flex justify-between items-center">
//             <button
//               onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
//               disabled={currentQuestion === 0}
//               className="text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Previous
//             </button>

//             {isLastQuestion && Object.keys(answers).length === questions.length ? (
//               <button
//                 onClick={handleSubmit}
//                 disabled={isSaving}
//                 className="bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSaving ? (
//                   <Loader className="h-5 w-5 animate-spin" />
//                 ) : (
//                   'Complete Assessment'
//                 )}
//               </button>
//             ) : (
//               <button
//                 onClick={() => setCurrentQuestion(prev => prev + 1)}
//                 disabled={!answers[currentQuestionData.id] || isLastQuestion}
//                 className="text-rose-500 hover:text-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Next
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RelationshipAssessment;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClipboardList, ArrowLeft, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { QUESTIONS, SCORE_LABELS } from '../constants/constants';
import { RelationshipAssessmentInterface, AssessmentAnswers } from '../interfaces/interfaces';
import toast from 'react-hot-toast';

const RelationshipAssessment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [relationship, setRelationship] = useState<RelationshipAssessmentInterface | null>(null);
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progressPercentage = (currentQuestionIndex / QUESTIONS.length) * 100;
  const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1;
  const isAssessmentComplete = Object.keys(answers).length === QUESTIONS.length;

  useEffect(() => {
    const loadRelationship = async () => {
      if (!id) return;

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return navigate('/login');

        const { data, error } = await supabase
          .from('relationships')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        if (!data) {
          toast.error('Relationship not found');
          return navigate('/relationships');
        }

        setRelationship(data);
      } catch {
        toast.error('Error loading relationship');
        navigate('/relationships');
      } finally {
        setIsLoading(false);
      }
    };

    loadRelationship();
  }, [id, navigate]);

  const handleAnswer = (score: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: score,
    }));

    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const calculateScore = (): number => {
    const totalPossible = Object.keys(answers).length * 5;
    const totalScore = Object.values(answers).reduce(
      (sum, score) => sum + score,
      0
    );
    return Math.round((totalScore / totalPossible) * 100);
  };

  const handleSubmit = async () => {
    if (!relationship) return;

    setIsSaving(true);
    try {
      const score = calculateScore();

      const { error } = await supabase.from('relationship_assessments').insert({
        relationship_id: relationship.id,
        score,
        answers,
      });

      if (error) throw error;

      toast.success(
        `Assessment completed! ${relationship.name}'s relationship score: ${score}%`
      );
      navigate('/relationships');
    } catch {
      toast.error('Error saving assessment');
    } finally {
      setIsSaving(false);
    }
  };

  const navigateToPreviousQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
  };

  const navigateToNextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const renderScoreButton = (score: number) => (
    <button
      key={score}
      onClick={() => handleAnswer(score)}
      className={`p-4 rounded-lg border-2 transition-colors
        ${
          answers[currentQuestion.id] === score
            ? 'border-rose-500 bg-rose-50'
            : 'border-gray-200 hover:border-rose-200'
        }`}
    >
      <div className='text-2xl font-bold text-center mb-2'>{score}</div>
      <div className='text-sm text-center text-gray-600'>
        {SCORE_LABELS[score] || ''}
      </div>
    </button>
  );

  const renderNavigationButtons = () => (
    <div className='flex justify-between items-center'>
      <button
        onClick={navigateToPreviousQuestion}
        disabled={currentQuestionIndex === 0}
        className='text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        Previous
      </button>

      {isLastQuestion && isAssessmentComplete ? (
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className='bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isSaving ? (
            <Loader className='h-5 w-5 animate-spin' />
          ) : (
            'Complete Assessment'
          )}
        </button>
      ) : (
        <button
          onClick={navigateToNextQuestion}
          disabled={!answers[currentQuestion.id] || isLastQuestion}
          className='text-rose-500 hover:text-rose-600 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Next
        </button>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader className='h-8 w-8 animate-spin text-rose-500' />
      </div>
    );
  }

  if (!relationship) return null;

  return (
    <div className='max-w-2xl mx-auto'>
      <div className='mb-8'>
        <button
          onClick={() => navigate('/relationships')}
          className='flex items-center text-gray-600 hover:text-gray-900'
        >
          <ArrowLeft className='h-5 w-5 mr-2' />
          Back to Relationships
        </button>
      </div>

      <div className='bg-white rounded-xl shadow-md overflow-hidden'>
        <div className='p-6 bg-rose-50 border-b border-rose-100'>
          <div className='flex items-center space-x-3'>
            <ClipboardList className='h-6 w-6 text-rose-500' />
            <h1 className='text-2xl font-bold text-gray-900'>
              Relationship Assessment
            </h1>
          </div>
          <p className='text-gray-600 mt-2'>
            Assess your relationship with {relationship.name}
          </p>
        </div>

        <div className='p-6'>
          <div className='w-full h-2 bg-gray-200 rounded-full mb-8'>
            <div
              className='h-full bg-rose-500 rounded-full transition-all duration-300'
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className='mb-8'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>
              {currentQuestion.text}
            </h3>

            <div className='grid grid-cols-5 gap-4'>
              {[1, 2, 3, 4, 5].map(renderScoreButton)}
            </div>
          </div>

          {renderNavigationButtons()}
        </div>
      </div>
    </div>
  );
};

export default RelationshipAssessment;
