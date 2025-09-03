import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import LoginProfissional from "./pages/LoginProfissional";
import Quiz from "./pages/Quiz";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ConsentimentoResponsavel from "./pages/ConsentimentoResponsavel";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import TermosUso from "./pages/TermosUso";
import DashboardPsicologo from "./pages/DashboardPsicologo";
import AvaliacaoPos from "./pages/AvaliacaoPos";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-profissional" element={<LoginProfissional />} />
          <Route path="/consentimento" element={<ConsentimentoResponsavel />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard-psicologo" element={<DashboardPsicologo />} />
          <Route path="/avaliacao-pos" element={<AvaliacaoPos />} />
          <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
          <Route path="/termos-de-uso" element={<TermosUso />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
