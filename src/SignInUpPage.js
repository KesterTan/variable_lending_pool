// SignInUpPage.js
import React, { useState } from 'react';
import { useUser } from './UserContext';

const SignInUpPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const { signIn, signUp } = useUser();
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    if (isSignUp) {
      // Check if the user already exists before signing up
      const existingUser = localStorage.getItem(formData.username);

      if (existingUser) {
        setErrorMessage('An account with this username already exists. Please choose a different username.');
      } else {
        // No existing user, proceed with sign-up
        signUp(formData.name, formData.username, formData.email, formData.password);
        setErrorMessage('');
      }
    } else {
      try {
        const isSignedIn = signIn(formData.username, formData.password);
        if (!isSignedIn) {
          setErrorMessage('Invalid username or password. Please create an account if you do not have one.');
        } else {
          setErrorMessage('');
        }
      } catch (error) {
        setErrorMessage('Invalid username or password. Please create an account if you do not have one.');
      }
    }
  };

  return (
    <div>
      <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form>
        {isSignUp && (
          <div>
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
          </div>
        )}
        <div>
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleInputChange} />
        </div>
        {isSignUp && (
          <div>
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
          </div>
        )}
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleInputChange} />
        </div>
        <button type="button" onClick={handleSubmit}>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      <p>
        {isSignUp ? 'Already have an account? ' : 'Don\'t have an account? '}
        <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
};

export default SignInUpPage;
