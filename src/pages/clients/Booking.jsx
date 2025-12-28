import React from "react";
import BookingForm from "../../components/client/BookingForm";

export default function BookingPage({ salonId }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 py-8">
      <BookingForm salonId={salonId} />
    </div>
  );
}
