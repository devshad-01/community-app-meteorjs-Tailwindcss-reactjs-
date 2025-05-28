import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = e => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Login
      Meteor.loginWithPassword(
        email.includes('@') ? email : username, 
        password, 
        err => {
          if (err) {
            setError(err.reason || 'Login failed');
          }
        }
      );
    } else {
      // Register
      Meteor.call('users.create', { username, email, password }, (err) => {
        if (err) {
          setError(err.reason || 'Registration failed');
        } else {
          // Auto login after registration
          Meteor.loginWithPassword(email, password);
        }
      });
    }
  };

  return (
    <div className="login-form">
      <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required={!isLogin}
            />
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="btn-primary">
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      
      <div className="form-footer">
        <button 
          className="btn-link" 
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};
