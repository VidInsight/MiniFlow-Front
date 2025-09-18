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
import { WorkflowDetails } from "./pages/WorkflowDetails";
import Files from "./pages/Files";
import ExecutionMonitoring from "./pages/ExecutionMonitoring";
import ExecutionIOMonitoring from "./pages/ExecutionIOMonitoring";
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
            <Route path="workflow/:workflowId" element={<WorkflowDetails />} />
            <Route path="scripts" element={<Scripts />} />
            <Route path="environment" element={<Environment />} />
            <Route path="files" element={<Files />} />
            <Route path="executions" element={<ExecutionMonitoring />} />
            <Route path="execution-io" element={<ExecutionIOMonitoring />} />
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
