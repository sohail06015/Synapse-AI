// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Correct named import

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (token, userData) => {
    try {
      const decoded = jwtDecode(token); // Using the named import
      const completeUser = {
        ...userData,
        _id: decoded.userId || decoded._id // Handle both cases
      };

      setToken(token);
      setUser(completeUser);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(completeUser));
    } catch (error) {
      console.error("Token decoding failed:", error);
      logout();
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Verify token validity on app load
  useEffect(() => {
    const verifyToken = () => {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded.exp * 1000 < Date.now()) {
            logout();
          }
        } catch (error) {
          logout();
        }
      }
    };
    verifyToken();
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};