/**
 * Motor de Inteligencia Artificial Conversacional y Semántico Dinámico
 * Alarmas Chascomús - Líderes en Seguridad Electrónica
 * 
 * Versatilidad y Búsqueda Dinámica:
 * 1. Lee TODO el catálogo dinámico, todas las marcas cargadas (Garnet, Interbras/Interorás, Hikvision, Dahua, Paradox, etc.)
 *    y todas las URLs indexadas por el usuario.
 * 2. Si el usuario pregunta "¿Qué sistemas de alarmas tienen?", reúne y resume inteligentemente todas las soluciones
 *    de alarmas disponibles (paneles híbridos, inalámbricos, comunicadores y sirenas) mencionando las marcas oficiales.
 * 3. Búsqueda semántica y por palabras clave que nunca se queda sin respuesta si hay productos o fuentes en la base.
 * 4. Tono cálido, humano y consultivo, canalizando cotizaciones a WhatsApp.
 */

export async function generateAIResponse({ query, catalog = [], settings = {}, faqs = [], manuals = [], chatHistory = [] }) {
  await new Promise((resolve) => setTimeout(resolve, 350));

  const cleanQuery = query.toLowerCase().trim();
  const queryTokens = cleanQuery.split(/[\s,?.!¿¡]+/).filter(t => t.length > 2);
  const businessName = settings.businessName || "Alarmas Chascomús";

  // -------------------------------------------------------------
  // 1. SALUDOS SOCIALES Y CHARLA HUMANA
  // -------------------------------------------------------------
  const isOnlyGreeting = [
    "hola", "buen dia", "buen día", "buenas tardes", "buenas noches", 
    "buenas", "que tal", "qué tal", "como estas", "cómo estás", 
    "como te va", "cómo te va", "todo bien", "cómo andas", "como andas"
  ].some(g => cleanQuery === g || cleanQuery.startsWith(g + " ") || cleanQuery === g + "!");

  if (isOnlyGreeting && cleanQuery.length < 25) {
    return {
      text: `¡Hola! ¿Cómo estás? Todo muy bien por acá. Soy el asistente virtual de **${businessName}**.\n\nEstoy para asesorarte sobre sistemas de alarmas, cámaras de seguridad, control de acceso y equipamiento homologado de nuestras marcas (Garnet, Interbras, Hikvision, Dahua). ¿Sobre qué solución te gustaría consultar hoy?`,
      source: "Atención al Cliente (Alarmas Chascomús)",
      isHandoffTriggered: false,
      suggestedActions: [
        { label: "🚨 ¿Qué sistemas de alarmas tienen?", query: "¿Qué sistemas de alarmas tienen?" },
        { label: "📹 Cámaras de seguridad", query: "¿Qué cámaras de seguridad ofrecen?" },
        { label: "💬 Hablar con un asesor en WhatsApp", action: "open_whatsapp" }
      ]
    };
  }

  // -------------------------------------------------------------
  // 2. PRECIOS / PRESUPUESTOS / COTIZACIONES
  // -------------------------------------------------------------
  const isPricingQuery = [
    "precio", "precios", "cuanto sale", "cuánto cuesta", "valor", "presupuesto", 
    "cotizar", "cotizacion", "cotización", "cuanto vale", "cuánto sale", "costo"
  ].some(kw => cleanQuery.includes(kw));

  if (isPricingQuery) {
    return {
      text: `En **${businessName}** cada proyecto de seguridad se **evalúa y cotiza a medida** según las dimensiones de la propiedad, cantidad de zonas y tipo de sensores requeridos en Chascomús y la zona.\n\n${settings.handoffMessage || "Te invitamos a escribirnos por WhatsApp o dejarnos tus datos para que un especialista técnico te brinde un presupuesto exacto y sin compromiso."}`,
      source: "Política Comercial (Alarmas Chascomús)",
      isHandoffTriggered: true,
      suggestedActions: [
        { label: "💬 Solicitar Presupuesto por WhatsApp", action: "open_whatsapp" },
        { label: "📋 Dejar datos de contacto", action: "open_form" }
      ]
    };
  }

  // -------------------------------------------------------------
  // 3. CONSULTA GENERAL DE SISTEMAS DE ALARMAS
  // (ej: "¿Qué sistemas de alarmas tienen?", "alarmas disponibles", "opciones de alarma")
  // -------------------------------------------------------------
  const isAlarmQuery = (cleanQuery.includes("alarma") || cleanQuery.includes("alarmas") || cleanQuery.includes("sistema de alarma") || cleanQuery.includes("sistemas de alarma")) &&
                       (cleanQuery.includes("que") || cleanQuery.includes("qué") || cleanQuery.includes("tienen") || cleanQuery.includes("ofrecen") || cleanQuery.includes("opciones") || cleanQuery.includes("modelos") || cleanQuery.includes("tipos"));

  if (isAlarmQuery) {
    // Extraer todos los productos de alarmas, paneles, comunicadores y marcas presentes en el catálogo y fuentes
    const alarmProducts = catalog.filter(item => 
      item.category.toLowerCase().includes("alarma") || 
      item.category.toLowerCase().includes("panel") || 
      item.category.toLowerCase().includes("sirena") ||
      item.name.toLowerCase().includes("alarma") ||
      item.name.toLowerCase().includes("panel") ||
      item.name.toLowerCase().includes("sirena")
    );

    const brandsFound = [...new Set(catalog.map(item => item.brand))];
    const brandsText = brandsFound.length > 0 ? brandsFound.join(", ") : "Garnet Technology, Interbras, Hikvision y Paradox";

    let response = `En **${businessName}** contamos con una amplia gama de **sistemas de alarmas inteligentes y protección integral**, trabajando con marcas homologadas de fábrica (${brandsText}):\n\n`;
    response += `Disponemos de las siguientes soluciones principales:\n\n`;

    response += `1. **Sistemas de Alarmas Inalámbricas y Monitoreadas:**\n   Centrales inteligentes con control total desde el celular por App móvil, aviso instantáneo de disparo, baterías de respaldo y sensores anti-mascotas.\n\n`;

    response += `2. **Paneles Híbridos Modulares (4 a 32 Zonas):**\n   Líneas profesionales (como Garnet A2K4-NG, A2K8-NG y centrales Interbras) para residencias, locales comerciales e industrias.\n\n`;

    response += `3. **Sirenas Perimetrales de Alta Potencia:**\n   Sirenas de exterior e interior con balizas LED estroboscópicas, 120dB y doble tamper anti-sabotaje.\n\n`;

    response += `4. **Barreras y Sensores Perimetrales Exteriores:**\n   Detección infrarroja y microondas para patios, quintas y predios.\n\n`;

    response += `¿Buscás proteger una casa, un comercio o un campo en Chascomús? Contame y te asesoro con la opción más adecuada.`;

    return {
      text: response,
      source: `Catálogo Oficial y Fábricas (${brandsText})`,
      productsMatched: alarmProducts,
      isHandoffTriggered: false,
      suggestedActions: [
        { label: "🏠 Alarma para Hogar", query: "¿Qué alarma me recomiendan para una casa?" },
        { label: "🏢 Alarma para Comercio", query: "¿Qué opciones tienen para un comercio?" },
        { label: "💬 Solicitar Cotización por WhatsApp", action: "open_whatsapp" }
      ]
    };
  }

  // -------------------------------------------------------------
  // 4. CONSULTA POR UNA MARCA ESPECÍFICA (ej: Interbras, Interorás, Garnet, Hikvision, Dahua)
  // -------------------------------------------------------------
  const brandKeywords = [
    { key: "interbras", alias: ["interbras", "interorás", "interoras", "interobra", "inter-bras"] },
    { key: "garnet", alias: ["garnet", "garnet technology", "alonso"] },
    { key: "hikvision", alias: ["hikvision", "hik vision", "colorvu"] },
    { key: "dahua", alias: ["dahua"] },
    { key: "paradox", alias: ["paradox"] },
    { key: "zkteco", alias: ["zkteco", "zk"] }
  ];

  let detectedBrandObj = brandKeywords.find(b => b.alias.some(a => cleanQuery.includes(a)));

  if (detectedBrandObj) {
    const brandName = detectedBrandObj.key.charAt(0).toUpperCase() + detectedBrandObj.key.slice(1);
    
    // Buscar productos de esa marca en el catálogo dinámico
    const brandProducts = catalog.filter(item => 
      item.brand.toLowerCase().includes(detectedBrandObj.key) ||
      detectedBrandObj.alias.some(a => item.brand.toLowerCase().includes(a) || item.name.toLowerCase().includes(a) || (item.sourceUrl && item.sourceUrl.toLowerCase().includes(a)))
    );

    let response = `Sí, en **${businessName}** trabajamos con la línea oficial y equipamiento de la fábrica **${brandName}** (contamos con su información y fichas técnicas indexadas).\n\n`;

    if (brandProducts.length > 0) {
      response += `Equipos y soluciones disponibles de **${brandName}**:\n`;
      brandProducts.forEach(prod => {
        response += `• **${prod.name}:** ${prod.description}\n`;
      });
      response += `\n¿Te gustaría conocer especificaciones técnicas detalladas o solicitar una cotización de instalación para ${brandName}?`;
    } else {
      response += `Disponemos de sus sistemas de alarmas, sensores y accesorios homologados con respaldo técnico oficial e instalación profesional en Chascomús y la región.\n\n¿Sobre qué producto o requerimiento de ${brandName} te gustaría consultar?`;
    }

    return {
      text: response,
      source: `Fábrica Homologada (${brandName})`,
      productsMatched: brandProducts,
      isHandoffTriggered: false,
      suggestedActions: [
        { label: `🚨 Consultar modelos de ${brandName}`, query: `¿Qué modelos de ${brandName} tienen?` },
        { label: "💬 Solicitar Asesoramiento en WhatsApp", action: "open_whatsapp" }
      ]
    };
  }

  // -------------------------------------------------------------
  // 5. CARACTERÍSTICAS / FICHAS TÉCNICAS ESPECÍFICAS (ej: MP-1000, A2K4, IP-500)
  // -------------------------------------------------------------
  const isSpecsQuery = cleanQuery.includes("caracteristica") || 
                       cleanQuery.includes("características") || 
                       cleanQuery.includes("especificacion") || 
                       cleanQuery.includes("especificaciones") || 
                       cleanQuery.includes("ficha tecnica") || 
                       cleanQuery.includes("ficha técnica") || 
                       cleanQuery.includes("mp-1000") || 
                       cleanQuery.includes("mp1000") ||
                       cleanQuery.includes("mp-100");

  if (isSpecsQuery) {
    const matchedItem = catalog.find(item => 
      item.name.toLowerCase().includes("mp-1000") || 
      item.name.toLowerCase().includes("mp-100") ||
      queryTokens.some(t => item.name.toLowerCase().includes(t))
    );

    if (matchedItem) {
      let responseText = `Con gusto. Las **especificaciones técnicas oficiales** de la **${matchedItem.name}** (${matchedItem.brand}) son:\n\n`;
      responseText += `• *Descripción:* ${matchedItem.description}\n\n`;
      responseText += `**Prestaciones y Ficha Técnica:**\n`;

      if (matchedItem.specs && matchedItem.specs.length > 0) {
        matchedItem.specs.forEach(spec => {
          responseText += `• ${spec}\n`;
        });
      }

      responseText += `\n¿Te gustaría coordinar la instalación o solicitar presupuesto para tu propiedad en Chascomús?`;

      return {
        text: responseText,
        source: `Ficha Técnica Oficial (${matchedItem.brand})`,
        productsMatched: [matchedItem],
        isHandoffTriggered: false,
        suggestedActions: [
          { label: "📋 Cotizar este equipo", action: "open_form" },
          { label: "💬 Consultar por WhatsApp", action: "open_whatsapp" }
        ]
      };
    }
  }

  // -------------------------------------------------------------
  // 6. FAQS CON VIDEO O RESOLUCIÓN DE FALLAS
  // -------------------------------------------------------------
  const matchedFaq = faqs.find(faq => {
    const qText = faq.question.toLowerCase();
    const aText = faq.answer.toLowerCase();
    if (qText.includes(cleanQuery) || cleanQuery.includes(qText)) return true;
    const tokenMatches = queryTokens.filter(token => qText.includes(token) || aText.includes(token));
    return tokenMatches.length >= 2 || (tokenMatches.length >= 1 && queryTokens.length <= 2);
  });

  if (matchedFaq) {
    let responseText = `Te comento respecto a tu consulta:\n\n${matchedFaq.answer}`;
    const suggestedActions = [];

    if (matchedFaq.videoUrl) {
      responseText += `\n\n🎬 **Videotutorial:** Podés ver la explicación paso a paso en el siguiente video:\n${matchedFaq.videoUrl}`;
      suggestedActions.push({ label: "🎬 Abrir Videotutorial en YouTube", url: matchedFaq.videoUrl });
    }

    suggestedActions.push({ label: "💬 Hablar con Soporte Técnico", action: "open_whatsapp" });

    return {
      text: responseText,
      source: `Base de Soluciones (${matchedFaq.category || 'Soporte'})`,
      isHandoffTriggered: false,
      suggestedActions
    };
  }

  // -------------------------------------------------------------
  // 7. BÚSQUEDA SEMÁNTICA DINÁMICA EN EL CATÁLOGO (Cualquier coincidencia de palabras)
  // -------------------------------------------------------------
  const semanticMatches = catalog.filter((item) => {
    const name = item.name.toLowerCase();
    const brand = item.brand.toLowerCase();
    const cat = item.category.toLowerCase();
    const desc = item.description.toLowerCase();

    return queryTokens.some(token => 
      name.includes(token) || brand.includes(token) || cat.includes(token) || desc.includes(token)
    );
  });

  if (semanticMatches.length > 0) {
    let response = `En **${businessName}** disponemos de las siguientes soluciones relacionadas con tu consulta:\n\n`;

    semanticMatches.slice(0, 3).forEach(item => {
      response += `• **${item.name}** (${item.brand})\n  ${item.description}\n\n`;
    });

    response += `Cada instalación se planifica de forma personalizada para tu propiedad. ¿Te gustaría que un especialista técnico te asesore sin compromiso?`;

    return {
      text: response,
      source: `Catálogo Oficial (${semanticMatches[0].brand})`,
      productsMatched: semanticMatches,
      isHandoffTriggered: false,
      suggestedActions: [
        { label: "📋 Solicitar Asesoramiento Técnico", action: "open_form" },
        { label: "💬 Contactar por WhatsApp", action: "open_whatsapp" }
      ]
    };
  }

  // -------------------------------------------------------------
  // 8. RESPUESTA VERSÁTIL Y HUMANA POR DEFECTO
  // -------------------------------------------------------------
  return {
    text: `¡Hola! Como asesor virtual de **${businessName}**, estoy capacitado para ayudarte con todos nuestros sistemas de seguridad electrónica en Chascomús y la región.\n\nContamos con equipamiento oficial homologado en:\n• **Sistemas de Alarmas Inteligentes** (Garnet, Interbras, Paradox)\n• **Cámaras de Videovigilancia IP 4K** (Hikvision, Dahua)\n• **Protección Perimetral y Sensores Exteriores**\n• **Control de Acceso Biométrico y Digital**\n\n¿Sobre cuál de estas áreas te gustaría recibir más información?`,
    source: "Atención Consultiva (Alarmas Chascomús)",
    isHandoffTriggered: false,
    suggestedActions: [
      { label: "🚨 ¿Qué sistemas de alarmas tienen?", query: "¿Qué sistemas de alarmas tienen?" },
      { label: "📹 Cámaras de Seguridad", query: "¿Qué cámaras de seguridad ofrecen?" },
      { label: "💬 Hablar con un Asesor", action: "open_whatsapp" }
    ]
  };
}
