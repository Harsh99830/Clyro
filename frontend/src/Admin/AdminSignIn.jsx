import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useUser, SignIn } from '@clerk/clerk-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ALLOWED_EMAIL = 'harshagrawal7878@gmail.com';

const AdminSignIn = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only check email when on admin login page
    if (isLoaded && isSignedIn && user && location.pathname === '/admin/login') {
      const userEmail = user.primaryEmailAddress?.emailAddress;
      
      if (userEmail === ALLOWED_EMAIL) {
        toast.success('Welcome Admin!');
        navigate('/admin/home');
      } else {
        toast.error('Email not found. Access denied for this email.');
        // Sign out unauthorized user
        setTimeout(() => {
          window.Clerk?.signOut();
        }, 2000);
      }
    }
  }, [isSignedIn, isLoaded, user, navigate, location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-white text-center text-3xl font-extrabold mb-2">
          Admin Login
        </h2>
        <p className="text-center text-gray-300 text-sm mb-8">
          Sign in with Google using authorized email only
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10">
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary:
                  'bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-all',
                formFieldInput:
                  'border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500',
                card: 'shadow-none',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton:
                  'border-2 border-gray-300 hover:border-indigo-500 transition-all',
                dividerLine: 'bg-gray-300',
                dividerText: 'text-gray-500',
                formFieldLabel: 'text-gray-700 font-medium',
                footer: 'hidden'
              },
            }}
            routing="path"
            path="/admin/login"
            signUpUrl={null}
            afterSignInUrl="/admin/home"
          />
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              ⚠️ Only authorized admin email can access this panel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;
