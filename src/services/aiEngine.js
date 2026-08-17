/**
 * Motor de Inteligencia Artificial Conversacional - Alarmas Chascomús
 * 
 * Reglas de Conversación Humana y Amigable:
 * 1. Capacidad de charla natural (saludos, agradecimientos, cómo estás, de dónde son, clima, despedidas).
 * 2. Conversación cálida y humana presentándose como el asesor virtual de Alarmas Chascomús.
 * 3. Si preguntan por productos o fichas técnicas (ej: Sirena Garnet MP-1000, A2K4), desglosa sus prestaciones.
 * 4. Si preguntan por precios, invita cordialmente a cotizar sin compromiso por WhatsApp.
 * 5. Si consultan por algo fuera de tema, responde amablemente y redirige la charla a la seguridad de su hogar o negocio.
 */

export async function generateAIResponse({ query, catalog, settings, faqs = [], manuals = [], chatHistory = [] }) {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const cleanQuery = query.toLowerCase().trim();
  const queryTokens = cleanQuery.split(/\s+/).filter(t => t.length > 2);

  // -------------------------------------------------------------
  // 1. SALUDOS, CÓMO ESTÁS Y CONVERSACIÓN SOCIAL / HUMANA
  // -------------------------------------------------------------
  const isGreeting = [
    "hola", "buen dia", "buen día", "buenas tardes", "buenas noches", 
    "buenas", "que tal", "qué tal", "como estas", "cómo estás", 
    "como te va", "cómo te va", "todo bien", "cómo andas", "como andas"
  ].some(g => cleanQuery === g || cleanQuery.startsWith(g) || cleanQuery.includes(g));

  if (isGreeting && !cleanQuery.includes("alarma") && !cleanQuery.includes("precio") && !cleanQuery.includes("camara") && !cleanQuery.includes("sirena")) {
    const greetingsResponses = [
      `¡Hola! ¿Cómo estás? Todo muy bien por acá. Soy el asistente virtual de **${settings.businessName}**.\n\nEstoy para asesorarte y responder cualquier duda que tengas sobre seguridad electrónica para tu casa, comercio o campo en Chascomús. ¿En qué te puedo dar una mano hoy?`,
      `¡Buenas! Qué tal, un gusto saludarte. Por acá todo excelente en **${settings.businessName}**.\n\nContame, ¿estás buscando información sobre algún equipo en particular o te gustaría asesoramiento para proteger tu propiedad?`
    ];
    
    // Seleccionar una respuesta variada
    const selectedGreeting = greetingsResponses[Math.floor(Math.random() * greetingsResponses.length)];

    return {
      text: selectedGreeting,
      source: "Atención al Cliente (Alarmas Chascomús)",
      isHandoffTriggered: false,
      suggestedActions: [
        { label: "🚨 Ver alarmas para el hogar", query: "¿Qué sistemas de alarmas tienen?" },
        { label: "📹 Consultar cámaras de seguridad", query: "¿Qué cámaras de seguridad ofrecen?" },
        { label: "💬 Hablar con un asesor humano", action: "open_whatsapp" }
      ]
    };
  }

  // -------------------------------------------------------------
  // 2. AGRADECIMIENTOS, DESPEDIDAS Y CORDIALIDAD
  // -------------------------------------------------------------
  const isThanks = ["gracias", "muchas gracias", "genial", "joya", "buenisimo", "buenísimo", "ok gracias", "chau", "adios", "adiós", "hasta luego"].some(t => cleanQuery.includes(t));

  if (isThanks && cleanQuery.length < 30) {
    return {
      text: `¡De nada! Es un placer ayudarte. Cualquier otra consulta sobre nuestros equipos o si querés que un técnico te haga una propuesta a medida, acá estoy. ¡Que tengas un excelente día!`,
      source: "Atención al Cliente",
      isHandoffTriggered: false,
      suggestedActions: [
        { label: "💬 Contactar por WhatsApp", action: "open_whatsapp" }
      ]
    };
  }

  // -------------------------------------------------------------
  // 3. PREGUNTAS SOBRE SU IDENTIDAD / QUIÉN ES
  // -------------------------------------------------------------
  const isIdentityQuery = ["quien sos", "quién sos", "sos un bot", "sos una ia", "sos humano", "con quien hablo", "con quién hablo"].some(id => cleanQuery.includes(id));

  if (isIdentityQuery) {
    return {
      text: `Soy el asistente virtual inteligente de **${settings.businessName}**. Fui capacitado con toda la información técnica de nuestras marcas oficiales (Garnet, Hikvision, Dahua, Paradox).\n\nPuedo ayudarte con fichas técnicas de equipos, resolver problemas comunes de alarmas o ponerte en contacto directo con nuestros especialistas si necesitás una visita en Chascomús.`,
      source: "Identidad Corporativa",
      isHandoffTriggered: false,
      suggestedActions: [
        { label: "🚨 Conocer nuestros servicios", query: "¿A qué se dedican en Alarmas Chascomús?" },
        { label: "💬 Hablar con un técnico en WhatsApp", action: "open_whatsapp" }
      ]
    };
  }

  // -------------------------------------------------------------
  // 4. PRECIOS / PRESUPUESTOS / COTIZACIONES
  // -------------------------------------------------------------
  const isPricingOrQuoteQuery = [
    "precio", "precios", "cuanto sale", "cuánto cuesta", "valor", "presupuesto", 
    "cotizar", "cotizacion", "cotización", "cuanto vale", "cuánto sale", "costo"
  ].some(kw => cleanQuery.includes(kw));

  if (isPricingOrQuoteQuery) {
    return {
      text: `En **${settings.businessName}** cada proyecto e instalación se **cotiza de forma personalizada**, ya que depende de los ambientes a cubrir, tipo de sensores y necesidades puntuales de tu propiedad.\n\n${settings.handoffMessage || "Te invitamos a dejarnos tus datos o escribirnos por WhatsApp para que un asesor te pase un presupuesto exacto y sin compromiso."}`,
      source: "Política Comercial (Alarmas Chascomús)",
      isHandoffTriggered: true,
      suggestedActions: [
        { label: "💬 Solicitar Presupuesto por WhatsApp", action: "open_whatsapp" },
        { label: "📋 Dejar mis datos de contacto", action: "open_form" }
      ]
    };
  }

  // -------------------------------------------------------------
  // 5. CARACTERÍSTICAS / FICHAS TÉCNICAS (ej: Sirena MP-1000 / Paneles)
  // -------------------------------------------------------------
  const isSpecsQuery = cleanQuery.includes("caracteristica") || 
                       cleanQuery.includes("características") || 
                       cleanQuery.includes("especificacion") || 
                       cleanQuery.includes("especificaciones") || 
                       cleanQuery.includes("ficha tecnica") || 
                       cleanQuery.includes("ficha técnica") || 
                       cleanQuery.includes("mp-1000") || 
                       cleanQuery.includes("mp1000") ||
                       cleanQuery.includes("mp-100") ||
                       cleanQuery.includes("mp100");

  if (isSpecsQuery) {
    const matchedItem = catalog.find(item => 
      item.name.toLowerCase().includes("mp-1000") || 
      item.name.toLowerCase().includes("mp-100") ||
      cleanQuery.includes(item.brand.toLowerCase()) ||
      queryTokens.some(t => item.name.toLowerCase().includes(t))
    );

    if (matchedItem) {
      let responseText = `Con gusto. Las **especificaciones técnicas oficiales** de la **${matchedItem.name}** (${matchedItem.brand}) son:\n\n`;
      responseText += `• *Descripción:* ${matchedItem.description}\n\n`;
      responseText += `**Prestaciones principales:**\n`;

      if (matchedItem.specs && matchedItem.specs.length > 0) {
        matchedItem.specs.forEach(spec => {
          responseText += `• ${spec}\n`;
        });
      }

      responseText += `\n¿Te gustaría que coordinemos una instalación o te coticemos este equipo para tu propiedad en Chascomús?`;

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
  // 6. FAQS CON VIDEO O RESOLUCIÓN DE PROBLEMAS TÉCNICOS
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
      responseText += `\n\n🎬 **Videotutorial Explicativo:** Podés ver la explicación paso a paso en el siguiente enlace:\n${matchedFaq.videoUrl}`;
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
  // 7. CONSULTA POR SIRENAS O MARCAS ESPECÍFICAS (Garnet, etc.)
  // -------------------------------------------------------------
  const isSirenQuery = cleanQuery.includes("sirena") || cleanQuery.includes("sirenas");
  const mentionsGarnet = cleanQuery.includes("garnet");

  if (isSirenQuery && (mentionsGarnet || catalog.some(i => i.brand === 'Garnet' && i.category === 'Sirenas'))) {
    const sirenItems = catalog.filter(i => i.brand === 'Garnet' && i.category === 'Sirenas');
    let responseText = `Sí, en **${settings.businessName}** trabajamos con toda la línea oficial de sirenas de **Garnet Technology**.\n\nContamos con modelos para distintas necesidades:\n\n`;

    sirenItems.forEach(item => {
      responseText += `• **${item.name}:** ${item.description}\n`;
    });

    responseText += `\n¿Te interesa conocer la ficha técnica en detalle de algún modelo en especial (por ejemplo la MP-1000)?`;

    return {
      text: responseText,
      source: "Catálogo Oficial (Garnet Technology)",
      productsMatched: sirenItems,
      isHandoffTriggered: false,
      suggestedActions: [
        { label: "📄 Ver ficha técnica MP-1000", query: "¿Cuáles son las características de la sirena MP-1000?" },
        { label: "💬 Solicitar Cotización", action: "open_whatsapp" }
      ]
    };
  }

  // -------------------------------------------------------------
  // 8. CONSULTA GENERAL DE FÁBRICA / MARCAS HOMOLOGADAS
  // -------------------------------------------------------------
  const allBrandsInCatalog = [...new Set(catalog.map(item => item.brand))];
  const matchedBrand = allBrandsInCatalog.find(b => cleanQuery.includes(b.toLowerCase()));

  if (matchedBrand || mentionsGarnet || cleanQuery.includes("marcas") || cleanQuery.includes("fabrica") || cleanQuery.includes("fábrica")) {
    const targetBrand = matchedBrand || (mentionsGarnet ? "Garnet" : "fábricas líderes");

    return {
      text: `Sí, trabajamos de forma oficial con **${targetBrand}**. Contamos con equipamiento homologado en paneles de alarma híbridos e inalámbricos, sirenas perimetrales y comunicadores.\n\n¿Buscás algún equipo o función en particular de esta marca?`,
      source: `Fábrica Verificada (${targetBrand})`,
      isHandoffTriggered: false,
      suggestedActions: [
        { label: `🚨 Ver sirenas ${targetBrand}`, query: `¿Tienen sirenas ${targetBrand}?` },
        { label: `📱 Ver paneles ${targetBrand}`, query: `¿Qué paneles de alarma ${targetBrand} tienen?` }
      ]
    };
  }

  // -------------------------------------------------------------
  // 9. CONVERSACIÓN GENERAL / RESPUESTA AMIGABLE POR DEFECTO
  // -------------------------------------------------------------
  return {
    text: `Entiendo lo que me consultás. Como asistente de **${settings.businessName}**, mi especialidad es asesorarte sobre alarmas, cámaras de seguridad, control de acceso y protección perimetral en Chascomús.\n\n¿Te gustaría que veamos alguna solución de seguridad para tu casa o negocio, o preferís hablar directamente con uno de nuestros asesores por WhatsApp?`,
    source: "Atención Consultiva (Alarmas Chascomús)",
    isHandoffTriggered: false,
    suggestedActions: [
      { label: "🚨 Consultar Sistemas de Alarma", query: "¿Qué sistemas de alarma tienen?" },
      { label: "📹 Consultar Cámaras de Seguridad", query: "¿Qué cámaras de seguridad tienen?" },
      { label: "💬 Hablar con un Asesor por WhatsApp", action: "open_whatsapp" }
    ]
  };
}
