import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

// Define types
export type UserProfile = {
  id: string;
  email: string;
  username?: string;
  avatar_id?: string;
  avatar_url?: string;
  created_at?: string;
  has_completed_questions?: boolean;
};

export type UserContextType = {
  user: UserProfile | null;
  loading: boolean;
  signInWithEmail: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
  updateAvatar: (avatarId: string, username?: string) => Promise<{ success: boolean; message: string }>;
  updateQuestionCompletion: (completed: boolean) => Promise<{ success: boolean; message: string }>;
  signOut: () => Promise<void>;
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

  // Initialize user session
  useEffect(() => {
    const initializeUser = async () => {
      try {
        setLoading(true);
        
        // Check for existing session
        const sessionResponse = await supabase?.auth.getSession();
        const session = sessionResponse?.data?.session;
        
        if (session?.user) {
          await updateUserState(session.user);
        }
      } catch (error) {
        console.error('Error initializing user:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();

    // Subscribe to auth changes
    const authListener = supabase?.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await updateUserState(session.user);
        } else {
          setUser(null);
          setNeedsAvatarSelection(false);
        }
      }
    );

    return () => {
      if (authListener) {
        authListener.data.subscription.unsubscribe();
      }
    };
  }, [supabase]);

  // Update user state with profile data
  const updateUserState = async (authUser: User) => {
    try {
      // Get user profile from profiles table
      const profileResponse = await supabase
        ?.from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileResponse?.error) {
        throw profileResponse.error;
      }

      const profile = profileResponse?.data;

      // Create user profile object
      const userProfile: UserProfile = {
        id: authUser.id,
        email: authUser.email || '',
        username: profile?.username || '',
        avatar_id: profile?.avatar_id || '',
        avatar_url: profile?.avatar_url || '',
        created_at: profile?.created_at || authUser.created_at,
        has_completed_questions: profile?.has_completed_questions || false
      };

      setUser(userProfile);
      
      // Check if user needs to select an avatar
      setNeedsAvatarSelection(!profile?.avatar_id);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      
      // If we can't get the profile, still set the basic user info
      setUser({
        id: authUser.id,
        email: authUser.email || '',
        has_completed_questions: false
      });
      
      // Assume they need to select an avatar
      setNeedsAvatarSelection(true);
    }
  };

  // Sign in with email (passwordless)
  const signInWithEmail = async (email: string) => {
    if (!supabase) return { success: false, message: 'Supabase client not initialized' };
    
    try {
      setLoading(true);
      
      // Validate email
      if (!email) {
        throw new Error('Email is required');
      }
      
      // Send magic link / OTP to email
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true, // Create user if they don't exist
        }
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to send login code');
      }
      
      return { 
        success: true, 
        message: 'Check your email for the login code' 
      };
    } catch (error) {
      console.error('Error sending login code:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP code
  const verifyOtp = async (email: string, otp: string) => {
    if (!supabase) return { success: false, message: 'Supabase client not initialized' };
    
    try {
      setLoading(true);
      
      // Validate inputs
      if (!email || !otp) {
        throw new Error('Email and verification code are required');
      }
      
      console.log('Verifying OTP...');
      
      // Verify the OTP
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      });
      
      if (error) {
        console.error('OTP verification error:', error);
        throw new Error(error.message || 'Invalid verification code');
      }
      
      if (!data.user) {
        throw new Error('Failed to verify user');
      }
      
      console.log('OTP verified successfully, checking profile...');
      
      try {
        // Check if user has an avatar - with timeout to prevent hanging
        const profilePromise = supabase
          .from('profiles')
          .select('avatar_id, username')
          .eq('id', data.user.id)
          .single();
          
        // Set a timeout of 3 seconds for the profile query
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Profile query timed out')), 3000)
        );
        
        // Race the profile query against the timeout
        const { data: profile } = await Promise.race([
          profilePromise,
          timeoutPromise
        ]) as any;
        
        const hasAvatar = profile?.avatar_id || data.user.user_metadata?.avatar_id;
        
        // If no avatar, set flag to show avatar selection
        if (!hasAvatar) {
          setNeedsAvatarSelection(true);
          // Update the user state immediately with what we know
          await updateUserState(data.user);
          return { 
            success: true, 
            message: 'Login successful! Now let\'s choose your avatar.' 
          };
        }
        
        // Update the user state with the authenticated user
        await updateUserState(data.user);
        
        return { 
          success: true, 
          message: 'Login successful!' 
        };
      } catch (profileError) {
        console.error('Error fetching profile:', profileError);
        // Even if profile fetch fails, we should still log the user in
        setNeedsAvatarSelection(true);
        await updateUserState(data.user);
        return { 
          success: true, 
          message: 'Login successful! Please set up your profile.' 
        };
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update avatar
  const updateAvatar = async (avatarId: string, username?: string) => {
    if (!supabase || !user) return { success: false, message: 'Not authenticated' };
    
    try {
      setLoading(true);
      
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          avatar_id: avatarId,
          ...(username ? { username } : {})
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
          email: user.email,
          ...(username ? { username } : {})
        });
      
      if (profileError) {
        console.error('Error updating profile:', profileError);
      }
      
      // Update local user state
      setUser(prev => prev ? {
        ...prev,
        avatar_id: avatarId,
        avatar_url: `/images/avatar images/${avatarId}.jpg`,
        ...(username ? { username } : {})
      } : null);
      
      // Reset the avatar selection flag
      setNeedsAvatarSelection(false);
      
      return { success: true, message: 'Avatar updated successfully!' };
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update question completion status
  const updateQuestionCompletion = async (completed: boolean) => {
    if (!supabase || !user) return { success: false, message: 'Not authenticated' };
    
    try {
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          has_completed_questions: completed
        }
      });
      
      if (updateError) {
        throw updateError;
      }
      
      // Update profile in database
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          has_completed_questions: completed,
          updated_at: new Date()
        })
        .eq('id', user.id);
      
      if (profileError) {
        throw profileError;
      }
      
      // Update local user state
      setUser(prev => prev ? {
        ...prev,
        has_completed_questions: completed
      } : null);
      
      return {
        success: true,
        message: 'Question completion status updated'
      };
    } catch (error) {
      console.error('Error updating question completion status:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update question completion status'
      };
    }
  };

  // Sign out
  const signOut = async () => {
    if (!supabase) return;
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    loading,
    signInWithEmail,
    verifyOtp,
    updateAvatar,
    updateQuestionCompletion,
    signOut,
    needsAvatarSelection,
    setNeedsAvatarSelection,
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

export default UserContext;
