import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PasswordResetConfirmation = () => {
  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Password Reset Successful
        </h2>
        
        <p className="text-gray-600 mb-8">
          Your password has been successfully updated. You can now sign in with your new password.
        </p>

        <Link
          to="/login"
          className="inline-block w-full bg-rose-500 text-white py-2 px-4 rounded-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default PasswordResetConfirmation;