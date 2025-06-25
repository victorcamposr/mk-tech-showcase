
import { Toaster } from "@/components/ui/toaster";
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
        <BrowserRouter future={{ v7_startTransition: true }}>
          <ScrollToTop />
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/servicos" element={<Services />} />
          <Route path="/solucoes" element={<Solutions />} />
          <Route path="/solucoes/pdv-frente-caixa" element={<Solutions />} />
          <Route path="/solucoes/mesas-comandas" element={<Solutions />} />
          <Route path="/solucoes/cardapio-digital" element={<Solutions />} />
          <Route path="/solucoes/maquininhas-cartao" element={<Solutions />} />
          <Route path="/solucoes/controle-motoboys" element={<Solutions />} />
          <Route path="/solucoes/integracoes" element={<Solutions />} />
          <Route path="/solucoes/gestao-analise" element={<Solutions />} />
          <Route path="/solucoes/robo-whatsapp" element={<Solutions />} />
          <Route path="/solucoes/nota-fiscal" element={<Solutions />} />
          <Route path="/solucoes/auto-atendimento" element={<Solutions />} />
          <Route path="/solucoes/marketing-vendas" element={<Solutions />} />
          <Route path="/solucoes/pagamento-tef" element={<Solutions />} />
          <Route path="/solucoes/franquias-filiais" element={<Solutions />} />
          <Route path="/solucoes/autoatendimento-tablet" element={<Solutions />} />
          <Route path="/solucoes/sistema-revendas-gas-agua" element={<Solutions />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contato" element={<Contact />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
      </AccessibilityHelper>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
