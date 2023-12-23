import { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';

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

  useEffect(() => {
    // Load user from localStorage on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []); // Empty dependency array ensures it runs only once on mount

  const signIn = (username, password) => {
    const userData = localStorage.getItem(username);

    if ((username === 'username' && password === 'password') || (userData && JSON.parse(userData).password === password)) {
      console.log('Authentication successful');
      const user = JSON.parse(userData);
      localStorage.setItem('user', JSON.stringify(user)); // Save user to localStorage
      setUser(user);
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
    localStorage.setItem('user', JSON.stringify(userData)); // Save user to localStorage
    setUser(userData);
  };

  const signOut = () => {
    localStorage.removeItem('user'); // Remove user from localStorage on sign out
    setUser(null);
  };

  const authenticateWallet = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);

      try {
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];
        const userData = { address, web3 };
        localStorage.setItem('user', JSON.stringify(userData)); // Save user to localStorage
        setUser(userData);
        return true;
      } catch (error) {
        console.error('Error authenticating wallet:', error);
        throw new Error('Failed to authenticate wallet');
      }
    } else {
      throw new Error('No Ethereum wallet detected');
    }
  };

  return (
    <UserContext.Provider value={{ user, signIn, signUp, signOut, authenticateWallet }}>
      {children}
    </UserContext.Provider>
  );
};