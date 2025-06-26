
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

    // Criar descrição mais amigável para atividades de usuário
    let finalEntityTitle = entityTitle;
    if (entityType === 'admin_profiles') {
      switch (actionType) {
        case 'create':
          finalEntityTitle = `criou o usuário ${entityTitle}`;
          break;
        case 'update':
          finalEntityTitle = `atualizou o usuário ${entityTitle}`;
          break;
        case 'delete':
          finalEntityTitle = `excluiu o usuário ${entityTitle}`;
          break;
      }
    } else {
      // Para outras entidades, manter o formato original
      switch (actionType) {
        case 'create':
          finalEntityTitle = `criou ${entityTitle}`;
          break;
        case 'update':
          finalEntityTitle = `atualizou ${entityTitle}`;
          break;
        case 'delete':
          finalEntityTitle = `excluiu ${entityTitle}`;
          break;
      }
    }

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
