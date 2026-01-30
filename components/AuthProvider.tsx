'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';

export interface User {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  email: string | null;
  completedRaces: string[];
  completedChampionships: string[];
  experiencePoints: number;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  resetProgress: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch and merge Firestore user data with Firebase Auth user
  async function fetchUserData(firebaseUser: FirebaseUser, updateProfile: boolean = true): Promise<User | null> {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        // Existing user - update displayName and photoURL only if updateProfile is true
        const userData = userDoc.data();
        if (updateProfile) {
          await updateDoc(userRef, {
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            updatedAt: serverTimestamp(),
          });
        }

        return {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          email: firebaseUser.email,
          completedRaces: userData.completedRaces || [],
          completedChampionships: userData.completedChampionships || [],
          experiencePoints: userData.experiencePoints || 0,
        };
      } else {
        // New user - create document with default values
        const newUser: User = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          email: firebaseUser.email,
          completedRaces: [],
          completedChampionships: [],
          experiencePoints: 0,
        };

        await setDoc(userRef, {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          email: firebaseUser.email,
          completedRaces: [],
          completedChampionships: [],
          experiencePoints: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        return newUser;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  // Refresh user data from Firestore
  async function refreshUser() {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userData = await fetchUserData(currentUser, false);
      setUser(userData);
    }
  }

  // Reset user progress to default values
  async function resetProgress() {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        completedRaces: [],
        completedChampionships: [],
        experiencePoints: 0,
        updatedAt: serverTimestamp(),
      });
      
      // Refresh user data to reflect changes
      await refreshUser();
    } catch (error) {
      console.error('Error resetting progress:', error);
      throw error;
    }
  }

  // Sign in with Google
  async function signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userData = await fetchUserData(result.user);
      setUser(userData);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }

  // Sign out
  async function signOut() {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await fetchUserData(firebaseUser);
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    signInWithGoogle,
    signOut,
    refreshUser,
    resetProgress,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
