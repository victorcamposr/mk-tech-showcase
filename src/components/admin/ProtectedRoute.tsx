
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      setTimeout(() => setIsChecking(false), 500);
    }
  }, [loading]);

  useEffect(() => {
    if (!loading && !isChecking && (!user || !isAdmin)) {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você precisa fazer login como administrador para acessar esta página.",
      });
    }
  }, [loading, isChecking, user, isAdmin, toast]);

  if (loading || isChecking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-gray-600">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold mb-4"></div>
          <p>Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
