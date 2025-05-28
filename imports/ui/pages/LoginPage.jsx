import React from 'react';
import { LoginForm } from '../components/auth/LoginForm';

export const LoginPage = () => {
  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <LoginForm />
      </div>
    </div>
  );
};
