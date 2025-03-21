import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Define types
type UserProfile = {
  id: string;
  email: string;
  username: string;
  avatar_url: string;
  avatar_id: string;
  created_at?: string;
  updated_at?: string;
};

type UserContextType = {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string, avatarId: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  // Initialize Supabase client
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    if (supabaseUrl && supabaseKey) {
      const client = createClient(supabaseUrl, supabaseKey);
      setSupabase(client);
    }
  }, []);

  // Check for existing session on load
  useEffect(() => {
    if (!supabase) return;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { user } = session;
          await fetchProfile(user.id);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await fetchProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Fetch user profile from Supabase
  const fetchProfile = async (userId: string) => {
    if (!supabase) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setUser(data as UserProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    if (!supabase) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        await fetchProfile(data.user.id);
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, username: string, avatarId: string) => {
    if (!supabase) return;
    
    try {
      setLoading(true);
      
      // Validate required fields
      if (!email || !password || !username || !avatarId) {
        throw new Error('All fields are required');
      }
      
      // Step 1: Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            avatar_id: avatarId,
            avatar_url: `/images/avatar images/${avatarId}.jpg`
          }
        }
      });
      
      if (authError) {
        throw new Error(authError.message || 'Failed to sign up');
      }
      
      if (!authData.user) {
        throw new Error('Failed to create user account');
      }
      
      // If we have a session, the user is automatically signed in
      if (authData.session) {
        // The auth state change listener will handle setting the user
        // We don't need to do anything else here
      } else {
        // If no session, user might need to verify email first
        throw new Error('Account created! Please check your email to verify your account before signing in.');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    if (!supabase) return;
    
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Refresh profile function
  const refreshProfile = async () => {
    if (!supabase || !user) return;
    
    try {
      setLoading(true);
      await fetchProfile(user.id);
    } catch (error) {
      console.error('Error refreshing profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
