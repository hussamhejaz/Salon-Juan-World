// src/pages/public/HomeServicesBookingPage.jsx
import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import HomeServiceBookingForm from "../../components/client/HomeServiceBookingForm";

export default function HomeServicesBookingPage({ salonId: propSalonId }) {
  const params = useParams();
  const [searchParams] = useSearchParams();

  const salonId = propSalonId || params.salonId;
  const serviceId = searchParams.get("serviceId") || null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-br from-gray-50 to-white">
      <HomeServiceBookingForm salonId={salonId} linkedServiceId={serviceId} />
    </div>
  );
}
