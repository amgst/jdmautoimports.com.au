import { Switch, Route, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Cars from "@/pages/cars";
import CarDetail from "@/pages/car-detail";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Terms from "@/pages/terms";
import AdminDashboard from "@/pages/admin/dashboard";
import CarsList from "@/pages/admin/cars-list";
import CarForm from "@/pages/admin/car-form";
import PricingSettings from "@/pages/admin/pricing-settings";
import WebsiteSettings from "@/pages/admin/website-settings";
import AdminBookings from "@/pages/admin/bookings";
import { useWebsiteSettings } from "@/hooks/use-website-settings";
import { SEO } from "@/components/seo";
import AdminLogin from "@/pages/admin-login";
import SetupGuide from "@/components/setup-guide";
import { isFirebaseInitialized } from "@/lib/firebase";

// Simple Protected Route Component
function ProtectedRoute({ component: Component, ...rest }: any) {
  const isAuthenticated = localStorage.getItem("isAdminAuthenticated") === "true";
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/admin/login");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) return null;
  return <Component {...rest} />;
}

// Component to scroll to top on route change
function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // Scroll window to top when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Use "smooth" for smooth scrolling, "instant" for immediate
    });

    // Also scroll admin panel's main container to top if it exists
    const adminMain = document.querySelector('main.overflow-auto');
    if (adminMain) {
      adminMain.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  }, [location]);

  return null;
}

function AdminRouter() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
          </header>
          <main className="flex-1 overflow-auto">
            <div className="p-8">
              <Switch>
                <Route path="/admin/cars/new" component={CarForm} />
                <Route path="/admin/cars/:id/edit" component={CarForm} />
                <Route path="/admin/cars" component={CarsList} />
                <Route path="/admin/pricing" component={PricingSettings} />
                <Route path="/admin/website-settings" component={WebsiteSettings} />
                <Route path="/admin/bookings" component={AdminBookings} />
                <Route path="/admin" component={AdminDashboard} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function PublicRouter() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/cars" component={Cars} />
          <Route path="/cars/:slug" component={CarDetail} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/terms" component={Terms} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLogin} />
      <ProtectedRoute path="/admin/cars/new" component={AdminRouter} />
      <ProtectedRoute path="/admin/cars/:id/edit" component={AdminRouter} />
      <ProtectedRoute path="/admin/cars" component={AdminRouter} />
      <ProtectedRoute path="/admin/pricing" component={AdminRouter} />
      <ProtectedRoute path="/admin/website-settings" component={AdminRouter} />
      <ProtectedRoute path="/admin/bookings" component={AdminRouter} />
      <ProtectedRoute path="/admin" component={AdminRouter} />
      <Route component={PublicRouter} />
    </Switch>
  );
}

function AppContent() {
  // Update HTML head with website settings
  useWebsiteSettings();

  return (
    <>
      <SEO />
      <ScrollToTop />
      <Router />
    </>
  );
}

function App() {
  const [demoMode, setDemoMode] = useState(false);

  if (!isFirebaseInitialized && !demoMode) {
    return <SetupGuide onSkip={() => setDemoMode(true)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;