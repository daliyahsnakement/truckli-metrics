
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import Layout from "@/components/layout/layout";
import Dashboard from "@/pages/Dashboard";
import Clients from "@/pages/Clients";
import ClientDetail from "@/pages/ClientDetail";
import AddClient from "@/pages/AddClient";
import EditClient from "@/pages/EditClient";
import Trucks from "@/pages/Trucks";
import AddTruck from "@/pages/AddTruck";
import EditTruck from "@/pages/EditTruck";
import TruckDetail from "@/pages/TruckDetail";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              
              <Route path="/clients" element={<Clients />} />
              <Route path="/clients/add" element={<AddClient />} />
              <Route path="/clients/:id" element={<ClientDetail />} />
              <Route path="/clients/:id/edit" element={<EditClient />} />
              
              <Route path="/trucks" element={<Trucks />} />
              <Route path="/trucks/add" element={<AddTruck />} />
              <Route path="/trucks/:id" element={<TruckDetail />} />
              <Route path="/trucks/:id/edit" element={<EditTruck />} />
              <Route path="/clients/:clientId/trucks/add" element={<AddTruck />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
