'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AppUser } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signInAsGuest: (username: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On initial load, check for a guest user in sessionStorage
    try {
      const storedGuest = sessionStorage.getItem('bingo-guest-user');
      if (storedGuest) {
        setUser(JSON.parse(storedGuest));
      }
    } catch (error) {
      console.error("Failed to parse guest user from sessionStorage", error);
      sessionStorage.removeItem('bingo-guest-user');
    }
    setLoading(false);
  }, []);

  const signInAsGuest = async (username: string) => {
    setLoading(true);
    const guestId = `guest_${Date.now()}`;
    const guestUser: AppUser = {
      uid: guestId,
      displayName: username,
      photoURL: `https://api.dicebear.com/8.x/initials/svg?seed=${username}`,
      isGuest: true,
    };
    try {
        sessionStorage.setItem('bingo-guest-user', JSON.stringify(guestUser));
        setUser(guestUser);
    } catch (error) {
        console.error("Failed to save guest user to sessionStorage", error);
    }
    setLoading(false);
  };

  const signOut = async () => {
    sessionStorage.removeItem('bingo-guest-user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInAsGuest, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
