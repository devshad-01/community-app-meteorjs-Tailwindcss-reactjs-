import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

export const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // TODO: Implement actual login logic with Meteor.loginWithPassword
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="card">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold mb-2">Welcome Back</h2>
          <p className="text-muted">Log into your account</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-muted mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-muted" />
              </div>
              <input
                id="email"
                type="email"
                className="block w-full pl-10 pr-3 py-2 bg-dark border border-accent rounded-md focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="you@example.com"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-muted mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-muted" />
              </div>
              <input
                id="password"
                type="password"
                className="block w-full pl-10 pr-3 py-2 bg-dark border border-accent rounded-md focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
              />
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                type="checkbox"
                className="h-4 w-4 bg-dark border-accent rounded focus:ring-primary"
                {...register("rememberMe")}
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-muted">
                Remember me
              </label>
            </div>
            <div>
              <Link to="/forgot-password" className="text-primary text-sm hover:underline">
                Forgot your password?
              </Link>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full btn btn-primary py-3 flex items-center justify-center"
          >
            <FiLogIn className="mr-2" />
            Sign In
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-muted">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
