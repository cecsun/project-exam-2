import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      const enhancedUser = {
        ...parsedUser,
        userType: parsedUser.venueManager ? 'venueManager' : 'customer',
      };
      setIsAuthenticated(true);
      setUser(enhancedUser);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = (token, user) => {
    const enhancedUser = {
      ...user,
      userType: user.venueManager ? 'venueManager' : 'customer',
    };

    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(enhancedUser));
    setIsAuthenticated(true);
    setUser(enhancedUser);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
