import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: number;
  email: string;
  full_name: string;
  bio: string | null;
  avatar: string | null;
  is_online: boolean;
  last_seen: string | null;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children, initialUser, token }: { children: React.ReactNode, initialUser: User | null, token: string | null }) {
  const [user, setUser] = useState<User | null>(initialUser);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
