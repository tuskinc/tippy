import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { AuthProvider } from '@/components/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import RequireAuth from '@/components/RequireAuth';
import SidebarMenuComponent, { SidebarMenuDrawer } from '@/components/SidebarMenu';
import { useState, Suspense, lazy } from 'react';
import Navigation from '@/components/Navigation';
import { Helmet } from 'react-helmet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Lazy load all major pages
const IndexPage = lazy(() => import('@/pages/Index'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Services = lazy(() => import('@/pages/Services'));
const ServiceDetail = lazy(() => import('@/pages/ServiceDetail'));
const Providers = lazy(() => import('@/pages/Providers'));
const ProfessionalsListing = lazy(() => import('@/pages/ProfessionalsListing'));
const ProfessionalDetail = lazy(() => import('@/pages/ProfessionalDetail'));
const UserBookings = lazy(() => import('@/pages/UserBookings'));
const HowItWorksPage = lazy(() => import('@/pages/HowItWorksPage'));
const TrackingMap = lazy(() => import('@/pages/TrackingMap'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ChatbotPage = lazy(() => import('./pages/Chatbot'));
const TopProviders = lazy(() => import('./pages/TopProviders'));
const ProviderProfileWizard = lazy(() => import('./pages/ProviderProfileWizard'));
const MessagingPage = lazy(() => import('./pages/Messaging'));
const Settings = lazy(() => import('./pages/Settings'));
const ProfileSettings = lazy(() => import('./pages/ProfileSettings'));

const queryClient = new QueryClient();

function App() {
  // State to control sidebar drawer
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Helmet>
            <title>Tippy - Find Local Service Professionals</title>
            <meta name="description" content="Tippy helps you find and book trusted local service professionals." />
          </Helmet>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <Routes>
              {/* Public routes: Login and Register */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register/provider" element={<Register />} />

              {/* Protected routes: Only for authenticated users */}
              <Route
                path="/*"
                element={
                  <RequireAuth>
                    <Navigation onSidebarOpen={() => setSidebarOpen(true)} />
                    <SidebarMenuDrawer open={sidebarOpen} onOpenChange={setSidebarOpen} />
                    <div className="flex-1">
                      <Routes>
                        <Route path="/" element={<IndexPage />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/services/:categorySlug" element={<ServiceDetail />} />
                        <Route path="/services/:categorySlug/:serviceSlug" element={<ServiceDetail />} />
                        <Route path="/providers" element={<Providers />} />
                        <Route path="/professionals" element={<ProfessionalsListing />} />
                        <Route path="/professionals/:id" element={<ProfessionalDetail />} />
                        <Route path="/bookings" element={<UserBookings />} />
                        <Route path="/how-it-works" element={<HowItWorksPage />} />
                        <Route path="/tracking/:trackingSessionId?" element={<TrackingMap />} />
                        <Route path="/tracking/job/:jobId?" element={<TrackingMap />} />
                        <Route path="/chatbot" element={<ChatbotPage />} />
                        <Route path="/top-providers" element={<TopProviders />} />
                        <Route path="/profile-wizard" element={<ProviderProfileWizard />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/messages/:providerId" element={<MessagingPage />} />
                        <Route path="/profile" element={<ProfileSettings />} />
                        {/* 404 Not Found fallback */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </div>
                  </RequireAuth>
                }
              />
            </Routes>
          </Suspense>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
