import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  error?: string | null;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  error 
}) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900"></div>
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-[url('/images/download.jpg')] opacity-10 bg-repeat"></div>
      
      {/* Animated particles/elements */}
      <div className="absolute top-20 left-[10%] w-32 h-32 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse" 
           style={{animationDuration: '7s'}}></div>
      <div className="absolute top-40 left-[80%] w-24 h-24 bg-indigo-500 rounded-full filter blur-3xl opacity-15 animate-pulse"
           style={{animationDuration: '5s'}}></div>
      <div className="absolute bottom-40 right-[20%] w-40 h-40 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse"
           style={{animationDuration: '9s'}}></div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white">{title}</h1>
            {subtitle && <p className="mt-2 text-gray-300">{subtitle}</p>}
          </div>
          
          {error && (
            <div className="mb-6 p-3 bg-red-500/20 backdrop-blur-sm border border-red-400 text-red-100 rounded-lg text-center">
              {error}
            </div>
          )}
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;