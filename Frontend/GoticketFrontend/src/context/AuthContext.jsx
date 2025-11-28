import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api"; // Ensure this has baseURL = config.BACKEND_URL (no /api suffix)

// Create context
export const AuthContext = createContext(null);

// Hook
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user from localStorage:", error);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  // LOGIN (fixed endpoint to include /api)
  const login = async (credentials) => {
    try {
      // IMPORTANT: corrected path
      const response = await api.post("/api/auth/login", credentials);

      // Expected response shape: { message, role, email, id, token? }
      const userData = response.data;

      // If backend returns a token, store it (optional)
      if (userData.token) {
        localStorage.setItem("token", userData.token);
      }

      const userObj = {
        email: userData.email,
        role: userData.role,
        id: userData.id,
      };

      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj);
      return userObj;
    } catch (error) {
      console.error("Login failed:", error);
      // Bubble up a readable error
      throw new Error(
        error.response?.data?.message ||
          "Invalid credentials or account not approved by admin."
      );
    }
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;