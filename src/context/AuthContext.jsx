"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

const DEMO_EMAIL = "admin@razvi";
const DEMO_PASSWORD = "123";
const DEMO_USER = { email: DEMO_EMAIL, name: "Admin" };
const STORAGE_KEY = "razvi_user";

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const resolved = stored ? JSON.parse(stored) : DEMO_USER;
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USER));
      }
      setUser(resolved);
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USER));
      setUser(DEMO_USER);
    } finally {
      setIsLoading(false);
    }
  }, []);

  async function login({ email, password }) {
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USER));
      setUser(DEMO_USER);
      router.refresh();
    } else {
      throw new Error("Invalid credentials.");
    }
  }

  async function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    router.replace("/login");
    router.refresh();
  }

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        login,
        logout,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}