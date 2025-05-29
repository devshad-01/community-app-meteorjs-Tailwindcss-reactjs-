import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/auth/RegisterForm';

export const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegistrationSuccess = () => {
    // Redirect to home page after successful registration
    navigate('/');
  };

  return <RegisterForm onSuccess={handleRegistrationSuccess} />;
};
