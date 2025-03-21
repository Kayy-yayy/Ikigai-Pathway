import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Define types
export type UserProfile = {
  id: string;
  email: string;
  avatar_id: string | null;
  avatar_url: string | null;
  created_at?: string;
};

export type UserContextType = {
  user: UserProfile | null;
  loading: boolean;
  signInWithEmail: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
  updateAvatar: (avatarId: string) => Promise<{ success: boolean; message: string }>;
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

  // Check for existing session on load
  useEffect(() => {
    if (!supabase) return;

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          setLoading(false);
          return;
        }
        
        if (session) {
          const { user: authUser } = session;
          
          // Get user profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();
          
          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error fetching profile:', profileError);
          }
          
          // Check if user has an avatar
          const hasAvatar = profile?.avatar_id || authUser.user_metadata?.avatar_id;
          
          // If no avatar, set flag to show avatar selection
          if (!hasAvatar) {
            setNeedsAvatarSelection(true);
          }
          
          // Set user data
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            avatar_id: profile?.avatar_id || authUser.user_metadata?.avatar_id || null,
            avatar_url: profile?.avatar_url || authUser.user_metadata?.avatar_url || null,
            created_at: profile?.created_at || authUser.created_at
          });
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Check session immediately
    checkSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { user: authUser } = session;
          
          // Get user profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();
          
          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error fetching profile:', profileError);
          }
          
          // Check if user has an avatar
          const hasAvatar = profile?.avatar_id || authUser.user_metadata?.avatar_id;
          
          // If no avatar, set flag to show avatar selection
          if (!hasAvatar) {
            setNeedsAvatarSelection(true);
          }
          
          // Set user data
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            avatar_id: profile?.avatar_id || authUser.user_metadata?.avatar_id || null,
            avatar_url: profile?.avatar_url || authUser.user_metadata?.avatar_url || null,
            created_at: profile?.created_at || authUser.created_at
          });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setNeedsAvatarSelection(false);
        }
      }
    );
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Sign in with email (sends OTP)
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
      
      // Verify the OTP
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      });
      
      if (error) {
        throw new Error(error.message || 'Invalid verification code');
      }
      
      if (!data.user) {
        throw new Error('Failed to verify user');
      }
      
      // Check if user has an avatar
      const { data: profile } = await supabase
        .from('profiles')
        .select('avatar_id')
        .eq('id', data.user.id)
        .single();
      
      const hasAvatar = profile?.avatar_id || data.user.user_metadata?.avatar_id;
      
      // If no avatar, set flag to show avatar selection
      if (!hasAvatar) {
        setNeedsAvatarSelection(true);
        return { 
          success: true, 
          message: 'Login successful! Now let\'s choose your avatar.' 
        };
      }
      
      return { 
        success: true, 
        message: 'Login successful!' 
      };
    } catch (error) {
      console.error('Error verifying code:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update avatar
  const updateAvatar = async (avatarId: string) => {
    if (!supabase || !user) return { success: false, message: 'Not authenticated' };
    
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
          email: user.email
        });
      
      if (profileError) {
        console.error('Error updating profile:', profileError);
      }
      
      // Update local user state
      setUser({
        ...user,
        avatar_id: avatarId,
        avatar_url: `/images/avatar images/${avatarId}.jpg`
      });
      
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
    signOut,
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

export default UserContext;
