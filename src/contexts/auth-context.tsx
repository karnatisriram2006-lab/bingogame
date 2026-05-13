'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { AppUser } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: (username: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        sessionStorage.removeItem('bingo-guest-user'); // Ensure guest session is cleared
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUser(userDoc.data() as AppUser);
        } else {
          // This case handles a new Google sign-in
          const newUser: AppUser = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            isGuest: false,
          };
          await setDoc(userDocRef, newUser);
          setUser(newUser);
        }
      } else {
        // No firebase user, check for a guest user in sessionStorage
        try {
          const storedGuest = sessionStorage.getItem('bingo-guest-user');
          if (storedGuest) {
            setUser(JSON.parse(storedGuest));
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Failed to parse guest user from sessionStorage", error);
          sessionStorage.removeItem('bingo-guest-user');
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // The onAuthStateChanged listener will handle setting the user state
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };
  
  const signInAsGuest = async (username: string) => {
    setLoading(true);
    const guestId = `guest_${Date.now()}`;
    const guestUser: AppUser = {
      uid: guestId,
      displayName: username,
      photoURL: `https://api.dicebear.com/8.x/initials/svg?seed=${username}`,
      isGuest: true,
    };
    sessionStorage.setItem('bingo-guest-user', JSON.stringify(guestUser));
    setUser(guestUser);
    setLoading(false);
  };

  const signOut = async () => {
    if (user?.isGuest) {
      sessionStorage.removeItem('bingo-guest-user');
      setUser(null);
    } else {
      await firebaseSignOut(auth);
      // onAuthStateChanged will set user to null
    }
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
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInAsGuest, signOut }}>
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
