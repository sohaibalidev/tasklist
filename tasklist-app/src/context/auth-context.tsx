import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

type AuthContextData = {
  session: Session | null;
  user: Session['user'] | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await GoogleSignin.configure({
          webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
          offlineAccess: true,
          scopes: ['profile', 'email'],
        });
        console.log('Google Sign-In configured');

        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log('Starting Google Sign-In...');

      await GoogleSignin.hasPlayServices();

      await GoogleSignin.signOut();

      const response = await GoogleSignin.signIn();
      console.log('Google Sign-In response received');

      const idToken = response.data?.idToken;

      if (!idToken) {
        throw new Error('No ID token received');
      }

      console.log('Got ID token, signing into Supabase...');

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) throw error;

      console.log('Successfully signed in to Supabase');

    } catch (error: any) {
      console.error('Sign-in error details:', {
        code: error.code,
        message: error.message,
        error: error
      });

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled sign in');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services not available');
      } else if (error.message?.includes('A non-recoverable sign in failure')) {
        console.log('Configuration error - check Google Cloud Console');
      } else {
        console.log('Other error:', error);
      }
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await Promise.all([
        GoogleSignin.signOut(),
        supabase.auth.signOut()
      ]);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    session,
    user: session?.user ?? null,
    isLoading,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};