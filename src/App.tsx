import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import ServicesByCategory from "./pages/ServicesByCategory";
import Portfolio from "./pages/Portfolio";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Solutions from "./pages/Solutions";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSolutions from "./pages/admin/AdminSolutions";
import AdminServiceCategories from "./pages/admin/AdminServiceCategories";
import AdminServiceCards from "./pages/admin/AdminServiceCards";
import AdminHomeBanners from "./pages/admin/AdminHomeBanners";
import AdminPortfolio from "./pages/admin/AdminPortfolio";
import AdminContacts from "./pages/admin/AdminContacts";
import CreateSolution from "./pages/admin/CreateSolution";
import EditSolution from "./pages/admin/EditSolution";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import AccessibilityHelper from "./components/AccessibilityHelper";
import PerformanceOptimizer from "./components/PerformanceOptimizer";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <AccessibilityHelper />
            <PerformanceOptimizer />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/servicos" element={<Services />} />
              <Route path="/servicos/:categorySlug" element={<ServicesByCategory />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/solucoes" element={<Solutions />} />
              <Route path="/solucoes/:solutionKey" element={<Solutions />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/blog" element={
                <ProtectedRoute>
                  <AdminBlog />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/solutions" element={
                <ProtectedRoute>
                  <AdminSolutions />
                </ProtectedRoute>
              } />
              <Route path="/admin/service-categories" element={
                <ProtectedRoute>
                  <AdminServiceCategories />
                </ProtectedRoute>
              } />
              <Route path="/admin/service-cards" element={
                <ProtectedRoute>
                  <AdminServiceCards />
                </ProtectedRoute>
              } />
              <Route path="/admin/home-banners" element={
                <ProtectedRoute>
                  <AdminHomeBanners />
                </ProtectedRoute>
              } />
              <Route path="/admin/portfolio" element={
                <ProtectedRoute>
                  <AdminPortfolio />
                </ProtectedRoute>
              } />
              <Route path="/admin/contacts" element={
                <ProtectedRoute>
                  <AdminContacts />
                </ProtectedRoute>
              } />
              <Route path="/admin/solutions/create" element={
                <ProtectedRoute>
                  <CreateSolution />
                </ProtectedRoute>
              } />
              <Route path="/admin/solutions/:id/edit" element={
                <ProtectedRoute>
                  <EditSolution />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
