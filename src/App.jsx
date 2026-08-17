import React, { useState, useEffect } from 'react';
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
  const [viewMode, setViewMode] = useState('home'); // 'home' | 'products' | 'admin'

  // Persistencia Automática en LocalStorage del Navegador
  const [catalog, setCatalog] = useState(() => {
    try {
      const saved = localStorage.getItem('achas_catalog');
      return saved ? JSON.parse(saved) : INITIAL_CATALOG;
    } catch {
      return INITIAL_CATALOG;
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('achas_settings');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [faqs, setFaqs] = useState(() => {
    try {
      const saved = localStorage.getItem('achas_faqs');
      return saved ? JSON.parse(saved) : INITIAL_FAQS;
    } catch {
      return INITIAL_FAQS;
    }
  });

  const [manuals, setManuals] = useState(() => {
    try {
      const saved = localStorage.getItem('achas_manuals');
      return saved ? JSON.parse(saved) : INITIAL_MANUALS;
    } catch {
      return INITIAL_MANUALS;
    }
  });

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);

  // Guardar automáticamente en LocalStorage cada vez que cambien los datos
  useEffect(() => {
    try {
      localStorage.setItem('achas_catalog', JSON.stringify(catalog));
    } catch (e) {
      console.error("Error guardando catálogo", e);
    }
  }, [catalog]);

  useEffect(() => {
    try {
      localStorage.setItem('achas_settings', JSON.stringify(settings));
    } catch (e) {
      console.error("Error guardando ajustes", e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('achas_faqs', JSON.stringify(faqs));
    } catch (e) {
      console.error("Error guardando faqs", e);
    }
  }, [faqs]);

  useEffect(() => {
    try {
      localStorage.setItem('achas_manuals', JSON.stringify(manuals));
    } catch (e) {
      console.error("Error guardando manuales", e);
    }
  }, [manuals]);

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
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <main className="main-container" style={{ flex: 1 }}>
        {viewMode === 'home' && (
          <>
            <HeroSection 
              onOpenChat={() => setIsChatOpen(true)}
              settings={settings}
              onNavigateProducts={() => setViewMode('products')}
            />
            <AboutSection settings={settings} />
            <ServicesSection />
          </>
        )}

        {viewMode === 'products' && (
          <CatalogSection 
            catalog={catalog}
            onAskProduct={handleAskProduct}
            onBackHome={() => setViewMode('home')}
          />
        )}

        {viewMode === 'admin' && (
          <AdminPanel 
            catalog={catalog}
            setCatalog={setCatalog}
            settings={settings}
            setSettings={setSettings}
            faqs={faqs}
            setFaqs={setFaqs}
            manuals={manuals}
            setManuals={setManuals}
            onExit={() => setViewMode('home')}
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

      {/* Floating Chat Engine Widget */}
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

      {/* Modal de Autenticación de Administrador */}
      <AdminAuthModal 
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onAuthenticated={handleAdminAuthenticated}
        adminPassword={settings.adminPassword}
      />
    </div>
  );
}
