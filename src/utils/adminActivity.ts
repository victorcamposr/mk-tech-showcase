
import { supabase } from '@/integrations/supabase/client';

export const logAdminActivity = async (
  actionType: 'create' | 'update' | 'delete',
  entityType: string,
  entityTitle: string,
  userName?: string
) => {
  try {
    let finalUserName = userName || 'Administrador';
    
    // Se não foi fornecido um userName, tentar buscar do admin_profiles
    if (!userName) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: adminProfile } = await supabase
          .from('admin_profiles')
          .select('name')
          .eq('user_id', user.id)
          .single();
        
        if (adminProfile?.name) {
          finalUserName = adminProfile.name;
        }
      }
    }

    // Para admin_profiles, usar apenas o nome do usuário no entity_title
    let finalEntityTitle = entityTitle;
    
    // Substituir "admin_profiles" por "usuário" na entidade
    const displayEntityType = entityType === 'admin_profiles' ? 'usuário' : entityType;

    const { error } = await supabase
      .from('admin_activities')
      .insert([{
        action_type: actionType,
        entity_type: displayEntityType,
        entity_title: finalEntityTitle,
        user_name: finalUserName
      }]);
    
    if (error) {
      console.error('Error logging admin activity:', error);
    }
  } catch (error) {
    console.error('Error logging admin activity:', error);
  }
};
