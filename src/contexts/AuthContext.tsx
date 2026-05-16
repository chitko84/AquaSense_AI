/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { getCurrentUser, handleFirestoreError, OperationType } from '../services/firebaseService';

interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  phone?: string;
  trustScore?: number;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getCurrentUser(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser && isFirebaseConfigured && db) {
        try {
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setProfile({ uid: firebaseUser.uid, ...docSnap.data() } as UserProfile);
          } else if (firebaseUser.email === 'admin@parkluar.com') {
             // Fallback for the requested default admin if not in Firestore yet
             setProfile({
               uid: firebaseUser.uid,
               email: firebaseUser.email!,
               name: 'System Admin',
               role: 'admin'
             });
          } else {
            // Default profile for new/migrated users
            setProfile({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'User',
              role: 'user'
            });
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      } else if (firebaseUser && !isFirebaseConfigured) {
        // Mock profile for sample mode
        setProfile({
          uid: 'mock-uid',
          email: 'guest@aqua-sense.ai',
          name: 'Demo User',
          role: 'admin' // Enable all for demo
        });
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
