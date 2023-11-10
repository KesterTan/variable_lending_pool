// AccountPage.js
import React from 'react';
import { useUser } from './UserContext';

const AccountPage = () => {
  const { user, signOut } = useUser();

  // Check if there is no user data
  return (
    <div>
      <h2>Welcome, {user.name}!</h2>
      <p>Social Credit Score: {user.socialCreditScore}</p>
      <button type="button" onClick={signOut}>
        Sign Out
      </button>
    </div>
  );
};

export default AccountPage;
