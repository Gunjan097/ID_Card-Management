// Import necessary React hooks and context API
import { createContext, useContext, useState } from "react";

// Create a new context for authentication
const AuthContext = createContext();

// This component provides the AuthContext to its children
export const AuthProvider = ({ children }) => {
  // Initialize authData from localStorage (if available)
  const [authData, setAuthData] = useState(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    // If both token and user exist, parse and return as initial state
    return token && user ? { token, user: JSON.parse(user) } : null;
  });

  // Function to log in the user
  const login = ({ token, user }) => {
    // Save token and user info to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // Update the authData state with token and user
    setAuthData({ token, user });
  };

  // Function to log out the user
  const logout = () => {
    // Remove token and user from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear the authData state
    setAuthData(null);
  };

  // Provide the context value to all children components
  // - `authData`: current authentication state (token + user)
  // - `setAuthData`: alias for login function
  // - `logout`: function to clear authentication
  return (
    <AuthContext.Provider value={{ authData, setAuthData: login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily access AuthContext in components
export const useAuth = () => useContext(AuthContext);
