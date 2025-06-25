
// Utility function to create an admin user
// This would typically be done through the database directly
// but adding this file for reference

import { supabase } from '@/integrations/supabase/client';

export const createAdminUser = async (email: string, password: string, name: string) => {
  try {
    // First, create the user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    });

    if (authError) {
      console.error('Error creating user:', authError);
      return { error: authError };
    }

    if (authData.user) {
      // Then create admin profile
      const { error: profileError } = await supabase
        .from('admin_profiles')
        .insert({
          user_id: authData.user.id,
          email: email,
          name: name,
          role: 'admin',
          is_active: true
        });

      if (profileError) {
        console.error('Error creating admin profile:', profileError);
        return { error: profileError };
      }

      console.log('Admin user created successfully');
      return { success: true };
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return { error };
  }
};
