"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function bootstrap() {
      try {
        const response = await api.get("/auth/me");

        if (isActive) {
          setUser(response.data.user ?? null);
        }
      } catch {
        if (isActive) {
          setUser(null);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    bootstrap();

    return () => {
      isActive = false;
    };
  }, []);

  async function login(credentials) {
    await api.post("/auth/login", credentials);
    const response = await api.get("/auth/me");
    setUser(response.data.user ?? null);
    router.refresh();
  }

  async function logout() {
    await api.post("/auth/logout");
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