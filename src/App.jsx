import React, { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import CatalogSection from './components/CatalogSection';
import AdminPanel from './components/AdminPanel';
import ChatWidget from './components/ChatWidget';
import LeadModal from './components/LeadModal';
import AdminAuthModal from './components/AdminAuthModal';
import Footer from './components/Footer';
import { INITIAL_CATALOG, INITIAL_SETTINGS, INITIAL_FAQS, INITIAL_MANUALS } from './data/defaultCatalog';

export default function App() {
  const [viewMode, setViewMode] = useState('client'); // 'client' | 'admin'
  const [catalog, setCatalog] = useState(INITIAL_CATALOG);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [faqs, setFaqs] = useState(INITIAL_FAQS);
  const [manuals, setManuals] = useState(INITIAL_MANUALS);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);

  const handleAskProduct = (productName) => {
    setIsChatOpen(true);
  };

  const handleAdminAuthenticated = () => {
    setIsAdminAuthOpen(false);
    setViewMode('admin');
  };

  return (
    <div className="app-root" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header 
        settings={settings}
        catalogCount={catalog.length}
      />

      <main className="main-container" style={{ flex: 1 }}>
        {viewMode === 'client' ? (
          <>
            <HeroSection 
              onOpenChat={() => setIsChatOpen(true)}
              settings={settings}
            />
            <AboutSection 
              settings={settings}
            />
            <ServicesSection />
            <CatalogSection 
              catalog={catalog}
              onAskProduct={handleAskProduct}
            />
          </>
        ) : (
          <AdminPanel 
            catalog={catalog}
            setCatalog={setCatalog}
            settings={settings}
            setSettings={setSettings}
            faqs={faqs}
            setFaqs={setFaqs}
            manuals={manuals}
            setManuals={setManuals}
          />
        )}
      </main>

      {/* Footer corporativo con acceso protegido */}
      <Footer 
        onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
        settings={settings}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Floating Chat Engine Widget con soporte de FAQs, Videos y Manuales */}
      <ChatWidget 
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
        catalog={catalog}
        settings={settings}
        faqs={faqs}
        manuals={manuals}
        onTriggerHandoff={() => setIsLeadModalOpen(true)}
      />

      {/* Lead Handoff Modal */}
      <LeadModal 
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        settings={settings}
      />

      {/* Modal de Autenticación de Administrador con clave editable */}
      <AdminAuthModal 
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onAuthenticated={handleAdminAuthenticated}
        adminPassword={settings.adminPassword}
      />
    </div>
  );
}
