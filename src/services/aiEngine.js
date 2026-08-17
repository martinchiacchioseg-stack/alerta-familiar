/**
 * Motor de Inteligencia Artificial con Razonamiento Aislado por Marca
 * Alarmas Chascomús - Líderes en Seguridad Electrónica
 * 
 * Reglas de Razonamiento Estricto:
 * 1. Si el usuario pregunta por una marca puntual (ej: Intelbras / Interbras), la IA responde
 *    ÚNICAMENTE con los productos de Intelbras (AMT 8000, AMT 4010, ANM 24 NET, cercos ELC 6012).
 *    BAJO NINGUNA CIRCUNSTANCIA mezcla productos de Garnet ni de otras marcas si no se los pidieron.
 * 2. Si el usuario pregunta por Garnet, responde ÚNICAMENTE con los modelos de Garnet (Sirena MP-1000, A2K4-NG, A2K8-NG).
 * 3. Si preguntan en general "¿Qué sistemas de alarmas tienen?", resume de forma amplia y estructurada
 *    los tipos de alarmas (inalámbricas, híbridas, perimetrales) citando las fábricas oficiales.
 * 4. Tono natural, humano y consultivo, canalizando cotizaciones a WhatsApp.
 */

export async function generateAIResponse({ query, catalog = [], settings = {}, faqs = [], manuals = [], chatHistory = [] }) {
  await new Promise((resolve) => setTimeout(resolve, 300));

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
      text: `¡Hola! ¿Cómo estás? Todo muy bien por acá. Soy el asesor virtual de **${businessName}**.\n\nEstoy a disposición para responderte consultas sobre sistemas de alarmas, cámaras de seguridad, cercos eléctricos y equipamiento homologado de nuestras marcas oficiales (**Intelbras, Garnet, Hikvision, Dahua**). ¿Sobre qué solución te gustaría consultar?`,
      source: "Atención al Cliente (Alarmas Chascomús)",
      isHandoffTriggered: false,
      suggestedActions: [
        { label: "🚨 ¿Qué sistemas de alarmas tienen?", query: "¿Qué sistemas de alarmas tienen?" },
        { label: "🛡️ Ver opciones de Intelbras", query: "¿Qué productos tienen de Intelbras?" },
        { label: "🚨 Ver opciones de Garnet", query: "¿Qué productos tienen de Garnet?" },
        { label: "💬 Hablar por WhatsApp", action: "open_whatsapp" }
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
      text: `En **${businessName}** cada proyecto de seguridad se **evalúa y cotiza a medida** según las características del inmueble, cantidad de aberturas y zonas a proteger en Chascomús y la región.\n\n${settings.handoffMessage || "Te invitamos a escribirnos por WhatsApp o dejarnos tus datos para que un especialista técnico te brinde un presupuesto exacto y sin compromiso."}`,
      source: "Política Comercial (Alarmas Chascomús)",
      isHandoffTriggered: true,
      suggestedActions: [
        { label: "💬 Solicitar Presupuesto por WhatsApp", action: "open_whatsapp" },
        { label: "📋 Dejar datos de contacto", action: "open_form" }
      ]
    };
  }

  // -------------------------------------------------------------
  // 3. CONSULTA ESPECÍFICA POR MARCA: INTELBRAS / INTERBRAS
  // -------------------------------------------------------------
  const isIntelbras = ["intelbras", "interbras", "interorás", "interoras", "interobra", "inter-bras"].some(a => cleanQuery.includes(a));

  if (isIntelbras) {
    const intelbrasItems = catalog.filter(i => 
      i.brand.toLowerCase().includes("intelbras") || 
      i.brand.toLowerCase().includes("interbras") ||
      (i.sourceUrl && i.sourceUrl.toLowerCase().includes("intelbras"))
    );

    let response = `Sí, en **${businessName}** trabajamos de forma oficial con la línea de seguridad electrónica de **Intelbras**.\n\n`;
    response += `Disponemos de las siguientes soluciones y modelos de **Intelbras**:\n\n`;

    if (intelbrasItems.length > 0) {
      intelbrasItems.forEach(item => {
        response += `• **${item.name}:** ${item.description}\n`;
      });
    } else {
      response += `• **Central AMT 8000 Pro:** Alarma 100% inalámbrica de largo alcance con Wi-Fi, 4G y control total por App móvil AMT Remoto.\n`;
      response += `• **Centrales Híbridas AMT 4010 / AMT 2018 E:** Paneles modulares de hasta 64 zonas para hogares y comercios.\n`;
      response += `• **Alarma ANM 24 NET:** Sistema no monitoreado con aviso directo a la nube y programación por smartphone.\n`;
      response += `• **Cercos Eléctricos ELC 6012 NET (Wi-Fi):** Electrificadores perimetrales con aviso de corte al celular.\n`;
      response += `• **Sensores Infrarrojos IVP 8000 Pet:** Detectores inalámbricos de alta precisión anti-mascotas.\n`;
    }

    response += `\n¿Te gustaría solicitar una cotización o asesoramiento técnico sobre algún equipo Intelbras para tu propiedad en Chascomús?`;

    return {
      text: response,
      source: "Catálogo Oficial (Intelbras Argentina)",
      productsMatched: intelbrasItems,
      isHandoffTriggered: false,
      suggestedActions: [
        { label: "📱 Alarma Inalámbrica AMT 8000", query: "¿Qué características tiene la central Intelbras AMT 8000?" },
        { label: "⚡ Cerco Eléctrico Intelbras ELC 6012", query: "¿Tienen cercos eléctricos Intelbras?" },
        { label: "💬 Solicitar Cotización en WhatsApp", action: "open_whatsapp" }
      ]
    };
  }

  // -------------------------------------------------------------
  // 4. CONSULTA ESPECÍFICA POR MARCA: GARNET TECHNOLOGY
  // -------------------------------------------------------------
  const isGarnet = ["garnet", "garnet technology", "alonso"].some(a => cleanQuery.includes(a));

  if (isGarnet) {
    const garnetItems = catalog.filter(i => i.brand.toLowerCase().includes("garnet"));

    let response = `Sí, en **${businessName}** trabajamos de forma oficial con la fábrica **Garnet Technology**.\n\n`;
    response += `Modelos y equipamiento oficial de **Garnet** disponibles:\n\n`;

    if (garnetItems.length > 0) {
      garnetItems.forEach(item => {
        response += `• **${item.name}:** ${item.description}\n`;
      });
    } else {
      response += `• **Sirena Exterior MP-1000 con Baliza LED:** 120dB de potencia, baliza estroboscópica y doble tamper anti-sabotaje.\n`;
      response += `• **Sirena Exterior MP-200 Bitonal:** Gabinete estanco con flash LED y protección UV.\n`;
      response += `• **Paneles de Alarma Híbridos A2K4-NG y A2K8-NG:** Centrales de 4 a 32 zonas con reporte a la App Garnet Control Pro.\n`;
    }

    response += `\n¿Te gustaría solicitar cotización de instalación de algún equipo Garnet?`;

    return {
      text: response,
      source: "Catálogo Oficial (Garnet Technology)",
      productsMatched: garnetItems,
      isHandoffTriggered: false,
      suggestedActions: [
        { label: "🚨 Ficha Técnica Sirena MP-1000", query: "¿Cuáles son las características de la sirena MP-1000?" },
        { label: "📱 Panel Garnet A2K4-NG", query: "¿Qué características tiene el panel Garnet A2K4?" },
        { label: "💬 Consultar en WhatsApp", action: "open_whatsapp" }
      ]
    };
  }

  // -------------------------------------------------------------
  // 5. CONSULTA GENERAL: ¿QUÉ SISTEMAS DE ALARMAS TIENEN?
  // -------------------------------------------------------------
  const isGeneralAlarmQuery = (cleanQuery.includes("alarma") || cleanQuery.includes("alarmas") || cleanQuery.includes("sistema de alarma") || cleanQuery.includes("sistemas de alarma")) &&
                              (cleanQuery.includes("que") || cleanQuery.includes("qué") || cleanQuery.includes("tienen") || cleanQuery.includes("ofrecen") || cleanQuery.includes("opciones") || cleanQuery.includes("modelos") || cleanQuery.includes("tipos") || cleanQuery.includes("recomiendan"));

  if (isGeneralAlarmQuery) {
    let response = `En **${businessName}** ofrecemos soluciones integrales de alarmas adaptadas a cada necesidad, trabajando con marcas líderes homologadas (**Intelbras, Garnet, Hikvision, Paradox**):\n\n`;

    response += `1. **Sistemas de Alarmas Inalámbricas Inteligentes:**\n`;
    response += `   • Centrales como la **Intelbras AMT 8000 Pro** (100% sin cables, Wi-Fi y 4G) o **Garnet Hub** con aviso en tiempo real a tu celular por App móvil.\n\n`;

    response += `2. **Paneles Híbridos Modulares (Cableados e Inalámbricos):**\n`;
    response += `   • Centrales de 4 a 64 zonas (como **Garnet A2K4-NG / A2K8-NG** o **Intelbras AMT 4010 Smart**) ideales para casas grandes, comercios e industrias.\n\n`;

    response += `3. **Sistemas de Cerco Eléctrico y Protección Perimetral:**\n`;
    response += `   • Electrificadores inteligentes con Wi-Fi (**Intelbras ELC 6012 NET**) y barreras infrarrojas para protección de patios, quintas y predios.\n\n`;

    response += `4. **Sirenas Perimetrales de Alta Potencia:**\n`;
    response += `   • Modelos piezoeléctricos de 120dB con balizas LED estroboscópicas y doble tamper anti-desmonte.\n\n`;

    response += `¿Buscás proteger una casa, un comercio o una quinta en Chascomús? Contame y te asesoro con la opción exacta.`;

    return {
      text: response,
      source: "Catálogo General (Alarmas Chascomús)",
      isHandoffTriggered: false,
      suggestedActions: [
        { label: "🏠 Alarma para Hogar", query: "¿Qué alarma me recomiendan para una casa?" },
        { label: "🏢 Alarma para Comercio", query: "¿Qué opciones tienen para un comercio?" },
        { label: "⚡ Cercos Eléctricos", query: "¿Tienen cercos eléctricos perimetrales?" },
        { label: "💬 Hablar con un Asesor", action: "open_whatsapp" }
      ]
    };
  }

  // -------------------------------------------------------------
  // 6. CARACTERÍSTICAS / FICHAS TÉCNICAS PUNTUALES (ej: MP-1000, AMT 8000, ELC 6012)
  // -------------------------------------------------------------
  const isSpecsQuery = cleanQuery.includes("caracteristica") || 
                       cleanQuery.includes("características") || 
                       cleanQuery.includes("especificacion") || 
                       cleanQuery.includes("especificaciones") || 
                       cleanQuery.includes("ficha tecnica") || 
                       cleanQuery.includes("ficha técnica") || 
                       cleanQuery.includes("mp-1000") || 
                       cleanQuery.includes("mp1000") ||
                       cleanQuery.includes("amt 8000") ||
                       cleanQuery.includes("amt8000") ||
                       cleanQuery.includes("elc 6012") ||
                       cleanQuery.includes("a2k4");

  if (isSpecsQuery) {
    const matchedItem = catalog.find(item => 
      item.name.toLowerCase().includes("mp-1000") || 
      item.name.toLowerCase().includes("amt 8000") || 
      item.name.toLowerCase().includes("elc 6012") || 
      item.name.toLowerCase().includes("a2k4") || 
      queryTokens.some(t => item.name.toLowerCase().includes(t))
    );

    if (matchedItem) {
      let responseText = `Las **especificaciones técnicas oficiales** de **${matchedItem.name}** (${matchedItem.brand}) son:\n\n`;
      responseText += `• *Descripción:* ${matchedItem.description}\n\n`;
      responseText += `**Prestaciones principales:**\n`;

      if (matchedItem.specs && matchedItem.specs.length > 0) {
        matchedItem.specs.forEach(spec => {
          responseText += `• ${spec}\n`;
        });
      }

      responseText += `\n¿Te gustaría coordinar una visita técnica o solicitar presupuesto para tu propiedad en Chascomús?`;

      return {
        text: responseText,
        source: `Ficha Técnica (${matchedItem.brand})`,
        productsMatched: [matchedItem],
        isHandoffTriggered: false,
        suggestedActions: [
          { label: "📋 Cotizar este equipo", action: "open_form" },
          { label: "💬 Consultar en WhatsApp", action: "open_whatsapp" }
        ]
      };
    }
  }

  // -------------------------------------------------------------
  // 7. FAQS CON VIDEO O RESOLUCIÓN DE PROBLEMAS
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
  // 8. BÚSQUEDA SEMÁNTICA DINÁMICA POR PALABRAS CLAVE
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

    response += `Cada instalación se planifica de forma personalizada. ¿Te gustaría que un especialista técnico te asesore sin compromiso?`;

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
  // 9. RESPUESTA GENERAL Y ATENCIÓN CONSULTIVA
  // -------------------------------------------------------------
  return {
    text: `Como asesor virtual de **${businessName}**, estoy capacitado para informarte sobre todas nuestras soluciones de seguridad electrónica en Chascomús y la región.\n\nTrabajamos con equipamiento oficial en:\n• **Sistemas de Alarmas Inalámbricas e Híbridas** (Intelbras, Garnet)\n• **Cámaras de Videovigilancia IP 4K** (Hikvision, Dahua)\n• **Cercos Eléctricos y Protección Perimetral** (Intelbras ELC)\n• **Control de Acceso y Sensores Infrarrojos**\n\n¿Sobre cuál de estos sistemas te gustaría recibir asesoramiento?`,
    source: "Atención Consultiva (Alarmas Chascomús)",
    isHandoffTriggered: false,
    suggestedActions: [
      { label: "🚨 ¿Qué sistemas de alarmas tienen?", query: "¿Qué sistemas de alarmas tienen?" },
      { label: "📹 Cámaras de Seguridad", query: "¿Qué cámaras de seguridad ofrecen?" },
      { label: "💬 Hablar con un Asesor", action: "open_whatsapp" }
    ]
  };
}
