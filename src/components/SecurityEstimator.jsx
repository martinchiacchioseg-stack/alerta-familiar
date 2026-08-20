import React, { useState } from 'react';
import { Home, Store, Factory, TreePine, Shield, Video, Radio, Zap, KeyRound, MessageCircle, Sparkles } from 'lucide-react';

export default function SecurityEstimator() {
  const propertyTypes = [
    { id: 'hogar', label: 'Hogar / Casa', icon: Home, desc: 'Casa familiar o departamento' },
    { id: 'comercio', label: 'Local Comercial', icon: Store, desc: 'Tienda, oficina o negocio a la calle' },
    { id: 'empresa', label: 'Empresa / Galpón', icon: Factory, desc: 'Depósito, nave industrial o predio' },
    { id: 'campo', label: 'Campo / Quinta', icon: TreePine, desc: 'Zona rural, chacra o casa quinta' }
  ];

  const systemsList = [
    { id: 'alarmas', label: 'Sistema de Alarma Inteligente', icon: Shield },
    { id: 'cctv', label: 'Cámaras de Seguridad CCTV (Acceso Celular)', icon: Video },
    { id: 'monitoreo', label: 'Monitoreo Central 24/7', icon: Radio },
    { id: 'perimetral', label: 'Cerco Eléctrico / Sensores Exteriores', icon: Zap },
    { id: 'acceso', label: 'Control de Acceso / Biometría', icon: KeyRound }
  ];

  const [selectedProperty, setSelectedProperty] = useState('hogar');
  const [selectedSystems, setSelectedSystems] = useState(['alarmas', 'cctv']);

  const toggleSystem = (id) => {
    if (selectedSystems.includes(id)) {
      if (selectedSystems.length > 1) {
        setSelectedSystems(selectedSystems.filter(s => s !== id));
      }
    } else {
      setSelectedSystems([...selectedSystems, id]);
    }
  };

  const getPropertyLabel = () => propertyTypes.find(p => p.id === selectedProperty)?.label || selectedProperty;

  const getSystemsSummary = () => {
    return systemsList
      .filter(s => selectedSystems.includes(s.id))
      .map(s => s.label)
      .join(', ');
  };

  const generateWhatsAppLink = () => {
    const text = `Hola Alarmas Chascomús! Estuve usando el Cotizador de la web. Quisiera recibir asesoramiento y presupuesto personalizado para:
- Inmueble: ${getPropertyLabel()}
- Sistemas de interés: ${getSystemsSummary()}
- Ubicación: Chascomús o alrededores`;

    return `https://wa.me/5492241527180?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="cotizador" className="py-20 md:py-28 bg-[#0a0e17] relative overflow-hidden border-t border-white/10">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#DC143C]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DC143C]/10 border border-[#DC143C]/30 text-xs sm:text-sm font-bold text-[#EF4444]">
            <Sparkles size={15} />
            <span>Cotizador Express Online</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-['Montserrat']">
            Armá tu Plan de Seguridad
          </h2>

          <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
            Elegí el tipo de propiedad y los sistemas que necesitás para recibir una propuesta personalizada al instante por WhatsApp.
          </p>
        </div>

        {/* Interactive Box */}
        <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-[#111827] to-[#060911] border border-white/10 shadow-2xl space-y-10">
          
          {/* Step 1: Property Type */}
          <div className="space-y-4">
            <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-300 block">
              1. Seleccioná el tipo de propiedad:
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {propertyTypes.map((prop) => {
                const Icon = prop.icon;
                const isSelected = selectedProperty === prop.id;
                return (
                  <button
                    key={prop.id}
                    onClick={() => setSelectedProperty(prop.id)}
                    className={`p-4 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center justify-center ${
                      isSelected 
                        ? 'bg-[#DC143C]/15 border-[#DC143C] shadow-[0_0_20px_rgba(220,20,60,0.3)] text-white' 
                        : 'bg-white/[0.03] border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                      isSelected ? 'bg-[#DC143C] text-white' : 'bg-white/5 text-gray-400'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <span className="text-xs sm:text-sm font-bold block">{prop.label}</span>
                    <span className="text-[10px] text-gray-500 mt-1 hidden sm:block">{prop.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: System Features */}
          <div className="space-y-4">
            <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-300 block">
              2. ¿Qué sistemas te interesan incorporar? (Podés marcar varios):
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {systemsList.map((sys) => {
                const Icon = sys.icon;
                const isChecked = selectedSystems.includes(sys.id);
                return (
                  <button
                    key={sys.id}
                    onClick={() => toggleSystem(sys.id)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3 ${
                      isChecked 
                        ? 'bg-white/10 border-white/30 text-white shadow-md' 
                        : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/15'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isChecked ? 'bg-[#DC143C] text-white' : 'bg-white/5 text-gray-400'
                    }`}>
                      <Icon size={16} />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold">{sys.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary & Direct WhatsApp Submission */}
          <div className="p-6 rounded-2xl bg-[#DC143C]/10 border border-[#DC143C]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[#EF4444]">Configuración Lista</span>
              <h4 className="text-base sm:text-lg font-bold text-white">
                Cotizar para {getPropertyLabel()} ({selectedSystems.length} {selectedSystems.length === 1 ? 'servicio' : 'servicios'})
              </h4>
              <p className="text-xs text-gray-400">
                Te enviamos un presupuesto sin cargo y sin compromiso a tu WhatsApp en pocos minutos.
              </p>
            </div>

            <a 
              href={generateWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#DC143C] hover:bg-[#b91c1c] text-white font-bold rounded-2xl shadow-[0_10px_25px_rgba(220,20,60,0.5)] transition-all duration-200 flex-shrink-0"
            >
              <MessageCircle size={20} />
              <span>Enviar Cotización a WhatsApp</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
