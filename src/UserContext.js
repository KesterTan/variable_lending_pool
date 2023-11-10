// UserContext.js
import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signIn = (username, password) => {
    const userData = localStorage.getItem(username);

    if (userData && JSON.parse(userData).password === password) {
      setUser(JSON.parse(userData));
      return true;
    }

    throw new Error('Invalid username or password');
  };

  const signUp = (name, username, email, password) => {
    const existingUser = localStorage.getItem(username);

    if (existingUser) {
      throw new Error('An account with this username already exists. Please choose a different username.');
    }

    const userData = { name, username, email, password };
    localStorage.setItem(username, JSON.stringify(userData));
    setUser(userData);
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </UserContext.Provider>
  );
};
