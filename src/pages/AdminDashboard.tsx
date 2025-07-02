import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, FileText, Users, ListChecks, PackageCheck, MessageSquare } from "lucide-react";
import { logAdminActivity } from "@/utils/adminActivity";

const AdminDashboard = () => {
  const { user, adminProfile } = useAuth();
  const { toast } = useToast();

  const { data: activities } = useQuery({
    queryKey: ["admin-activities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_activities")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching admin activities:", error);
        return [];
      }

      return data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [
        { count: blogCount },
        { count: contactCount },
        { count: solutionCount },
        { count: userCount },
        { count: fiscalCount },
      ] = await Promise.all([
        supabase.from("blog_posts").select("*", { count: "exact", head: true }),
        supabase.from("contacts").select("*", { count: "exact", head: true }),
        supabase.from("solutions").select("*", { count: "exact", head: true }),
        supabase.from("admin_profiles").select("*", { count: "exact", head: true }),
        supabase.from("fiscal_data").select("*", { count: "exact", head: true }),
      ]);

      return {
        blog: blogCount || 0,
        contacts: contactCount || 0,
        solutions: solutionCount || 0,
        users: userCount || 0,
        fiscalData: fiscalCount || 0,
      };
    },
  });

  const cards = [
    {
      title: "Posts no Blog",
      value: stats?.blog || 0,
      icon: ListChecks,
      color: "bg-blue-500",
      link: "/admin/blog"
    },
    {
      title: "Mensagens de Contato",
      value: stats?.contacts || 0,
      icon: MessageSquare,
      color: "bg-green-500",
      link: "/admin/contacts"
    },
    {
      title: "Soluções Cadastradas",
      value: stats?.solutions || 0,
      icon: PackageCheck,
      color: "bg-yellow-500",
      link: "/admin/solutions"
    },
    {
      title: "Usuários Admin",
      value: stats?.users || 0,
      icon: Users,
      color: "bg-red-500",
      link: "/admin/users"
    },
    {
      title: "Cadastros Fiscais",
      value: stats?.fiscalData || 0,
      icon: FileText,
      color: "bg-purple-500",
      link: "/admin/fiscal-data"
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Bem-vindo(a), {adminProfile?.name || user?.email || "Administrador"}!
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${card.color}`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                    className="w-full"
                  >
                    <a href={card.link}>
                      Ver detalhes
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activities */}
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Atividades Recentes
            </h2>
            <ul>
              {activities?.map((activity) => (
                <li key={activity.id} className="py-2 border-b last:border-none">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-gray-100 p-2">
                      <Activity className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-gray-700">
                        <span className="font-semibold">{activity.user_name}</span>{" "}
                        {activity.action_type} <span className="font-semibold">{activity.entity_title}</span> em{" "}
                        <span className="font-semibold">{activity.entity_type}</span>
                      </p>
                      <p className="text-gray-500 text-sm">
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
