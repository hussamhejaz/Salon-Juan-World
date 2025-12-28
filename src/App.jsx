import { Routes, Route } from "react-router-dom";

import Layout from "./layouts/Layout";
import MainSection from "./components/client/MainSection";

import BookingPage from "./pages/clients/Booking";
import PricesPage from "./pages/clients/Prices";
import ComplaintsPage from "./pages/clients/Complaints";
import OffersPage from "./pages/clients/Offers";
import HomeServicesPage from "./pages/clients/HomeServices";
import HomeServicesBookingPage from "./pages/clients/HomeServicesBookingPage";
import WorkingHoursPage from "./pages/clients/WorkingHours";
import SectionsPage from "./pages/clients/SectionsPage";
import ServiceDetailsPage from "./pages/clients/ServiceDetailsPage";
import AboutUsPage from "./pages/clients/AboutUsPage";
import ContactPage from "./pages/clients/ContactPage";

export default function App() {
  // Define your salon IDs here
  const defaultSalonId = "0f9b1b01-4b3a-4853-bd8f-6037013a47d0";
  
  return (
    <Routes>
      {/* ===== PUBLIC SITE ===== */}
      <Route element={<Layout />}>
        <Route path="/" element={<MainSection />} />
        <Route path="booking" element={<BookingPage salonId={defaultSalonId} />} />
        {/* Pass salonId as prop */}
        <Route path="prices" element={<PricesPage salonId={defaultSalonId} />} />
        <Route path="offers" element={<OffersPage salonId={defaultSalonId} />} />
        <Route path="home-services" element={<HomeServicesPage salonId={defaultSalonId} />} />
        <Route
          path="home-services/booking"
          element={<HomeServicesBookingPage salonId={defaultSalonId} />}
        />
        <Route path="hours" element={<WorkingHoursPage salonId={defaultSalonId} />} />
        <Route path="reviews" element={<ComplaintsPage salonId={defaultSalonId} />} />
        <Route path="sections" element={<SectionsPage salonId={defaultSalonId} />} />
        <Route path="sections/:sectionId" element={<ServiceDetailsPage salonId={defaultSalonId} />} />
        <Route path="about" element={<AboutUsPage salonId={defaultSalonId} />} />
        <Route path="contact" element={<ContactPage />} />
        
        {/* Callback route for OAuth, payment confirmations, etc. */}
        <Route path="callback" element={<MainSection />} />
        
        {/* Default route for any undefined paths - redirect to home */}
        <Route path="*" element={<MainSection />} />
      </Route>
    </Routes>
  );
}
