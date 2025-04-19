import React, { createContext, useState, useContext, useEffect } from "react";

export const AuthContext = createContext(); // ✅ Named export

export const useAuth = () => {
  return useContext(AuthContext); // ✅ Ensures hook consistency
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true"; // ✅ Load from localStorage
  });

  const [userData, setUserData] = useState(() => {
    const savedUserData = localStorage.getItem("userData");
    return savedUserData ? JSON.parse(savedUserData) : null;
  });

  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
    localStorage.setItem("userData", JSON.stringify(userData));
  }, [isAuthenticated, userData]);

  const logout = () => {
    setIsAuthenticated(false);
    setUserData(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userData");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userData, setUserData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
