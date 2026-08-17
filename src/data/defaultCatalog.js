export const INITIAL_CATALOG = [
  // --- Línea de Productos GARNET TECHNOLOGY ---
  {
    id: "garnet-sirena-1000",
    name: "Sirena Exterior Garnet MP-1000 / MP-100 con Baliza LED",
    brand: "Garnet",
    category: "Sirenas",
    description: "Sirena perimetral exterior de alta potencia con luz estroboscópica LED de alto impacto visual, gabinete estanco de policarbonato reforzado y protección UV.",
    specs: [
      "Potencia Acústica: 120 dB a 1 metro",
      "Señalización Lumínica: Baliza de LEDs de alta potencia estroboscópica",
      "Protección Anti-sabotaje: Doble tamper (anti-apertura de tapa y anti-desmonte de pared)",
      "Alimentación: 12V DC (Consumo en disparo: 1.1A / Reposo: 15mA)",
      "Construcción: Gabinete inyectado en policarbonato ignífugo con filtro UV",
      "Grado de Protección: Intemperie IP65 (resistente a lluvia, humedad y polvo)",
      "Sonido Configurable: Tono modulado piezoeléctrico de alta penetración"
    ],
    sourceUrl: "https://www.garnet.com.ar/Productos",
    stock: true,
    isPopular: true
  },
  {
    id: "garnet-sirena-200",
    name: "Sirena Exterior Garnet MP-200 Bitonal",
    brand: "Garnet",
    category: "Sirenas",
    description: "Sirena perimetral bitonal de alto rendimiento con flash LED de gran alcance y gabinete de policarbonato de alta resistencia.",
    specs: [
      "Potencia Acústica: 118 dB",
      "Flash Estroboscópico LED de alta luminosidad",
      "Tamper microswitch anti-desmonte de pared",
      "Apta intemperie con protección UV y drenaje de condensación",
      "Alimentación 12VDC"
    ],
    sourceUrl: "https://www.garnet.com.ar/Productos",
    stock: true,
    isPopular: false
  },
  {
    id: "garnet-sirena-300",
    name: "Sirena Exterior Garnet MP-300 / MP-400 de Alta Potencia",
    brand: "Garnet",
    category: "Sirenas",
    description: "Sirena perimetral inteligente de máxima seguridad con 120dB de sonoridad, gabinete reforzado y doble tamper anti-apertura y anti-desmonte.",
    specs: [
      "Potencia acústica 120 dB real",
      "Doble tamper de seguridad (tapa y pared)",
      "Luz de señalización nocturna permanente y destello en alarma",
      "Gabinete estanco de policarbonato con jaula metálica interna opcional"
    ],
    sourceUrl: "https://www.garnet.com.ar/Productos",
    stock: true,
    isPopular: true
  },
  {
    id: "garnet-panel-1",
    name: "Panel de Alarma Híbrido Garnet A2K4-NG",
    brand: "Garnet",
    category: "Paneles Híbridos",
    description: "Central de alarma de 4 zonas expandible a 8 por duplicación, compatible con comunicadores IP/4G y reporte instantáneo en la App Garnet Control Pro.",
    specs: [
      "4 a 8 zonas con duplicación programable",
      "Soporta teclados LCD G-LCD732 y LED KPD-860",
      "Compatible con módulo Ethernet IP-500 y 4G LTE",
      "Supervisión continua de batería, red 220V y sirena"
    ],
    sourceUrl: "https://www.garnet.com.ar/Productos/Paneles-Hibridos",
    stock: true,
    isPopular: true
  },

  // --- Soluciones ALARMAS CHASCOMÚS ---
  {
    id: "chas-1",
    name: "Sistema de Alarma Monitoreada Inalámbrica para Hogar y Comercio",
    brand: "Alarmas Chascomús",
    category: "Alarmas",
    description: "Central de alarma inteligente con teclados touch, sensores de movimiento anti-mascotas, detectores magnéticos de apertura y sirena perimetral. Conexión directa a app móvil.",
    specs: ["Inmunidad a mascotas hasta 25kg", "Batería de respaldo por cortes de luz", "Avisos en tiempo real al celular", "Atención técnica especializada"],
    sourceUrl: "https://alarmas-chas-2c2iggcg.manus.space/",
    stock: true,
    isPopular: true
  }
];

export const INITIAL_FAQS = [
  {
    id: "faq-1",
    question: "¿Por qué mi teclado de alarma hace un sonido/beep de forma continua?",
    answer: "Un pitido continuo o intermitente en el teclado generalmente indica una advertencia de sistema (ej: falta de energía 220V, batería de respaldo baja o corte de línea de comunicación). Para ver el código de falla en teclados Garnet presiona [*][2].",
    videoUrl: "", // Sin video de prueba genérico
    category: "Problemas Frecuentes"
  },
  {
    id: "faq-2",
    question: "¿Cómo cambio la clave o código de usuario en mi alarma Garnet?",
    answer: "Para cambiar el código de usuario maestro en un panel Garnet: ingresa [*][5] + [Código Maestro Actual] + [Número de Usuario] + [Nuevo Código de 4 dígitos] + [#].",
    videoUrl: "", // Sin video de prueba genérico
    category: "Configuración"
  }
];

export const INITIAL_MANUALS = [
  {
    id: "manual-pub-1",
    title: "Guía Rápida de Usuario para Teclados y Alarma Garnet (PDF)",
    brand: "Garnet",
    pdfUrl: "https://www.garnet.com.ar/Manuales/Guia_Usuario_Garnet.pdf",
    category: "Manuales de Usuario",
    isPublicDownloadable: true
  },
  {
    id: "manual-priv-1",
    title: "Ficha Técnica y Manual de Programación Panel Garnet A2K4-NG / A2K8-NG",
    brand: "Garnet",
    pdfUrl: "https://www.garnet.com.ar/Manuales/Manual_Tecnico_A2K4.pdf",
    category: "Conocimiento Interno IA",
    isPublicDownloadable: false
  }
];

export const INITIAL_SETTINGS = {
  strictMode: true,
  allowGeneralConcepts: true,
  tone: "consultive",
  systemPrompt: "Sos el asistente virtual oficial de Alarmas Chascomús. Tu tono es profesional, amigable y consultivo. Tu objetivo es educar sobre seguridad electrónica, responder sobre marcas homologadas (Garnet, Hikvision, Dahua) y canalizar solicitudes de presupuestos a nuestro WhatsApp.",
  whatsappNumber: "+5492241505050",
  businessName: "Alarmas Chascomús",
  handoffMessage: "En Alarmas Chascomús cada proyecto se evalúa de forma personalizada. Dejanos tus datos o contactanos por WhatsApp para recibir un presupuesto sin compromiso.",
  logoUrl: "/logo.jpg",
  brandColor: "#dc143c",
  adminPassword: "admin",
  customSources: [
    "https://alarmas-chas-2c2iggcg.manus.space/",
    "https://www.garnet.com.ar/Productos"
  ]
};
