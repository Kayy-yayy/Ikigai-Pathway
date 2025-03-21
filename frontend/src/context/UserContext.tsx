import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Define types
export type UserProfile = {
  id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
  avatar_id: string | null;
};

export type UserContextType = {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string, avatarId: string) => Promise<{ success: boolean; message: string }>;
  signUpWithEmail: (email: string) => Promise<{ success: boolean; message: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateAvatar: (avatarId: string) => Promise<void>;
  needsAvatarSelection: boolean;
  setNeedsAvatarSelection: (value: boolean) => void;
};

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [needsAvatarSelection, setNeedsAvatarSelection] = useState(false);

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
    if (!supabase) return { success: false, message: 'Supabase client not initialized' };
    
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
          },
          emailRedirectTo: `${window.location.origin}`
          // Note: emailConfirm option removed as it's not supported
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
        return { success: true, message: 'Account created successfully! Welcome to Ikigai Pathway.' };
      } else {
        // Try to sign in immediately
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          console.error('Error signing in after signup:', signInError);
          return { success: true, message: 'Account created! Please sign in with your credentials.' };
        }
        
        return { success: true, message: 'Account created successfully! Welcome to Ikigai Pathway.' };
      }
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email only function
  const signUpWithEmail = async (email: string) => {
    if (!supabase) return { success: false, message: 'Supabase client not initialized' };
    
    try {
      setLoading(true);
      
      // Validate email
      if (!email) {
        throw new Error('Email is required');
      }
      
      // Generate a random password
      const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      
      // Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: tempPassword,
        options: {
          data: {
            email_signup: true
          }
        }
      });
      
      if (authError) {
        throw new Error(authError.message || 'Failed to sign up');
      }
      
      if (!authData.user) {
        throw new Error('Failed to create user account');
      }
      
      // Set flag to show avatar selection tutorial
      setNeedsAvatarSelection(true);
      
      // If we have a session, the user is automatically signed in
      if (authData.session) {
        // Create a basic user profile
        setUser({
          id: authData.user.id,
          email: authData.user.email || '',
          username: null,
          avatar_url: null,
          avatar_id: null
        });
        
        return { success: true, message: 'Account created successfully! Now let\'s choose your avatar.' };
      } else {
        // Try to sign in immediately
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: tempPassword
        });
        
        if (signInError) {
          console.error('Error signing in after signup:', signInError);
          return { success: true, message: 'Account created! Please check your email for login instructions.' };
        }
        
        return { success: true, message: 'Account created successfully! Now let\'s choose your avatar.' };
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

  // Update avatar function
  const updateAvatar = async (avatarId: string) => {
    if (!supabase || !user) return;
    
    try {
      setLoading(true);
      
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          avatar_id: avatarId,
          avatar_url: `/images/avatar images/${avatarId}.jpg`
        }
      });
      
      if (updateError) {
        throw new Error(updateError.message || 'Failed to update avatar');
      }
      
      // Update profile in database
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          avatar_id: avatarId,
          avatar_url: `/images/avatar images/${avatarId}.jpg`,
          username: user.username || user.email?.split('@')[0] || 'User'
        });
      
      if (profileError) {
        console.error('Error updating profile:', profileError);
      }
      
      // Update local user state
      setUser({
        ...user,
        avatar_id: avatarId,
        avatar_url: `/images/avatar images/${avatarId}.jpg`,
        username: user.username || user.email?.split('@')[0] || 'User'
      });
      
      // Reset the avatar selection flag
      setNeedsAvatarSelection(false);
      
    } catch (error) {
      console.error('Error updating avatar:', error);
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
    signUpWithEmail,
    signOut,
    refreshProfile,
    updateAvatar,
    needsAvatarSelection,
    setNeedsAvatarSelection
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
