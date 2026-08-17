import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Shield, Sparkles, ExternalLink, Video } from 'lucide-react';
import { generateAIResponse } from '../services/aiEngine';

export default function ChatWidget({ isOpen, setIsOpen, catalog, settings, faqs, manuals, onTriggerHandoff }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `¡Hola! Soy el asistente virtual de **${settings.businessName}**.\n\nPuedo responderte consultas sobre equipos de seguridad (Garnet, Hikvision, Dahua), manuales de usuario, resolución de fallas o coordinar una visita técnica. ¿En qué te puedo ayudar?`,
      source: `Asesor Técnico Oficial`,
      suggestedActions: [
        { label: "🚨 Sirena Garnet MP-1000", query: "¿Cuáles son las características de la sirena MP-1000?" },
        { label: "📱 Paneles de Alarma Garnet", query: "¿Qué paneles de alarma Garnet tienen?" },
        { label: "📹 Cámaras IP 4K ColorVu", query: "¿Qué cámaras de seguridad ofrecen?" },
        { label: "❓ ¿Por qué mi teclado pita?", query: "¿Por qué mi teclado de alarma hace un sonido/beep?" }
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (customQuery = null) => {
    const textToSend = customQuery || inputText;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customQuery) setInputText('');
    setIsLoading(true);

    try {
      const response = await generateAIResponse({
        query: textToSend,
        catalog,
        settings,
        faqs,
        manuals,
        chatHistory: messages
      });

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.text,
        source: response.source,
        suggestedActions: response.suggestedActions
      };

      setMessages((prev) => [...prev, botMsg]);

      if (response.isHandoffTriggered) {
        onTriggerHandoff();
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Ocurrió un error al procesar tu consulta. Por favor intenta nuevamente.',
          source: 'Error'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePillClick = (action) => {
    if (action.url) {
      window.open(action.url, '_blank');
      return;
    }

    if (action.action === 'open_whatsapp' || action.action === 'open_form') {
      onTriggerHandoff();
      return;
    }

    if (action.query) {
      handleSend(action.query);
    } else if (action.label) {
      handleSend(action.label);
    }
  };

  return (
    <>
      {/* Botón flotante FAB en la esquina */}
      {!isOpen && (
        <div className="chat-drawer">
          <button className="chat-toggle-fab" onClick={() => setIsOpen(true)} title="Consultar al Asistente IA">
            <MessageSquare size={24} />
          </button>
        </div>
      )}

      {/* Modal Push-Up Centrado en Pantalla con Fondo Oscuro (Backdrop) */}
      {isOpen && (
        <div className="chat-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="chat-window-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header del Chat */}
            <div className="chat-window-header">
              <div className="chat-avatar-info">
                <div className="chat-avatar-icon">
                  <Bot size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'white', lineHeight: '1.2', fontFamily: 'var(--font-display)' }}>
                    Asistente {settings.businessName}
                  </h4>
                  <div style={{ fontSize: '0.68rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '700' }}>
                    <span className="badge-pulse-dot" style={{ width: '6px', height: '6px' }}></span>
                    <span>En Línea · Seguridad Electrónica</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#ffffff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                title="Cerrar chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Cuerpo de Mensajes */}
            <div className="chat-body">
              {messages.map((msg) => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div className={`message-bubble ${msg.sender === 'user' ? 'message-user' : 'message-bot'}`}>
                    {msg.text}
                    {msg.source && (
                      <div className="source-badge">
                        <Shield size={11} />
                        <span>{msg.source}</span>
                      </div>
                    )}
                  </div>

                  {/* Acciones sugeridas y botones de video */}
                  {msg.sender === 'bot' && msg.suggestedActions && (
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.45rem', maxWidth: '90%' }}>
                      {msg.suggestedActions.map((act, i) => (
                        <button
                          key={i}
                          className="prompt-pill-btn"
                          onClick={() => handlePillClick(act)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          {act.url && <Video size={12} color="#ef4444" />}
                          <span>{act.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="message-bubble message-bot" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={15} className="animate-spin" color="var(--brand-crimson-vivid)" />
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Consultando ficha técnica oficial...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Área de Entrada */}
            <div className="chat-input-area">
              <input
                type="text"
                placeholder="Escribí tu consulta sobre sirenas, alarmas..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                autoFocus
              />
              <button className="chat-send-btn" onClick={() => handleSend()}>
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
