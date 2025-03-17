import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/Navbar";
import CommunityBoard from "@/pages/CommunityBoard";
import IssueSubmissionForm from "@/pages/IssueSubmissionForm";
import ProjectDetails from "@/pages/ProjectDetails";

function Router() {
  const { toast } = useToast();

  // Global error handler for API requests
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && typeof event.reason.message === 'string') {
      toast({
        variant: "destructive",
        title: "Error",
        description: event.reason.message,
      });
    }
  });

  return (
    <>
      <Navbar />
      <Switch>
        <Route path="/" component={CommunityBoard} />
        <Route path="/submit" component={IssueSubmissionForm} />
        <Route path="/projects/:id" component={ProjectDetails} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
