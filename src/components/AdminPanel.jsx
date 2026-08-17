import React, { useState } from 'react';
import { 
  Link2, Plus, Trash2, CheckCircle, ShieldAlert, Code, Copy, 
  Layers, Sparkles, Sliders, Video, FileText, Key, Lock, MessageSquare, Bot, Save, ArrowLeft 
} from 'lucide-react';

export default function AdminPanel({ 
  catalog, setCatalog, settings, setSettings, faqs, setFaqs, manuals, setManuals, onExit 
}) {
  const [newUrl, setNewUrl] = useState('');
  const [newUrlBrand, setNewUrlBrand] = useState('');
  const [newUrlCategory, setNewUrlCategory] = useState('Alarmas');
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [activeTab, setActiveTab] = useState('sources');
  const [saveBanner, setSaveBanner] = useState(false);

  // Formulario nueva FAQ
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');
  const [newFaqVideo, setNewFaqVideo] = useState('');
  const [newFaqCategory, setNewFaqCategory] = useState('Soporte Técnico');

  // Formulario nuevo Manual
  const [newManualTitle, setNewManualTitle] = useState('');
  const [newManualBrand, setNewManualBrand] = useState('Garnet');
  const [newManualPdfUrl, setNewManualPdfUrl] = useState('');
  const [newManualIsPublic, setNewManualIsPublic] = useState(false);

  // Formulario nueva Clave Admin
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const triggerSaveNotification = () => {
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 2500);
  };

  // Ingesta por URL
  const handleIngestUrl = () => {
    if (!newUrl.trim()) return;
    const urlCleaned = newUrl.trim();

    let detectedBrand = newUrlBrand.trim();
    if (!detectedBrand) {
      const domainPart = urlCleaned.replace(/https?:\/\//i, '').split('/')[0].replace('www.', '');
      detectedBrand = domainPart.split('.')[0].toUpperCase();
    }

    if (!settings.customSources.includes(urlCleaned)) {
      setSettings((prev) => ({
        ...prev,
        customSources: [...prev.customSources, urlCleaned]
      }));
    }

    // Agregar item homologado al catálogo de productos
    const newItems = [
      {
        id: `url-ingested-${Date.now()}`,
        name: `Línea Oficial y Equipamiento ${detectedBrand}`,
        brand: detectedBrand,
        category: newUrlCategory,
        description: `Equipos oficiales y fichas técnicas indexadas desde la fuente de fábrica: ${urlCleaned}`,
        specs: [`Marca Homologada: ${detectedBrand}`, 'Fichas técnicas y manuales indexados', 'Asesoramiento técnico oficial'],
        sourceUrl: urlCleaned,
        stock: true
      }
    ];

    setCatalog((prev) => [...newItems, ...prev]);
    setNewUrl('');
    setNewUrlBrand('');
    triggerSaveNotification();
  };

  // Agregar FAQ
  const handleAddFaq = (e) => {
    e.preventDefault();
    if (!newFaqQ.trim() || !newFaqA.trim()) return;

    const newFaq = {
      id: `faq-${Date.now()}`,
      question: newFaqQ,
      answer: newFaqA,
      videoUrl: newFaqVideo,
      category: newFaqCategory
    };

    setFaqs((prev) => [...prev, newFaq]);
    setNewFaqQ('');
    setNewFaqA('');
    setNewFaqVideo('');
    triggerSaveNotification();
  };

  const handleDeleteFaq = (id) => {
    setFaqs((prev) => prev.filter(f => f.id !== id));
    triggerSaveNotification();
  };

  // Agregar Manual PDF
  const handleAddManual = (e) => {
    e.preventDefault();
    if (!newManualTitle.trim() || !newManualPdfUrl.trim()) return;

    const newMan = {
      id: `manual-${Date.now()}`,
      title: newManualTitle,
      brand: newManualBrand,
      pdfUrl: newManualPdfUrl,
      category: newManualIsPublic ? 'Manual Público Descargable' : 'Conocimiento Interno IA',
      isPublicDownloadable: newManualIsPublic
    };

    setManuals((prev) => [...prev, newMan]);
    setNewManualTitle('');
    setNewManualPdfUrl('');
    triggerSaveNotification();
  };

  const handleDeleteManual = (id) => {
    setManuals((prev) => prev.filter(m => m.id !== id));
    triggerSaveNotification();
  };

  // Cambiar Clave Admin
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!newPassword.trim()) return;

    setSettings((prev) => ({
      ...prev,
      adminPassword: newPassword
    }));

    setPasswordSuccess(true);
    setNewPassword('');
    triggerSaveNotification();
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  const removeSource = (urlToRemove) => {
    setSettings((prev) => ({
      ...prev,
      customSources: prev.customSources.filter(u => u !== urlToRemove)
    }));
    triggerSaveNotification();
  };

  return (
    <div className="admin-wrapper">
      {/* Botón de Guardado Explicito y Estado de Guardado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button 
          onClick={onExit}
          className="btn-secondary"
          style={{ padding: '0.5rem 1rem', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={16} />
          <span>Volver a la Página Principal</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={triggerSaveNotification}
            className="btn-primary"
            style={{ padding: '0.55rem 1.25rem', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Save size={16} />
            <span>Guardar Todos los Cambios</span>
          </button>
          
          {saveBanner && (
            <span style={{ color: '#10b981', fontSize: '0.82rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle size={15} /> ¡Guardado permanentemente!
            </span>
          )}
        </div>
      </div>

      <div className="admin-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '900', fontFamily: 'var(--font-display)' }}>
              Panel de Administración del Asistente IA
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Todas las URLs, preguntas frecuentes y reglas quedan guardadas de forma permanente.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setActiveTab('sources')}
              className={`admin-tab-btn ${activeTab === 'sources' ? 'active' : ''}`}
            >
              <Link2 size={14} />
              <span>URLs & Fábricas</span>
            </button>

            <button 
              onClick={() => setActiveTab('guardrails')}
              className={`admin-tab-btn ${activeTab === 'guardrails' ? 'active' : ''}`}
            >
              <Bot size={14} />
              <span>Instrucciones & Tono</span>
            </button>

            <button 
              onClick={() => setActiveTab('faqs')}
              className={`admin-tab-btn ${activeTab === 'faqs' ? 'active' : ''}`}
            >
              <Video size={14} />
              <span>FAQs & Videos</span>
            </button>

            <button 
              onClick={() => setActiveTab('manuals')}
              className={`admin-tab-btn ${activeTab === 'manuals' ? 'active' : ''}`}
            >
              <FileText size={14} />
              <span>Manuales PDF</span>
            </button>

            <button 
              onClick={() => setActiveTab('security')}
              className={`admin-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            >
              <Key size={14} />
              <span>Clave Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* PESTAÑA: FUENTES & URLS */}
      {activeTab === 'sources' && (
        <div className="admin-grid">
          <div className="admin-card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link2 size={18} color="var(--brand-crimson-vivid)" />
              <span>Indexar URL de Fábrica o Distribuidor</span>
            </h3>
            
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Pegá el link del catálogo de tu fábrica (ej: Garnet, Hikvision, Dahua). La IA absorberá las especificaciones y manuales.
            </p>

            <div className="form-group">
              <label>URL de Fábrica / Proveedor</label>
              <input 
                type="url" 
                className="form-control" 
                placeholder="https://www.garnet.com.ar/Productos"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Nombre de la Marca (Opcional)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ej: Garnet"
                  value={newUrlBrand}
                  onChange={(e) => setNewUrlBrand(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Categoría</label>
                <select 
                  className="form-control"
                  value={newUrlCategory}
                  onChange={(e) => setNewUrlCategory(e.target.value)}
                >
                  <option value="Alarmas">Alarmas</option>
                  <option value="CCTV">CCTV y Cámaras</option>
                  <option value="Sirenas">Sirenas</option>
                  <option value="Perimetral">Protección Perimetral</option>
                  <option value="Control de Acceso">Control de Acceso</option>
                </select>
              </div>
            </div>

            <button 
              className="btn-primary" 
              onClick={handleIngestUrl} 
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
            >
              <Plus size={16} />
              <span>Indexar y Guardar URL</span>
            </button>
          </div>

          <div className="admin-card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.85rem' }}>
              Bases y URLs Guardadas ({settings.customSources.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '350px', overflowY: 'auto' }}>
              {settings.customSources.map((url, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
                  <span style={{ color: '#fca5a5', wordBreak: 'break-all' }}>{url}</span>
                  <button onClick={() => removeSource(url)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }} title="Eliminar URL">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA: INSTRUCCIONES & TONO */}
      {activeTab === 'guardrails' && (
        <div className="admin-grid">
          <div className="admin-card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bot size={18} color="var(--brand-crimson-vivid)" />
              <span>Instrucciones de Comportamiento (System Prompt)</span>
            </h3>

            <div className="form-group">
              <label>Reglas de Comportamiento y Personalidad</label>
              <textarea 
                className="form-control" 
                rows="6"
                placeholder="Escribí aquí cómo querés que se comporte el asistente..."
                value={settings.systemPrompt || ''}
                onChange={(e) => {
                  setSettings({ ...settings, systemPrompt: e.target.value });
                  triggerSaveNotification();
                }}
              />
            </div>

            <div className="form-group">
              <label>WhatsApp Oficial para Derivación de Clientes</label>
              <input 
                type="text" 
                className="form-control" 
                value={settings.whatsappNumber}
                onChange={(e) => {
                  setSettings({ ...settings, whatsappNumber: e.target.value });
                  triggerSaveNotification();
                }}
              />
            </div>
          </div>

          <div className="admin-card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={18} color="#f59e0b" />
              <span>Reglas de Contención Comercial</span>
            </h3>

            <div className="form-group">
              <label>Mensaje para Solicitudes de Presupuesto</label>
              <textarea 
                className="form-control" 
                rows="4"
                value={settings.handoffMessage}
                onChange={(e) => {
                  setSettings({ ...settings, handoffMessage: e.target.value });
                  triggerSaveNotification();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA: FAQS */}
      {activeTab === 'faqs' && (
        <div className="admin-grid">
          <div className="admin-card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Video size={18} color="var(--brand-crimson-vivid)" />
              <span>Agregar FAQ de Soporte con Video</span>
            </h3>

            <form onSubmit={handleAddFaq}>
              <div className="form-group">
                <label>Pregunta Frecuente del Cliente</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ej: ¿Cómo apagar el teclado cuando pita?"
                  required
                  value={newFaqQ}
                  onChange={(e) => setNewFaqQ(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Respuesta Paso a Paso</label>
                <textarea 
                  className="form-control" 
                  rows="3"
                  placeholder="Instrucciones claras para resolver el problema..."
                  required
                  value={newFaqA}
                  onChange={(e) => setNewFaqA(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Link de Video en YouTube (Opcional)</label>
                <input 
                  type="url" 
                  className="form-control" 
                  placeholder="https://www.youtube.com/watch?v=tu-video"
                  value={newFaqVideo}
                  onChange={(e) => setNewFaqVideo(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <Plus size={16} />
                <span>Guardar FAQ</span>
              </button>
            </form>
          </div>

          <div className="admin-card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.85rem' }}>
              FAQs Registradas ({faqs.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto' }}>
              {faqs.map(faq => (
                <div key={faq.id} style={{ background: 'var(--bg-primary)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <strong style={{ fontSize: '0.88rem', color: '#ffffff' }}>{faq.question}</strong>
                    <button onClick={() => handleDeleteFaq(faq.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA: MANUALES */}
      {activeTab === 'manuals' && (
        <div className="admin-grid">
          <div className="admin-card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} color="var(--brand-crimson-vivid)" />
              <span>Cargar Manual PDF</span>
            </h3>

            <form onSubmit={handleAddManual}>
              <div className="form-group">
                <label>Título del Manual</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ej: Guía de Usuario Teclado LCD Garnet"
                  required
                  value={newManualTitle}
                  onChange={(e) => setNewManualTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Marca / Fábrica</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Garnet, Hikvision, Dahua"
                  value={newManualBrand}
                  onChange={(e) => setNewManualBrand(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>URL del Archivo PDF</label>
                <input 
                  type="url" 
                  className="form-control" 
                  placeholder="https://www.garnet.com.ar/Manuales/archivo.pdf"
                  required
                  value={newManualPdfUrl}
                  onChange={(e) => setNewManualPdfUrl(e.target.value)}
                />
              </div>

              <div className="toggle-switch" style={{ margin: '1rem 0' }}>
                <div>
                  <strong style={{ fontSize: '0.85rem' }}>Permitir descarga pública en el chat</strong>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Desactivado: La IA lo usa solo de forma interna</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={newManualIsPublic}
                  onChange={(e) => setNewManualIsPublic(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <Plus size={16} />
                <span>Guardar Manual</span>
              </button>
            </form>
          </div>

          <div className="admin-card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.85rem' }}>
              Manuales Registrados ({manuals.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {manuals.map(man => (
                <div key={man.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div>
                    <strong style={{ fontSize: '0.84rem', display: 'block' }}>{man.title}</strong>
                    <span style={{ fontSize: '0.7rem', color: man.isPublicDownloadable ? '#10b981' : '#f87171' }}>
                      {man.isPublicDownloadable ? '✓ Descargable por clientes' : '🔒 Uso interno IA'}
                    </span>
                  </div>
                  <button onClick={() => handleDeleteManual(man.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA: CLAVE ADMIN */}
      {activeTab === 'security' && (
        <div className="admin-card" style={{ maxWidth: '480px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={18} color="var(--brand-crimson-vivid)" />
            <span>Modificar Clave de Administrador</span>
          </h3>

          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>Nueva Clave</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="Ingresá la nueva clave..."
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            {passwordSuccess && (
              <div style={{ color: '#10b981', fontSize: '0.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle size={14} />
                <span>¡Clave de administrador guardada permanentemente!</span>
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Save size={16} />
              <span>Guardar Nueva Clave</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
