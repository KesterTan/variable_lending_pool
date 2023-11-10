// App.js
import React, { useEffect, useState } from 'react';
import SignInUpPage from './SignInUpPage';
import AccountPage from './AccountPage';
import { UserProvider, useUser } from './UserContext';

function App() {
  const { user } = useUser();
  const [attemptedSignIn, setAttemptedSignIn] = useState(false);

  // Redirect the user after signing in
  useEffect(() => {
    if (user && attemptedSignIn) {
      // Assume a function for redirecting, replace with your actual navigation logic
      redirectToAccountPage();
    }
  }, [user, attemptedSignIn]);

  const redirectToAccountPage = () => {
    // Assume a function for redirecting, replace with your actual navigation logic
    console.log('Redirecting to Account Page');
  };

  return (
    <div className="App">
      <UserProvider>
        {user ? (
          <AccountPage />
        ) : (
          <SignInUpPage onSignInAttempt={() => setAttemptedSignIn(true)} />
        )}
      </UserProvider>
    </div>
  );
}

export default App;
