import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { AuthContext } from '@/contexts/AuthContext';
// import { useToast } from '@/components/ui/use-toast';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (err) {
        console.error('Error fetching session:', err);
        setError('Failed to restore session');
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("Auth state changed:", _event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // toast({
      //   title: "Success",
      //   description: "You have been signed in!",
      // });

    } catch (err) {
      console.error('Error signing in:', err);
      const message = err instanceof Error ? err.message : 'Failed to sign in';
      setError(message);
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: message,
      // });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) {
        throw error;
      }

      // toast({
      //   title: "Account created",
      //   description: "You have been signed up successfully!",
      // });

    } catch (err) {
      console.error('Error signing up:', err);
      const message = err instanceof Error ? err.message : 'Failed to sign up';
      setError(message);
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: message,
      // });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      // toast({
      //   title: "Signed out",
      //   description: "You have been signed out successfully",
      // });
    } catch (err) {
      console.error('Error signing out:', err);
      const message = err instanceof Error ? err.message : 'Failed to sign out';
      setError(message);
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: message,
      // });
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        signIn,
        signUp,
        signOut,
        loading,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
