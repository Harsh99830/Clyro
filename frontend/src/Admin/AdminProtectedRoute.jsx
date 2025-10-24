import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';

const ALLOWED_EMAIL = 'harshagrawal7878@gmail.com';

const AdminProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  const userEmail = user?.primaryEmailAddress?.emailAddress;
  
  if (userEmail !== ALLOWED_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">Email not found. You are not authorized to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminProtectedRoute;
