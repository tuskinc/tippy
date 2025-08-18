
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import IndexPage from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Services from '@/pages/Services';
import ServiceDetail from '@/pages/ServiceDetail';
import Providers from '@/pages/Providers';
import ProfessionalsListing from '@/pages/ProfessionalsListing';
import ProfessionalDetail from '@/pages/ProfessionalDetail';
import UserBookings from '@/pages/UserBookings';
import HowItWorksPage from '@/pages/HowItWorksPage';
import TrackingMap from '@/pages/TrackingMap';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import { AuthProvider } from '@/components/AuthProvider';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/provider" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
