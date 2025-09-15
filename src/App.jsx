import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import Environment from "./pages/Environment";
import Scripts from "./pages/Scripts";
import Workflows from "./pages/Workflows";
import Files from "./pages/Files";
import SchemaTest from "./pages/SchemaTest";
import ExecutionMonitoring from "./pages/ExecutionMonitoring";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="workflows" element={<Workflows />} />
            <Route path="scripts" element={<Scripts />} />
            <Route path="environment" element={<Environment />} />
            <Route path="files" element={<Files />} />
            <Route path="schema-test" element={<SchemaTest />} />
            <Route path="executions" element={<ExecutionMonitoring />} />
            <Route path="analytics" element={<ComingSoon title="Analytics & Reports" description="Performance metrics, success rates, and detailed workflow analytics" />} />
            <Route path="templates" element={<ComingSoon title="Workflow Templates" description="Pre-built workflow templates for common automation patterns" />} />
            <Route path="integrations" element={<ComingSoon title="Integrations" description="Connect with external services and APIs" />} />
            <Route path="versions" element={<ComingSoon title="Version Control" description="Manage workflow versions with git-like functionality" />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
