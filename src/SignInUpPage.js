import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import { ethers } from 'ethers'; // Import ethers.js library
import ValidationContractArtifact from './ValidationContract.json';

const SignInUpPage = ({ onSignInAttempt }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const { signIn, signUp, user, authenticateWallet } = useUser();
  const [validationChecked, setValidationChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleValidation = async () => {
    const currentUser = user;

    if (currentUser) {
      setErrorMessage('');
    } else {
      try {
        await authenticateWallet();

        // Get the contract address and ABI from the JSON artifact
        const contractAddress = ValidationContractArtifact.networks['*'].address;
        const contractABI = ValidationContractArtifact.abi;

        // Connect to the Ethereum provider
        const ethers = require("ethers")
        const provider = new ethers.providers.JsonRpcProvider('http://localhost:3000');

        // Connect to the contract using the provider and signer
        const contract = new ethers.Contract(contractAddress, contractABI, provider.getSigner());

        // Call the contract method for validation
        const isUserValidated = await contract.validateUser();

        if (isUserValidated) {
          setErrorMessage('');
        } else {
          setErrorMessage('Validation failed. Please try again.');
        }
      } catch (error) {
        console.error('Error validating user:', error);
        setErrorMessage('Validation failed. Please try again.');
      }
    }
  };

  const handleSubmit = async () => {
    if (isSignUp) {
      // Check if the user already exists before signing up
      const existingUser = localStorage.getItem(formData.username);

      if (existingUser) {
        setErrorMessage(
          'An account with this username already exists. Please choose a different username.'
        );
      } else {
        // No existing user, proceed with sign-up
        await handleValidation();
        if (!errorMessage) {
          signUp(formData.name, formData.username, formData.email, formData.password);
          onSignInAttempt();
        }
      }
    } else {
      try {
        const isSignedIn = signIn(formData.username, formData.password);
        if (isSignedIn) {
          navigate('/account');  // Redirect to /account after successful sign-in
        } else {
          setErrorMessage('Invalid username or password. Please create an account if you do not have one.');
        }
      } catch (error) {
        setErrorMessage(`Error: ${error.message}`);
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
        {isSignUp && (
          <div>
            <label>
              Validate yourself:
              <input type="checkbox" onChange={() => setValidationChecked(!validationChecked)} />
            </label>
          </div>
        )}
        <button type="button" onClick={handleSubmit}>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      <p>
        {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
        <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
};

export default SignInUpPage;