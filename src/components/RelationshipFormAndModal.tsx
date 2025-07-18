import React, { useState } from 'react';

import { RELATIONSHIP_TYPES } from '../constants/constants';
import {
  RelationshipFormData,
  RelationshipType,
} from '../interfaces/interfaces';

export const AddRelationshipModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RelationshipFormData) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<RelationshipFormData>({
    name: '',
    relationship_type: '',
    specific_role: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-xl shadow-lg max-w-md w-full'>
        <div className='p-6'>
          <h3 className='text-xl font-semibold text-gray-900 mb-4'>
            Add New Relationship
          </h3>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <FormInput
              label='Name'
              value={formData.name}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, name: value }))
              }
              placeholder='Enter their name'
              required
            />

            <FormSelect
              label='Relationship Type'
              value={formData.relationship_type}
              options={RELATIONSHIP_TYPES}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  relationship_type: value as RelationshipType,
                }))
              }
              required
            />

            <FormInput
              label='Specific Role'
              value={formData.specific_role}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, specific_role: value }))
              }
              placeholder='e.g., Mother, Boss, Best Friend'
              required
            />

            <FormTextarea
              label='Notes (Optional)'
              value={formData.notes}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, notes: value }))
              }
              placeholder='Add any additional notes'
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
                Add Relationship
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const FormInput: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}> = ({ label, value, onChange, placeholder, required = false }) => (
  <div>
    <label className='block text-sm font-medium text-gray-700 mb-1'>
      {label}
    </label>
    <input
      type='text'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500'
      placeholder={placeholder}
      required={required}
    />
  </div>
);

const FormSelect: React.FC<{
  label: string;
  value: string;
  options: typeof RELATIONSHIP_TYPES;
  onChange: (value: string) => void;
  required?: boolean;
}> = ({ label, value, options, onChange, required = false }) => (
  <div>
    <label className='block text-sm font-medium text-gray-700 mb-1'>
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500'
      required={required}
    >
      <option value=''>Select type</option>
      {options.map((type) => (
        <option key={type.value} value={type.value}>
          {type.label}
        </option>
      ))}
    </select>
  </div>
);

const FormTextarea: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className='block text-sm font-medium text-gray-700 mb-1'>
      {label}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500'
      rows={3}
      placeholder={placeholder}
    />
  </div>
);
