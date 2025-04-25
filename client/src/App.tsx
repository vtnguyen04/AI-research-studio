import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import Home from "@/pages/home";
import Theory from "@/pages/theory";
import Implementation from "@/pages/implementation";
import Experiments from "@/pages/experiments";
import Papers from "@/pages/papers";
import Dashboard from "@/pages/dashboard";
import ConceptPage from "@/pages/concept/[conceptId]";
import PaperPage from "@/pages/paper/[paperId]";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 md:ml-64">
        <TopNavbar />
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => (
        <Layout>
          <Home />
        </Layout>
      )} />
      <Route path="/theory" component={() => (
        <Layout>
          <Theory />
        </Layout>
      )} />
      <Route path="/implementation" component={() => (
        <Layout>
          <Implementation />
        </Layout>
      )} />
      <Route path="/experiments" component={() => (
        <Layout>
          <Experiments />
        </Layout>
      )} />
      <Route path="/papers" component={() => (
        <Layout>
          <Papers />
        </Layout>
      )} />
      <Route path="/dashboard" component={() => (
        <Layout>
          <Dashboard />
        </Layout>
      )} />
      <Route path="/concept/:conceptId" component={({ params }) => (
        <Layout>
          <ConceptPage conceptId={params.conceptId} />
        </Layout>
      )} />
      <Route path="/paper/:paperId" component={({ params }) => (
        <Layout>
          <PaperPage paperId={params.paperId} />
        </Layout>
      )} />
      <Route component={() => (
        <Layout>
          <NotFound />
        </Layout>
      )} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
