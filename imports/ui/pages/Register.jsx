import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';

export const Register = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = React.useRef({});
  password.current = watch("password", "");

  const onSubmit = (data) => {
    console.log(data);
    // TODO: Implement actual registration logic with Accounts.createUser
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="card">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold mb-2">Create Account</h2>
          <p className="text-muted">Join our community today</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-muted mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-muted" />
              </div>
              <input
                id="name"
                type="text"
                className="block w-full pl-10 pr-3 py-2 bg-dark border border-accent rounded-md focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="John Doe"
                {...register("name", { required: "Name is required" })}
              />
            </div>
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
          </div>
          
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
                {...register("password", { 
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters"
                  }
                })}
              />
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-muted mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-muted" />
              </div>
              <input
                id="confirmPassword"
                type="password"
                className="block w-full pl-10 pr-3 py-2 bg-dark border border-accent rounded-md focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="••••••••"
                {...register("confirmPassword", { 
                  required: "Please confirm your password",
                  validate: value => 
                    value === password.current || "Passwords do not match"
                })}
              />
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
          </div>
          
          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 bg-dark border-accent rounded focus:ring-primary"
              {...register("terms", { required: "You must agree to the terms and conditions" })}
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-muted">
              I agree to the{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>
              {" "}and{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.terms && <p className="mt-1 text-sm text-red-500">{errors.terms.message}</p>}
          
          <button
            type="submit"
            className="w-full btn btn-primary py-3 flex items-center justify-center"
          >
            <FiUserPlus className="mr-2" />
            Create Account
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-muted">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
