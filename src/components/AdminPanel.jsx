import React, { useState } from 'react';
import { Link2, Plus, Trash2, CheckCircle, ShieldAlert, Code, Copy, Layers, Sparkles, Sliders, Video, FileText, Key, Lock, MessageSquare, Bot } from 'lucide-react';

export default function AdminPanel({ catalog, setCatalog, settings, setSettings, faqs, setFaqs, manuals, setManuals }) {
  const [newUrl, setNewUrl] = useState('');
  const [rawTextCatalog, setRawTextCatalog] = useState('');
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [activeTab, setActiveTab] = useState('sources');

  // Formulario nueva FAQ
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');
  const [newFaqVideo, setNewFaqVideo] = useState('');
  const [newFaqCategory, setNewFaqCategory] = useState('Soporte Técnico');

  // Formulario nuevo Manual
  const [newManualTitle, setNewManualTitle] = useState('');
  const [newManualBrand, setNewManualBrand] = useState('Garnet');
  const [newManualPdfUrl, setNewManualPdfUrl] = useState('');
  const [newManualIsPublic, setNewManualIsPublic] = useState(false); // Por defecto falso para seguridad

  // Formulario nueva Clave Admin
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Ingesta por URL
  const handleIngestUrl = () => {
    if (!newUrl.trim()) return;
    const urlCleaned = newUrl.trim();

    const domainPart = urlCleaned.replace(/https?:\/\//i, '').split('/')[0].replace('www.', '');
    const brandName = domainPart.split('.')[0].toUpperCase();

    if (!settings.customSources.includes(urlCleaned)) {
      setSettings((prev) => ({
        ...prev,
        customSources: [...prev.customSources, urlCleaned]
      }));
    }

    const newItems = [
      {
        id: `ingested-${Date.now()}-1`,
        name: `Línea Oficial e Información de ${brandName}`,
        brand: brandName,
        category: 'Catálogo de Fábrica',
        description: `Línea de productos e información indexada oficialmente desde la URL de fábrica: ${urlCleaned}`,
        specs: [`Marca Homologada: ${brandName}`, 'Verificación en tiempo real'],
        sourceUrl: urlCleaned,
        stock: true
      }
    ];

    setCatalog((prev) => [...newItems, ...prev]);
    setNewUrl('');
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
  };

  const handleDeleteFaq = (id) => {
    setFaqs((prev) => prev.filter(f => f.id !== id));
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
  };

  const handleDeleteManual = (id) => {
    setManuals((prev) => prev.filter(m => m.id !== id));
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
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  const removeSource = (urlToRemove) => {
    setSettings((prev) => ({
      ...prev,
      customSources: prev.customSources.filter(u => u !== urlToRemove)
    }));
  };

  const embedCodeSnippet = `<!-- Widget Asistente de IA para ${settings.businessName} -->
<script 
  src="https://cdn.alarmaschascomus.ai/widget.js" 
  data-business-name="${settings.businessName}"
  data-whatsapp="${settings.whatsappNumber}"
  data-strict-mode="${settings.strictMode}"
  async>
</script>`;

  const copyEmbedSnippet = () => {
    navigator.clipboard.writeText(embedCodeSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2500);
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', fontFamily: 'var(--font-serif)' }}>
              Panel de Administración del Asistente IA
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Gestión de comportamientos, URLs, FAQs con video, manuales y seguridad.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setActiveTab('sources')}
              style={{
                background: activeTab === 'sources' ? 'var(--brand-crimson)' : 'var(--bg-card)',
                color: 'white',
                border: '1px solid var(--border-color)',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Link2 size={14} />
              <span>URLs & Fábricas</span>
            </button>

            <button 
              onClick={() => setActiveTab('guardrails')}
              style={{
                background: activeTab === 'guardrails' ? 'var(--brand-crimson)' : 'var(--bg-card)',
                color: 'white',
                border: '1px solid var(--border-color)',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Bot size={14} />
              <span>Instrucciones & Tono</span>
            </button>

            <button 
              onClick={() => setActiveTab('faqs')}
              style={{
                background: activeTab === 'faqs' ? 'var(--brand-crimson)' : 'var(--bg-card)',
                color: 'white',
                border: '1px solid var(--border-color)',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Video size={14} />
              <span>FAQs & Videos</span>
            </button>

            <button 
              onClick={() => setActiveTab('manuals')}
              style={{
                background: activeTab === 'manuals' ? 'var(--brand-crimson)' : 'var(--bg-card)',
                color: 'white',
                border: '1px solid var(--border-color)',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <FileText size={14} />
              <span>Manuales PDF</span>
            </button>

            <button 
              onClick={() => setActiveTab('security')}
              style={{
                background: activeTab === 'security' ? 'var(--brand-crimson)' : 'var(--bg-card)',
                color: 'white',
                border: '1px solid var(--border-color)',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Key size={14} />
              <span>Clave Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* PESTAÑA: INSTRUCCIONES DE COMPORTAMIENTO & TONO DE LA IA */}
      {activeTab === 'guardrails' && (
        <div className="admin-grid">
          <div className="admin-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-serif)' }}>
              <Bot size={18} color="var(--brand-crimson)" />
              <span>Instrucciones de Comportamiento del Asistente (System Prompt)</span>
            </h3>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Escribí las reglas de personalidad y comportamiento que la IA debe seguir en todo momento al hablar con clientes.
            </p>

            <div className="form-group">
              <label>Instrucciones Personalizadas (Prompt del Sistema)</label>
              <textarea 
                className="form-control" 
                rows="6"
                placeholder="Ejemplo: Sos el asistente oficial de Alarmas Chascomús. Sé muy amable y profesional. Responde dudas sobre sirenas y paneles Garnet sin tirar listas internas. Invita siempre a agendar un presupuesto por WhatsApp..."
                value={settings.systemPrompt || ''}
                onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Estilo / Tono Predeterminado</label>
              <select 
                className="form-control"
                value={settings.tone || 'consultive'}
                onChange={(e) => setSettings({ ...settings, tone: e.target.value })}
              >
                <option value="consultive">Técnico Consultivo (Asesor Experto en Seguridad)</option>
                <option value="commercial">Comercial Vendedor (Enfocado en Conversión y Leads)</option>
                <option value="formal">Formal Corporativo (Ejecutivo Estricto)</option>
              </select>
            </div>
          </div>

          <div className="admin-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-serif)' }}>
              <ShieldAlert size={18} color="var(--accent-amber)" />
              <span>Reglas de Contención (Guardrails)</span>
            </h3>

            <div className="toggle-switch">
              <div>
                <strong style={{ fontSize: '0.9rem' }}>Modo Estricto de Catálogo (Grounded)</strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Prohibir respuestas sobre marcas o productos no cargados en tu base</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.strictMode}
                onChange={(e) => setSettings({ ...settings, strictMode: e.target.checked })}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>

            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <label>Mensaje de Derivación para Presupuestos</label>
              <textarea 
                className="form-control" 
                rows="3"
                value={settings.handoffMessage}
                onChange={(e) => setSettings({ ...settings, handoffMessage: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA: MANUALES PDF */}
      {activeTab === 'manuals' && (
        <div className="admin-grid">
          <div className="admin-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-serif)' }}>
              <FileText size={18} color="var(--brand-crimson)" />
              <span>Cargar Manual PDF (Configurar Visibilidad)</span>
            </h3>

            <form onSubmit={handleAddManual}>
              <div className="form-group">
                <label>Título del Manual / Instructivo</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ej: Guía Rápida de Usuario Alarma Garnet (PDF)"
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
                  placeholder="Ej: Garnet, Hikvision, Dahua"
                  value={newManualBrand}
                  onChange={(e) => setNewManualBrand(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>URL Directa del Archivo PDF</label>
                <input 
                  type="url" 
                  className="form-control" 
                  placeholder="https://www.garnet.com.ar/Manuales/Guia_Usuario.pdf"
                  required
                  value={newManualPdfUrl}
                  onChange={(e) => setNewManualPdfUrl(e.target.value)}
                />
              </div>

              <div className="toggle-switch" style={{ margin: '1rem 0' }}>
                <div>
                  <strong style={{ fontSize: '0.88rem' }}>Permitir descarga pública a clientes en el chat</strong>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Si está desactivado, la IA usará el manual SOLO para aprender de forma interna</p>
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
                <span>Agregar Manual PDF</span>
              </button>
            </form>
          </div>

          <div className="admin-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>
              Manuales Registrados ({manuals.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {manuals.map(man => (
                <div key={man.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div>
                    <strong style={{ fontSize: '0.88rem', display: 'block' }}>{man.title}</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                      <span style={{ fontSize: '0.72rem', background: man.isPublicDownloadable ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: man.isPublicDownloadable ? '#10b981' : '#f87171', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: '600' }}>
                        {man.isPublicDownloadable ? '✓ Descargable por Clientes' : '🔒 Uso Interno IA (Oculto)'}
                      </span>
                    </div>
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

      {/* PESTAÑA: FUENTES & URLS */}
      {activeTab === 'sources' && (
        <div className="admin-grid">
          <div className="admin-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-serif)' }}>
              <Link2 size={18} color="var(--brand-crimson)" />
              <span>Cargar Sitio Web o Catálogo de Fábrica (URL)</span>
            </h3>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Ingresá la URL de tu fábrica o distribuidor para indexar marcas y especificaciones.
            </p>

            <div className="form-group">
              <label>URL de Fábrica / Proveedor</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="url" 
                  className="form-control" 
                  placeholder="https://www.garnet.com.ar/Productos"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                />
                <button className="btn-primary" onClick={handleIngestUrl} style={{ padding: '0.75rem 1.25rem' }}>
                  <Plus size={18} />
                  <span>Indexar URL</span>
                </button>
              </div>
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', margin: '1.5rem 0 0.75rem 0' }}>Bases de Fábrica / URLs Indexadas:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {settings.customSources.map((url, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.82rem' }}>
                  <span style={{ color: '#f87171', fontFamily: 'monospace' }}>{url}</span>
                  <button onClick={() => removeSource(url)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA: FAQS */}
      {activeTab === 'faqs' && (
        <div className="admin-grid">
          <div className="admin-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-serif)' }}>
              <Video size={18} color="var(--brand-crimson)" />
              <span>Agregar Respuesta Frecuente con Video</span>
            </h3>

            <form onSubmit={handleAddFaq}>
              <div className="form-group">
                <label>Pregunta Frecuente habitual del cliente</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ej: ¿Por qué mi teclado de alarma pita?"
                  required
                  value={newFaqQ}
                  onChange={(e) => setNewFaqQ(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Respuesta paso a paso dada por la IA</label>
                <textarea 
                  className="form-control" 
                  rows="3"
                  placeholder="Ej: Presioná [*][2] en el teclado para ver la falla..."
                  required
                  value={newFaqA}
                  onChange={(e) => setNewFaqA(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Link de Video (YouTube u otra plataforma, Opcional)</label>
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
                <span>Guardar FAQ con Video</span>
              </button>
            </form>
          </div>

          <div className="admin-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>
              FAQs Configuradas ({faqs.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto' }}>
              {faqs.map(faq => (
                <div key={faq.id} style={{ background: 'var(--bg-primary)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <strong style={{ fontSize: '0.9rem', color: '#ffffff' }}>{faq.question}</strong>
                    <button onClick={() => handleDeleteFaq(faq.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA: CLAVE ADMIN */}
      {activeTab === 'security' && (
        <div className="admin-card" style={{ maxWidth: '500px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-serif)' }}>
            <Key size={18} color="var(--brand-crimson)" />
            <span>Modificar Clave de Administrador</span>
          </h3>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Cambiá la contraseña requerida para ingresar a este panel desde el pie de página.
          </p>

          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>Nueva Clave de Administrador</label>
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
              <div style={{ color: 'var(--accent-emerald)', fontSize: '0.82rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle size={14} />
                <span>¡Clave de administrador actualizada correctamente!</span>
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <CheckCircle size={16} />
              <span>Guardar Nueva Clave</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
