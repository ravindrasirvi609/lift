"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: User | null | undefined;
  isLoading?: boolean;
  login: (userData: any) => void;
  logout: () => void;
}

interface User {
  id: string;
  email: string;
  isDriver: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  useEffect(() => {
    // Check for user data in localStorage on initial load
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: any) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    // Set authentication cookie here
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    // Remove authentication cookie here
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
