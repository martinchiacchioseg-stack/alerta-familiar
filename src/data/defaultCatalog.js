export const INITIAL_CATALOG = [
  // --- LÍNEA OFICIAL GARNET TECHNOLOGY ---
  {
    id: "garnet-sirena-1000",
    name: "Sirena Exterior Garnet MP-1000 con Baliza LED",
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
      "Tonos Configurables: Tono modulado piezoeléctrico de alta penetración"
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
      "Apta intemperie con protección UV",
      "Alimentación 12VDC"
    ],
    sourceUrl: "https://www.garnet.com.ar/Productos",
    stock: true,
    isPopular: false
  },
  {
    id: "garnet-panel-1",
    name: "Panel de Alarma Híbrido Garnet A2K4-NG",
    brand: "Garnet",
    category: "Paneles de Alarma",
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
  {
    id: "garnet-panel-2",
    name: "Panel de Alarma Híbrido Garnet A2K8-NG",
    brand: "Garnet",
    category: "Paneles de Alarma",
    description: "Central de alarma profesional modular de 8 a 32 zonas cableadas e inalámbricas. Ideal para residencias grandes, comercios e industrias.",
    specs: [
      "8 a 32 zonas programables",
      "Hasta 4 particiones independientes",
      "Soporta hasta 64 códigos de usuario",
      "Receptor inalámbrico integrable para controles remotos"
    ],
    sourceUrl: "https://www.garnet.com.ar/Productos/Paneles-Hibridos",
    stock: true,
    isPopular: true
  },

  // --- LÍNEA OFICIAL INTELBRAS / INTERBRAS (Indexada) ---
  {
    id: "intelbras-panel-1",
    name: "Central de Alarma Monitoreada Intelbras AMT 8000 Pro (100% Inalámbrica / Wi-Fi)",
    brand: "Intelbras",
    category: "Paneles de Alarma",
    description: "Central de alarma inteligente 100% inalámbrica de largo alcance con conexión Wi-Fi, Ethernet y 4G/GPRS nativa. Gestión remota total por App móvil AMT Remoto.",
    specs: [
      "Hasta 64 zonas 100% inalámbricas",
      "Conectividad Wi-Fi, Ethernet e IP integrada",
      "Batería de respaldo recargable de larga duración",
      "Alcance inalámbrico de hasta 600 metros en campo abierto",
      "Compatible con sensores PIR fotográficos y teclados inalámbricos"
    ],
    sourceUrl: "https://www.intelbras.com/es-ar/seguridad-electronica/alarmas",
    stock: true,
    isPopular: true
  },
  {
    id: "intelbras-panel-2",
    name: "Central de Alarma Intelbras AMT 4010 Smart / AMT 2018 E",
    brand: "Intelbras",
    category: "Paneles de Alarma",
    description: "Central de alarma híbrida de alta capacidad para residencias y comercios, con comunicación IP/Ethernet, supervisión de enlaces y partición doble.",
    specs: [
      "Hasta 64 zonas (cableadas e inalámbricas)",
      "4 particiones independientes",
      "Conexión Ethernet TCP/IP integrada",
      "Control de accesos y domótica mediante salidas PGM"
    ],
    sourceUrl: "https://www.intelbras.com/es-ar/seguridad-electronica/alarmas",
    stock: true,
    isPopular: true
  },
  {
    id: "intelbras-panel-3",
    name: "Sistema de Alarma Inteligente Intelbras ANM 24 NET",
    brand: "Intelbras",
    category: "Paneles de Alarma",
    description: "Central de alarma no monitoreada compacta con conexión a la nube, configuración simplificada por App móvil y reporte directo al usuario sin abonos fijos.",
    specs: [
      "24 zonas inalámbricas y 4 cableadas",
      "Conexión directa a la nube por red IP",
      "Avisos de disparo instantáneos por notificación Push",
      "Programación rápida mediante smartphone"
    ],
    sourceUrl: "https://www.intelbras.com/es-ar/seguridad-electronica/alarmas",
    stock: true,
    isPopular: true
  },
  {
    id: "intelbras-cerco-1",
    name: "Central de Cerco Eléctrico Perimetral Intelbras ELC 6012 NET (Wi-Fi)",
    brand: "Intelbras",
    category: "Perimetral",
    description: "Electrificador perimetral de alta potencia con conexión a internet Wi-Fi para activación, monitoreo y aviso de corte de alambre en el celular.",
    specs: [
      "Energía de choque de hasta 12.000 voltios pulsados",
      "Conectividad Wi-Fi integrada para control por App",
      "Monitoreo de perímetro y tamper anti-sabotaje",
      "Capacidad de disparo de sirena y aviso en tiempo real"
    ],
    sourceUrl: "https://www.intelbras.com/es-ar/seguridad-electronica/alarmas",
    stock: true,
    isPopular: true
  },
  {
    id: "intelbras-sensor-1",
    name: "Detector de Movimiento Infrarrojo Intelbras IVP 8000 Pet (Inalámbrico)",
    brand: "Intelbras",
    category: "Sensores",
    description: "Sensor de movimiento infrarrojo pasivo 100% inalámbrico de alta precisión con inmunidad a mascotas de hasta 20kg y detección inteligente.",
    specs: [
      "Inmunidad a mascotas hasta 20 kg",
      "Comunicación inalámbrica bidireccional encriptada",
      "Cobertura de 12 metros a 90 grados",
      "Batería de larga duración (hasta 3 a 5 años)"
    ],
    sourceUrl: "https://www.intelbras.com/es-ar/seguridad-electronica/alarmas",
    stock: true,
    isPopular: false
  },

  // --- SOLUCIONES INSTITUCIONALES ALARMAS CHASCOMÚS ---
  {
    id: "chas-1",
    name: "Sistema de Alarma Integral con Aviso al Celular para Hogar y Comercio",
    brand: "Alarmas Chascomús",
    category: "Paneles de Alarma",
    description: "Central inteligente con teclado táctil, sensores de movimiento anti-mascotas, detectores magnéticos de apertura en aberturas y sirena perimetral.",
    specs: ["Inmunidad a mascotas hasta 25kg", "Batería de respaldo por cortes de 220V", "Avisos en tiempo real al celular", "Asesoramiento e instalación en Chascomús"],
    sourceUrl: "https://alarmas-chas-2c2iggcg.manus.space/",
    stock: true,
    isPopular: true
  },
  {
    id: "chas-2",
    name: "Sistema de Videovigilancia Cámaras IP 4K ColorVu de Visión Nocturna",
    brand: "Hikvision",
    category: "CCTV",
    description: "Cámaras para exterior con visión nocturna a color real las 24 horas, NVR con analítica de personas/vehículos y visualización remota desde el celular.",
    specs: ["Visión nocturna a color 24hs", "Detección inteligente de personas y vehículos", "Carcasa resistente a intemperie IP67", "Acceso remoto seguro por App móvil"],
    sourceUrl: "https://alarmas-chas-2c2iggcg.manus.space/",
    stock: true,
    isPopular: true
  }
];

export const INITIAL_FAQS = [
  {
    id: "faq-1",
    question: "¿Por qué mi teclado de alarma hace un sonido/beep de forma continua?",
    answer: "Un pitido continuo o intermitente en el teclado generalmente indica una advertencia de sistema (ej: falta de energía 220V, batería de respaldo baja o corte de línea). En teclados Garnet presioná [*][2] para ver el código de falla.",
    videoUrl: "",
    category: "Problemas Frecuentes"
  },
  {
    id: "faq-2",
    question: "¿Cómo cambio la clave o código de usuario en mi alarma Garnet?",
    answer: "Para cambiar el código maestro en un panel Garnet: ingresá [*][5] + [Código Maestro Actual] + [Número de Usuario] + [Nuevo Código de 4 dígitos] + [#].",
    videoUrl: "",
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
    id: "manual-intelbras-1",
    title: "Manual de Usuario y Programación Intelbras AMT 8000 / AMT 4010",
    brand: "Intelbras",
    pdfUrl: "https://backend.intelbras.com/sites/default/files/2021-03/Manual_AMT_8000.pdf",
    category: "Conocimiento Interno IA",
    isPublicDownloadable: false
  }
];

export const INITIAL_SETTINGS = {
  strictMode: false,
  allowGeneralConcepts: true,
  tone: "consultive",
  systemPrompt: "Sos el asistente virtual oficial de Alarmas Chascomús. Sos amable, profesional y razonas con precisión. Si te preguntan por una marca específica (como Intelbras / Interbras o Garnet), responde con enfoque exclusivo en esa marca sin mezclar productos de otras. Si te consultan qué sistemas de alarmas ofrecemos en general, explica con claridad los paneles inalámbricos, híbridos y perimetrales.",
  whatsappNumber: "+5492241505050",
  businessName: "Alarmas Chascomús",
  handoffMessage: "En Alarmas Chascomús cada proyecto se evalúa de forma personalizada. Dejanos tus datos o contactanos por WhatsApp para recibir un presupuesto sin compromiso.",
  logoUrl: "/logo.jpg",
  brandColor: "#dc143c",
  adminPassword: "admin",
  customSources: [
    "https://alarmas-chas-2c2iggcg.manus.space/",
    "https://www.garnet.com.ar/Productos",
    "https://www.intelbras.com/es-ar/seguridad-electronica/alarmas"
  ]
};
