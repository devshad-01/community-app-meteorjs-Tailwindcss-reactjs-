import React from 'react';
import { FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';

// TextInput component with icon support
export const TextInput = ({
  id,
  label,
  type = 'text',
  placeholder,
  error,
  icon: Icon,
  register,
  disabled = false,
  ...rest
}) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-muted mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`${error ? 'text-red-400' : 'text-muted'}`} />
          </div>
        )}
        <input
          id={id}
          type={type}
          className={`block w-full ${Icon ? 'pl-10' : 'px-3'} py-2 bg-dark border 
            ${error ? 'border-red-500' : 'border-accent'} 
            rounded-md focus:ring-1 
            ${error ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-primary focus:border-primary'} 
            ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
          placeholder={placeholder}
          disabled={disabled}
          {...register}
          {...rest}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center">
          <FiAlertCircle className="mr-1" /> {error}
        </p>
      )}
    </div>
  );
};

// Password input with toggle visibility
export const PasswordInput = ({
  id,
  label,
  placeholder,
  error,
  icon: Icon,
  register,
  disabled = false,
  ...rest
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-muted mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`${error ? 'text-red-400' : 'text-muted'}`} />
          </div>
        )}
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          className={`block w-full ${Icon ? 'pl-10' : 'px-3'} pr-10 py-2 bg-dark border 
            ${error ? 'border-red-500' : 'border-accent'} 
            rounded-md focus:ring-1 
            ${error ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-primary focus:border-primary'} 
            ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
          placeholder={placeholder}
          disabled={disabled}
          {...register}
          {...rest}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            type="button"
            className="text-muted hover:text-white focus:outline-none"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center">
          <FiAlertCircle className="mr-1" /> {error}
        </p>
      )}
    </div>
  );
};

// TextArea component
export const TextArea = ({
  id,
  label,
  placeholder,
  error,
  register,
  rows = 4,
  disabled = false,
  ...rest
}) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-muted mb-1">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`block w-full px-3 py-2 bg-dark border 
          ${error ? 'border-red-500' : 'border-accent'} 
          rounded-md focus:ring-1 
          ${error ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-primary focus:border-primary'} 
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        placeholder={placeholder}
        disabled={disabled}
        {...register}
        {...rest}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center">
          <FiAlertCircle className="mr-1" /> {error}
        </p>
      )}
    </div>
  );
};

// Checkbox component
export const Checkbox = ({
  id,
  label,
  error,
  register,
  disabled = false,
  ...rest
}) => {
  return (
    <div>
      <div className="flex items-center">
        <input
          id={id}
          type="checkbox"
          className={`h-4 w-4 bg-dark border-accent rounded focus:ring-primary
            ${error ? 'border-red-500' : 'border-accent'} 
            ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
          disabled={disabled}
          {...register}
          {...rest}
        />
        {label && (
          <label htmlFor={id} className="ml-2 block text-sm text-muted">
            {label}
          </label>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center">
          <FiAlertCircle className="mr-1" /> {error}
        </p>
      )}
    </div>
  );
};

// Select component
export const Select = ({
  id,
  label,
  options,
  error,
  register,
  disabled = false,
  ...rest
}) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-muted mb-1">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`block w-full px-3 py-2 bg-dark border 
          ${error ? 'border-red-500' : 'border-accent'} 
          rounded-md focus:ring-1 
          ${error ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-primary focus:border-primary'} 
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        disabled={disabled}
        {...register}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center">
          <FiAlertCircle className="mr-1" /> {error}
        </p>
      )}
    </div>
  );
};

// Radio group component
export const RadioGroup = ({
  id,
  label,
  options,
  error,
  register,
  disabled = false,
  ...rest
}) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-muted mb-2">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              id={`${id}-${option.value}`}
              type="radio"
              value={option.value}
              className={`h-4 w-4 bg-dark border-accent focus:ring-primary
                ${error ? 'border-red-500' : 'border-accent'} 
                ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={disabled}
              {...register}
              {...rest}
            />
            <label htmlFor={`${id}-${option.value}`} className="ml-2 block text-sm text-muted">
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center">
          <FiAlertCircle className="mr-1" /> {error}
        </p>
      )}
    </div>
  );
};
