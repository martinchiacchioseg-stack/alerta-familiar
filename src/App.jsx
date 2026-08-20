import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TrustLogos from './components/TrustLogos';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import SmartMonitoringSpotlight from './components/SmartMonitoringSpotlight';
import GallerySection from './components/GallerySection';
import SecurityEstimator from './components/SecurityEstimator';
import SocialProofSection from './components/SocialProofSection';
import FaqSection from './components/FaqSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';

export default function App() {
  return (
    <div className="min-h-screen bg-[#060911] text-gray-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Modern Glass Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Section with High Impact */}
        <HeroSection />

        {/* Corporate Trust Validation (Santander, Macro, Andreani, Correo Argentino) */}
        <TrustLogos />

        {/* 20 Years History & 4 Pillars */}
        <AboutSection />

        {/* 5 Comprehensive Security Services */}
        <ServicesSection />

        {/* Spotlight on 2026 Smart Monitoring 24/7 */}
        <SmartMonitoringSpotlight />

        {/* High-Res Gallery Showcase with Stats */}
        <GallerySection />

        {/* Interactive Instant Security Estimator */}
        <SecurityEstimator />

        {/* 4.9 Stars Google Verified Reviews */}
        <SocialProofSection />

        {/* FAQ Accordion */}
        <FaqSection />

        {/* Contact Cards & Form */}
        <ContactSection />
      </main>

      {/* Corporate Footer */}
      <Footer />

      {/* Persistent Floating WhatsApp Action */}
      <WhatsAppWidget />
    </div>
  );
}
