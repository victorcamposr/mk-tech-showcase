
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PerformanceOptimizer from "@/components/PerformanceOptimizer";
import ScrollToTop from "@/components/ScrollToTop";
import AccessibilityHelper from "@/components/AccessibilityHelper";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Solutions from "./pages/Solutions";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminSolutions from "./pages/admin/AdminSolutions";
import AdminPortfolio from "./pages/admin/AdminPortfolio";
import CreateSolution from "./pages/admin/CreateSolution";
import EditSolution from "./pages/admin/EditSolution";
import ProtectedRoute from "./components/admin/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PerformanceOptimizer />
          <ScrollToTop />
          <AccessibilityHelper />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/servicos" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/solucoes" element={<Solutions />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute>
                  <AdminUsers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/contacts" 
              element={
                <ProtectedRoute>
                  <AdminContacts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/blog" 
              element={
                <ProtectedRoute>
                  <AdminBlog />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/solutions" 
              element={
                <ProtectedRoute>
                  <AdminSolutions />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/solutions/create" 
              element={
                <ProtectedRoute>
                  <CreateSolution />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/solutions/:id/edit" 
              element={
                <ProtectedRoute>
                  <EditSolution />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/portfolio" 
              element={
                <ProtectedRoute>
                  <AdminPortfolio />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
