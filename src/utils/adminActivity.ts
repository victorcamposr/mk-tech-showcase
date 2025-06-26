
import { supabase } from '@/integrations/supabase/client';

export const logAdminActivity = async (
  actionType: 'create' | 'update' | 'delete',
  entityType: string,
  entityTitle: string,
  userName: string = 'Administrador'
) => {
  try {
    const { error } = await supabase
      .from('admin_activities')
      .insert([{
        action_type: actionType,
        entity_type: entityType,
        entity_title: entityTitle,
        user_name: userName
      }]);
    
    if (error) {
      console.error('Error logging admin activity:', error);
    }
  } catch (error) {
    console.error('Error logging admin activity:', error);
  }
};
