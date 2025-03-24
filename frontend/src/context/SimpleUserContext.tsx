import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Define types
export type UserProfile = {
  id?: string;
  email: string;
  avatar_id: string;
  has_completed_questions: boolean;
};

export type SimpleUserContextType = {
  user: UserProfile | null;
  loading: boolean;
  saveUserInfo: (email: string, avatarId: string) => Promise<{ success: boolean; message: string }>;
  updateQuestionCompletion: (completed: boolean) => Promise<{ success: boolean; message: string }>;
};

// Create context
const SimpleUserContext = createContext<SimpleUserContextType | undefined>(undefined);

// Create provider component
export const SimpleUserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  // Initialize Supabase client
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pmmwlizpeouugdznnmas.supabase.co';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtbXdsaXpwZW91dWdkem5ubWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMDkwNzksImV4cCI6MjA1Nzg4NTA3OX0.w7ImUHowoMM0C6p1XZaL8hIKr5A9SVCTJagMWUWSDyk';
    
    if (supabaseUrl && supabaseKey) {
      const client = createClient(supabaseUrl, supabaseKey);
      setSupabase(client);
    }
  }, []);

  // Check for existing user in localStorage
  useEffect(() => {
    const checkExistingUser = async () => {
      try {
        setLoading(true);
        
        // Get user ID from localStorage
        const userId = localStorage.getItem('ikigaiUserId');
        
        if (userId && supabase) {
          // Fetch user profile from Supabase
          const { data, error } = await supabase
            .from('simple_profiles')
            .select('*')
            .eq('id', userId)
            .single();
          
          if (error) {
            console.error('Error fetching user profile:', error);
            localStorage.removeItem('ikigaiUserId');
            setUser(null);
          } else if (data) {
            setUser({
              id: data.id,
              email: data.email,
              avatar_id: data.avatar_id,
              has_completed_questions: data.has_completed_questions || false
            });
          }
        }
      } catch (error) {
        console.error('Error checking existing user:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (supabase) {
      checkExistingUser();
    }
  }, [supabase]);

  // Save user info to Supabase
  const saveUserInfo = async (email: string, avatarId: string) => {
    if (!supabase) return { success: false, message: 'Supabase client not initialized' };
    
    try {
      setLoading(true);
      
      // Check if user with this email already exists
      const { data: existingUser, error: searchError } = await supabase
        .from('simple_profiles')
        .select('*')
        .eq('email', email)
        .single();
      
      if (searchError && searchError.code !== 'PGRST116') { // PGRST116 means no rows returned
        console.error('Error searching for existing user:', searchError);
        throw new Error('Error checking for existing user');
      }
      
      let userId;
      
      if (existingUser) {
        // Update existing user
        userId = existingUser.id;
        const { error: updateError } = await supabase
          .from('simple_profiles')
          .update({
            avatar_id: avatarId,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
        
        if (updateError) {
          console.error('Error updating user:', updateError);
          throw new Error('Failed to update user information');
        }
      } else {
        // Create new user
        const { data: newUser, error: insertError } = await supabase
          .from('simple_profiles')
          .insert({
            email: email,
            avatar_id: avatarId,
            has_completed_questions: false
          })
          .select()
          .single();
        
        if (insertError) {
          console.error('Error creating user:', insertError);
          throw new Error('Failed to save user information');
        }
        
        userId = newUser.id;
      }
      
      // Save user ID to localStorage
      localStorage.setItem('ikigaiUserId', userId);
      
      // Update local state
      setUser({
        id: userId,
        email: email,
        avatar_id: avatarId,
        has_completed_questions: existingUser?.has_completed_questions || false
      });
      
      return { success: true, message: 'User information saved successfully' };
    } catch (error) {
      console.error('Error saving user info:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to save user information' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Update question completion status
  const updateQuestionCompletion = async (completed: boolean) => {
    if (!supabase || !user?.id) return { success: false, message: 'User not found' };
    
    try {
      setLoading(true);
      
      // Update user profile in Supabase
      const { error } = await supabase
        .from('simple_profiles')
        .update({
          has_completed_questions: completed,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) {
        console.error('Error updating completion status:', error);
        throw new Error('Failed to update completion status');
      }
      
      // Update local state
      setUser(prev => prev ? {
        ...prev,
        has_completed_questions: completed
      } : null);
      
      return { success: true, message: 'Completion status updated successfully' };
    } catch (error) {
      console.error('Error updating completion status:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to update completion status' 
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <SimpleUserContext.Provider
      value={{
        user,
        loading,
        saveUserInfo,
        updateQuestionCompletion
      }}
    >
      {children}
    </SimpleUserContext.Provider>
  );
};

// Custom hook to use the user context
export const useSimpleUser = () => {
  const context = useContext(SimpleUserContext);
  if (context === undefined) {
    throw new Error('useSimpleUser must be used within a SimpleUserProvider');
  }
  return context;
};

export default SimpleUserContext;
