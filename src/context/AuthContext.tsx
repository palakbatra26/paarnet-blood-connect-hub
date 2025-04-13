
import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Mock functions - these would be replaced with actual API calls
  const login = async (email: string, password: string) => {
    // For demo purposes - hardcoded admin login
    if (email === "admin@example.com" && password === "admin123") {
      setUser({
        id: "admin-123",
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
      });
      return;
    }
    
    // Regular user login
    setUser({
      id: "user-123",
      name: "Test User",
      email: email,
      role: "user",
    });
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (name: string, email: string, password: string) => {
    // For demo purposes - just set as a regular user
    setUser({
      id: "user-" + Date.now(),
      name: name,
      email: email,
      role: "user",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        logout,
        register,
      }}
    >
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
