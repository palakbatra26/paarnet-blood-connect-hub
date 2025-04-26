import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  bloodType?: string;
  phone?: string;
  status?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        role: 'user'
      });

      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  // Check for existing token on mount
  React.useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // Fetch user data using the token
      axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          // If token is invalid, clear it
          localStorage.removeItem('token');
          setToken(null);
        });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        token,
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
