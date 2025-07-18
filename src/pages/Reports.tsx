import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Loader, BarChart2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { RelationshipReports } from '../interfaces/interfaces';
import toast from 'react-hot-toast';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const Reports = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [relationships, setRelationships] = useState<RelationshipReports[]>([]);

  useEffect(() => {
    loadRelationships();
  }, []);

  const loadRelationships = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Fetch relationships with latest assessment scores and biometric data
      const { data, error } = await supabase
        .from('relationships')
        .select(
          `
          id,
          name,
          relationship_type,
          relationship_assessments (
            score,
            taken_at
          ),
          biometric_data (
            stress_level
          )
        `
        )
        .eq('user_id', user.id);

      if (error) throw error;

      // Process the data to get the latest scores and average stress levels
      const processedData = data.map((relationship) => ({
        id: relationship.id,
        name: relationship.name,
        relationship_type: relationship.relationship_type,
        latest_score: relationship.relationship_assessments?.[0]?.score || 0,
        stress_level: relationship.biometric_data?.length
          ? relationship.biometric_data.reduce(
              (acc, curr) => acc + (curr.stress_level || 0),
              0
            ) / relationship.biometric_data.length
          : undefined,
      }));

      setRelationships(processedData);
    } catch (error) {
      toast.error('Error loading relationship data');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getChartData = () => {
    return {
      labels: relationships.map((r) => r.name),
      datasets: [
        {
          label: 'Relationship Score',
          data: relationships.map((r) => r.latest_score),
          backgroundColor: 'rgba(244, 63, 94, 0.2)',
          borderColor: 'rgb(244, 63, 94)',
          borderWidth: 2,
          pointBackgroundColor: 'rgb(244, 63, 94)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(244, 63, 94)',
        },
        {
          label: 'Stress Level',
          data: relationships.map((r) => r.stress_level || 0),
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2,
          pointBackgroundColor: 'rgb(59, 130, 246)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(59, 130, 246)',
        },
      ],
    };
  };

  const chartOptions = {
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader className='h-8 w-8 animate-spin text-rose-500' />
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>
          Relationship Reports
        </h1>
        <p className='text-gray-600 mt-2'>
          Visualize your relationships and their dynamics
        </p>
      </div>

      <div className='bg-white rounded-xl shadow-md overflow-hidden mb-8'>
        <div className='p-6 bg-rose-50 border-b border-rose-100'>
          <div className='flex items-center space-x-3'>
            <BarChart2 className='h-6 w-6 text-rose-500' />
            <h2 className='text-xl font-semibold text-gray-900'>
              Relationship Web
            </h2>
          </div>
          <p className='text-gray-600 mt-2'>
            Interactive visualization of your relationships and their health
            metrics
          </p>
        </div>

        <div className='p-6'>
          {relationships.length === 0 ? (
            <div className='text-center py-12'>
              <PieChart className='h-16 w-16 text-gray-400 mx-auto mb-4' />
              <h3 className='text-xl font-medium text-gray-900 mb-2'>
                No relationship data available
              </h3>
              <p className='text-gray-600 mb-6'>
                Add relationships and complete assessments to see your
                relationship web
              </p>
            </div>
          ) : (
            <div className='aspect-square max-w-2xl mx-auto'>
              <Radar data={getChartData()} options={chartOptions} />
            </div>
          )}
        </div>
      </div>

      <div className='grid md:grid-cols-2 gap-6'>
        {relationships.map((relationship) => (
          <div
            key={relationship.id}
            className='bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer'
            onClick={() => navigate(`/relationships/${relationship.id}`)}
          >
            <h3 className='font-semibold text-gray-900'>{relationship.name}</h3>
            <div className='mt-2 space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>
                  Relationship Score:
                </span>
                <span className='font-medium'>
                  {relationship.latest_score}%
                </span>
              </div>
              {relationship.stress_level !== undefined && (
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>
                    Average Stress Level:
                  </span>
                  <span className='font-medium'>
                    {Math.round(relationship.stress_level)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
