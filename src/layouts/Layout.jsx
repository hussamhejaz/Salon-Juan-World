// src/layouts/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/client/Navbar";
import Footer from "../components/client/Footer";
import WhatsAppButton from "../components/ui/FloatingWhatsAppButton";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      {/* top nav */}
      <Navbar />

      {/* page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* footer */}
      <Footer />

      {/* floating WhatsApp */}
      <WhatsAppButton />
    </div>
  );
}
