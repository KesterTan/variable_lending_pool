import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

const AccountPage = () => {
  const { user, signOut } = useUser();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/signin');  // Redirect to /signin after signing out
  };

  return (
    <div>
      <h2>Welcome, {user.name}!</h2>
      <p>Social Credit Score: {user.socialCreditScore}</p>
      <button type="button" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
};

export default AccountPage;
