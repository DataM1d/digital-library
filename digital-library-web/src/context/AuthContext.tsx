"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, LoginCredentials, RegisterPayload, AuthResponse } from "@/types";
import { api, UserSchema } from "@/lib/api";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false); // To prevent hydration flicker
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const initAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");
        
        if (token && savedUser) {
          const parsedUser = JSON.parse(savedUser);
          const validateUser = UserSchema.parse(parsedUser);
          setUser(validateUser);
        }
      } catch (error) {
        localStorage.clear();
        console.log(error)
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const handleAuthSuccess = (res: AuthResponse) => {
    localStorage.setItem("token", res.token);
    if (res.user) {
      localStorage.setItem("user", JSON.stringify(res.user));
      setUser(res.user); 
    } else {
      localStorage.removeItem("user");
      setUser(null);
    }
    router.push("/");
  };

  const login = async (credentials: LoginCredentials) => {
    const res = await api.auth.login(credentials);
    handleAuthSuccess(res);
  };

  const register = async (payload: RegisterPayload) => {
    const res = await api.auth.register(payload);
    handleAuthSuccess(res);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.refresh(); // Refresh to clear any cached data
    router.push("/login");
  };

  const value = { user, loading, login, register, logout, isAuthenticated: !!user };

  return (
    <AuthContext.Provider value={value}>
      {mounted ? children : null}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}