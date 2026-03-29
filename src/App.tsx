import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import VisDroneLayout from "@/components/VisDroneLayout";
import * as VisDronePages from "@/pages/visdrone";
import AdminPage from "@/pages/visdrone/admin/AdminPage";
import AdminLogin from "@/pages/visdrone/admin/AdminLogin";
import { AuthProvider, ProtectedAdminRoute } from "@/contexts/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" expand={false} richColors />
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/visdrone" element={<VisDroneLayout />}>
                <Route index element={<VisDronePages.Home />} />
                <Route path="home" element={<VisDronePages.Home />} />
                <Route path="research" element={<VisDronePages.Research />} />
                <Route path="team" element={<VisDronePages.Team />} />
                <Route path="publications" element={<VisDronePages.Publications />} />
                <Route path="news" element={<VisDronePages.News />} />
                <Route path="news/:id" element={<VisDronePages.NewsDetail />} />
                <Route path="data-base" element={<VisDronePages.DataBase />} />
                <Route path="data-base/:id" element={<VisDronePages.DatasetDetail />} />
                <Route path="model-base" element={<VisDronePages.ModelBase />} />
                <Route path="model-base/:id" element={<VisDronePages.ModelDetail />} />
                <Route path="knowledge-base" element={<VisDronePages.KnowledgeBase />} />
                <Route path="knowledge-base/:id" element={<VisDronePages.KnowledgeDetail />} />
                <Route path="tools" element={<VisDronePages.Tools />} />
                <Route path="tools/:id" element={<VisDronePages.ToolsDetail />} />
                <Route path="contact" element={<VisDronePages.Contact />} />
                <Route path="seminar" element={<VisDronePages.Seminar />} />
                <Route path="admin/login" element={<AdminLogin />} />
                <Route path="admin/*" element={
                  <ProtectedAdminRoute>
                    <AdminPage />
                  </ProtectedAdminRoute>
                } />
              </Route>
              <Route path="/" element={<Navigate to="/visdrone" replace />} />
              <Route path="*" element={<Navigate to="/visdrone" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
