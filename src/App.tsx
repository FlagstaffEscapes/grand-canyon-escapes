import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import { ScrollToTop } from "./components/layout/ScrollToTop";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Owners from "./pages/Owners";
import Experiences from "./pages/Experiences";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminPropertyEditor from "./pages/admin/AdminPropertyEditor";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminOwnerInquiries from "./pages/admin/AdminOwnerInquiries";
import AdminAreaGuides from "./pages/admin/AdminAreaGuides";
import AdminAreaGuideEditor from "./pages/admin/AdminAreaGuideEditor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:slug" element={<PropertyDetail />} />
            <Route path="/owners" element={<Owners />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/about" element={<About />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/properties" element={<ProtectedRoute><AdminProperties /></ProtectedRoute>} />
            <Route path="/admin/properties/:id" element={<ProtectedRoute><AdminPropertyEditor /></ProtectedRoute>} />
            <Route path="/admin/area-guides" element={<ProtectedRoute><AdminAreaGuides /></ProtectedRoute>} />
            <Route path="/admin/area-guides/:id" element={<ProtectedRoute><AdminAreaGuideEditor /></ProtectedRoute>} />
            <Route path="/admin/contacts" element={<ProtectedRoute><AdminContacts /></ProtectedRoute>} />
            <Route path="/admin/owners" element={<ProtectedRoute><AdminOwnerInquiries /></ProtectedRoute>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
