"use client";

import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <Toaster
          position="bottom-right"
          richColors
          toastOptions={{
            classNames: {
              toast: "sonner-toast",
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}