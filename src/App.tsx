import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import AccessibilityHelper from "./components/AccessibilityHelper";
import PerformanceOptimizer from "./components/PerformanceOptimizer";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";
import Solutions from "./pages/Solutions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AccessibilityHelper>
        <PerformanceOptimizer />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/servicos" element={<Services />} />
          <Route path="/solucoes" element={<Solutions />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contato" element={<Contact />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </AccessibilityHelper>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
