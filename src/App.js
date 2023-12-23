// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignInUpPage from './SignInUpPage';
import AccountPage from './AccountPage';
import { UserProvider, useUser } from './UserContext';

const App = () => {
  const { user, authenticateWallet } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await authenticateWallet();
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication error:', error);
      }
    };

    checkAuthentication();
  }, [authenticateWallet]);

  return (
    <div className="App">
      <UserProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <React.Fragment>
                  {user && isAuthenticated ? (
                    <Navigate to="/account" replace />
                  ) : (
                    <Navigate to="/signin" replace />
                  )}
                </React.Fragment>
              }
            />
            <Route path="/signin" element={<SignInUpPage />} />
            <Route path="/account" element={<AccountPage />} />
          </Routes>
        </Router>
      </UserProvider>
    </div>
  );
};

export default App;
