import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Plus, ChevronRight, Star, Target, Loader, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface Relationship {
  id: string;
  name: string;
  relationship_type: string;
  specific_role: string;
  notes: string;
  latest_score?: number;
  latest_assessment_date?: string;
  goals_count?: number;
  completed_goals_count?: number;
}

const relationshipTypes = [
  { value: 'family', label: 'Family' },
  { value: 'friend', label: 'Friend' },
  { value: 'work', label: 'Work' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'other', label: 'Other' }
];

const Relationships = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRelationship, setNewRelationship] = useState({
    name: '',
    relationship_type: '',
    specific_role: '',
    notes: ''
  });

  useEffect(() => {
    loadRelationships();
  }, []);

  const loadRelationships = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Fetch relationships with latest assessment scores and goal counts
      const { data, error } = await supabase
        .from('relationships')
        .select(`
          *,
          relationship_assessments (
            score,
            taken_at
          ),
          relationship_goals (
            status
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process the data to get the latest scores and goal counts
      const processedData = data.map(relationship => ({
        ...relationship,
        latest_score: relationship.relationship_assessments?.[0]?.score,
        latest_assessment_date: relationship.relationship_assessments?.[0]?.taken_at,
        goals_count: relationship.relationship_goals?.length || 0,
        completed_goals_count: relationship.relationship_goals?.filter(g => g.status === 'completed').length || 0
      }));

      setRelationships(processedData);
    } catch (error) {
      toast.error('Error loading relationships');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRelationship = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('relationships')
        .insert({
          ...newRelationship,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setRelationships(prev => [data, ...prev]);
      setShowAddModal(false);
      setNewRelationship({
        name: '',
        relationship_type: '',
        specific_role: '',
        notes: ''
      });
      toast.success('Relationship added successfully');
    } catch (error) {
      toast.error('Error adding relationship');
      console.error('Error:', error);
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-600';
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Relationships</h1>
          <p className="text-gray-600 mt-2">
            Track and improve your important relationships
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Relationship</span>
        </button>
      </div>

      {relationships.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No relationships added yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start by adding your important relationships to track and improve them
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-2 bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Your First Relationship</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {relationships.map(relationship => (
            <div
              key={relationship.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {relationship.name}
                    </h3>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {relationshipTypes.find(t => t.value === relationship.relationship_type)?.label}
                      </span>
                      <span className="text-gray-500">{relationship.specific_role}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/relationships/${relationship.id}`)}
                    className="flex items-center space-x-1 text-rose-500 hover:text-rose-600"
                  >
                    <span>View Details</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getScoreColor(relationship.latest_score)}`}>
                      <Star className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Relationship Score</div>
                      <div className="font-semibold">
                        {relationship.latest_score ? `${relationship.latest_score}%` : 'Not assessed'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                      <Target className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Goals Progress</div>
                      <div className="font-semibold">
                        {relationship.completed_goals_count} of {relationship.goals_count} completed
                      </div>
                    </div>
                  </div>

                  {!relationship.latest_score && (
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-yellow-100 text-yellow-700">
                        <AlertTriangle className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Action Needed</div>
                        <button
                          onClick={() => navigate(`/relationships/${relationship.id}/assess`)}
                          className="text-rose-500 hover:text-rose-600 font-medium"
                        >
                          Take First Assessment
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Relationship Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Add New Relationship
              </h3>
              <form onSubmit={handleAddRelationship} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newRelationship.name}
                    onChange={(e) => setNewRelationship(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="Enter their name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship Type
                  </label>
                  <select
                    required
                    value={newRelationship.relationship_type}
                    onChange={(e) => setNewRelationship(prev => ({
                      ...prev,
                      relationship_type: e.target.value
                    }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="">Select type</option>
                    {relationshipTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specific Role
                  </label>
                  <input
                    type="text"
                    required
                    value={newRelationship.specific_role}
                    onChange={(e) => setNewRelationship(prev => ({
                      ...prev,
                      specific_role: e.target.value
                    }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="e.g., Mother, Boss, Best Friend"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={newRelationship.notes}
                    onChange={(e) => setNewRelationship(prev => ({
                      ...prev,
                      notes: e.target.value
                    }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    rows={3}
                    placeholder="Add any additional notes"
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors"
                  >
                    Add Relationship
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Relationships;