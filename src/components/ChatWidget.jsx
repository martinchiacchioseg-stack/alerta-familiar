import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Shield, Sparkles, ExternalLink, Video } from 'lucide-react';
import { generateAIResponse } from '../services/aiEngine';

export default function ChatWidget({ isOpen, setIsOpen, catalog, settings, faqs, manuals, onTriggerHandoff }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `¡Hola! Soy el asistente virtual especializado en Seguridad Electrónica de **${settings.businessName}**.\n\nPuedo responderte consultas sobre equipos de fábrica (Garnet, Hikvision, Dahua), manuales PDF, problemas frecuentes o cotización de instalaciones. ¿En qué puedo ayudarte?`,
      source: `Catálogo Oficial & Sistema Grounded`,
      suggestedActions: [
        { label: "🚨 ¿Tienen sirenas Garnet?", query: "¿Tienen sirenas Garnet?" },
        { label: "📹 Cámaras IP 4K ColorVu", query: "¿Qué cámaras de seguridad ofrecen?" },
        { label: "❓ ¿Por qué mi alarma pita?", query: "¿Por qué mi teclado de alarma hace un sonido/beep?" },
        { label: "📄 Manuales de Alarma PDF", query: "Necesito el manual de la alarma Garnet" }
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
    <div className="chat-drawer">
      {!isOpen && (
        <button className="chat-toggle-fab" onClick={() => setIsOpen(true)} title="Abrir Asistente IA">
          <MessageSquare size={24} />
        </button>
      )}

      {isOpen && (
        <div className="chat-window">
          {/* Header del Chat */}
          <div className="chat-window-header">
            <div className="chat-avatar-info">
              <div className="chat-avatar-icon">
                <Bot size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'white', lineHeight: '1.2', fontFamily: 'var(--font-serif)' }}>
                  Asistente {settings.businessName}
                </h4>
                <div style={{ fontSize: '0.68rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span className="badge-pulse-dot" style={{ width: '5px', height: '5px' }}></span>
                  <span>Catálogo & FAQs con Video</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
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
                      <Shield size={10} />
                      <span>{msg.source}</span>
                    </div>
                  )}
                </div>

                {/* Acciones sugeridas y botones de video */}
                {msg.sender === 'bot' && msg.suggestedActions && (
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.4rem', maxWidth: '88%' }}>
                    {msg.suggestedActions.map((act, i) => (
                      <button
                        key={i}
                        className="prompt-pill-btn"
                        onClick={() => handlePillClick(act)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        {act.url && <Video size={12} color="#dc143c" />}
                        <span>{act.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="message-bubble message-bot" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={14} className="animate-spin" color="var(--brand-crimson)" />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Buscando en catálogo y manuales oficiales...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Área de Entrada */}
          <div className="chat-input-area">
            <input
              type="text"
              placeholder="Escribí tu consulta sobre sirenas, alarmas o problemas..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="chat-send-btn" onClick={() => handleSend()}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
