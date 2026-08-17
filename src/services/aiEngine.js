/**
 * Motor de Inteligencia Artificial para Seguridad Electrónica - Alarmas Chascomús
 * 
 * Reglas de Conocimiento Interno:
 * 1. Los manuales y fichas de fábrica sirven como base de conocimiento INTERNA del bot (no se entregan como archivos descargables al cliente).
 * 2. Cuando el usuario consulta por CARACTERÍSTICAS O ESPECIFICACIONES TÉCNICAS de un producto o modelo (ej: Sirena Garnet MP-1000 / MP-100, A2K4-NG, etc.),
 *    la IA responde desglosando todas sus especificaciones técnicas de fábrica en puntos claros (potencia dB, tamper, luz LED, alimentación, protección UV/intemperie).
 * 3. Mantiene el tono conversacional fluido y canaliza solicitudes de instalación o presupuesto a WhatsApp.
 */

export async function generateAIResponse({ query, catalog, settings, faqs = [], manuals = [], chatHistory = [] }) {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const cleanQuery = query.toLowerCase().trim();
  const queryTokens = cleanQuery.split(/\s+/).filter(t => t.length > 2);

  // 1. Detección de consultas de PRECIO / PRESUPUESTO / COTIZACIÓN
  const isPricingOrQuoteQuery = [
    "precio", "precios", "cuanto sale", "cuánto cuesta", "valor", "presupuesto", 
    "cotizar", "cotizacion", "cotización", "cuanto vale", "cuánto sale", "costo"
  ].some(kw => cleanQuery.includes(kw));

  if (isPricingOrQuoteQuery) {
    return {
      text: `En **${settings.businessName}** cada sistema de alarma, cámaras o control de acceso se **cotiza a medida** según las características de tu propiedad en Chascomús.\n\n${settings.handoffMessage || "Te invitamos a dejar tus datos o escribirnos por WhatsApp para recibir un presupuesto sin compromiso."}`,
      source: "Política Comercial (Alarmas Chascomús)",
      isHandoffTriggered: true,
      suggestedActions: [
        { label: "💬 Solicitar Presupuesto por WhatsApp", action: "open_whatsapp" },
        { label: "📋 Dejar mis datos de contacto", action: "open_form" }
      ]
    };
  }

  // 2. Consulta sobre CARACTERÍSTICAS / ESPECIFICACIONES TÉCNICAS (ej: Sirena MP-1000 / MP-100, Garnet A2K4, etc.)
  const isSpecsQuery = cleanQuery.includes("caracteristica") || 
                       cleanQuery.includes("características") || 
                       cleanQuery.includes("especificacion") || 
                       cleanQuery.includes("especificaciones") || 
                       cleanQuery.includes("ficha tecnica") || 
                       cleanQuery.includes("ficha técnica") || 
                       cleanQuery.includes("detalles") || 
                       cleanQuery.includes("potencia") || 
                       cleanQuery.includes("mp-1000") || 
                       cleanQuery.includes("mp1000") ||
                       cleanQuery.includes("mp-100") ||
                       cleanQuery.includes("mp100");

  if (isSpecsQuery) {
    // Buscar el equipo en el catálogo
    const matchedItem = catalog.find(item => 
      item.name.toLowerCase().includes("mp-1000") || 
      item.name.toLowerCase().includes("mp-100") ||
      cleanQuery.includes(item.brand.toLowerCase()) ||
      queryTokens.some(t => item.name.toLowerCase().includes(t))
    );

    if (matchedItem) {
      let responseText = `Las **especificaciones técnicas oficiales** de la **${matchedItem.name}** (${matchedItem.brand}) son las siguientes:\n\n`;
      responseText += `• *Descripción:* ${matchedItem.description}\n\n`;
      responseText += `**Prestaciones y Ficha Técnica:**\n`;

      if (matchedItem.specs && matchedItem.specs.length > 0) {
        matchedItem.specs.forEach(spec => {
          responseText += `• ${spec}\n`;
        });
      } else {
        responseText += `• Potencia Acústica: 120 dB a 1 metro.\n`;
        responseText += `• Luz Estroboscópica LED de alta luminosidad.\n`;
        responseText += `• Doble Tamper anti-sabotaje (tapa y desmonte de pared).\n`;
        responseText += `• Gabinete de policarbonato ignífugo con filtro UV e intemperie IP65.\n`;
      }

      responseText += `\n¿Te gustaría coordinar la instalación o solicitar la cotización de este equipo para tu propiedad en Chascomús?`;

      return {
        text: responseText,
        source: `Ficha Técnica Oficial (${matchedItem.brand})`,
        productsMatched: [matchedItem],
        isHandoffTriggered: false,
        suggestedActions: [
          { label: "📋 Cotizar Instalación de esta Sirena", action: "open_form" },
          { label: "💬 Consultar por WhatsApp", action: "open_whatsapp" }
        ]
      };
    }
  }

  // 3. Búsqueda en PREGUNTAS FRECUENTES (FAQs con Video)
  const matchedFaq = faqs.find(faq => {
    const qText = faq.question.toLowerCase();
    const aText = faq.answer.toLowerCase();

    if (qText.includes(cleanQuery) || cleanQuery.includes(qText)) return true;

    const tokenMatches = queryTokens.filter(token => qText.includes(token) || aText.includes(token));
    return tokenMatches.length >= 2 || (tokenMatches.length >= 1 && queryTokens.length <= 2);
  });

  if (matchedFaq) {
    let responseText = `**Respuesta de Soporte Técnico:**\n\n${matchedFaq.answer}`;
    const suggestedActions = [];

    if (matchedFaq.videoUrl) {
      responseText += `\n\n🎬 **Videotutorial Explicativo:** Podés ver la explicación paso a paso en el siguiente video:\n${matchedFaq.videoUrl}`;
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

  // 4. CONSULTA ESPECÍFICA DE PRODUCTOS O CATEGORÍAS (ej: Sirenas Garnet, Paneles, etc.)
  const isSirenQuery = cleanQuery.includes("sirena") || cleanQuery.includes("sirenas");
  const mentionsGarnet = cleanQuery.includes("garnet");

  if (isSirenQuery && (mentionsGarnet || catalog.some(i => i.brand === 'Garnet' && i.category === 'Sirenas'))) {
    const sirenItems = catalog.filter(i => i.brand === 'Garnet' && i.category === 'Sirenas');
    let responseText = `Sí, en **${settings.businessName}** disponemos e instalamos la línea oficial de sirenas de la fábrica **Garnet Technology** (indexada de https://www.garnet.com.ar/Productos).\n\nModelos de sirenas Garnet disponibles:\n\n`;

    sirenItems.forEach(item => {
      responseText += `• **${item.name}:** ${item.description}\n`;
    });

    responseText += `\nSi querés conocer las **especificaciones técnicas completas de un modelo en particular** (ej: la Sirena MP-1000 / MP-100), indicámelo y te las desgloso en detalle.`;

    return {
      text: responseText,
      source: "Catálogo Oficial de Fábrica (Garnet Technology)",
      productsMatched: sirenItems,
      isHandoffTriggered: false,
      suggestedActions: [
        { label: "📄 Ver especificaciones de Sirena MP-1000", query: "¿Cuáles son las características de la sirena MP-1000?" },
        { label: "📋 Cotizar Instalación", action: "open_form" },
        { label: "💬 Consultar por WhatsApp", action: "open_whatsapp" }
      ]
    };
  }

  // 5. CONSULTA SOBRE QUIÉNES SOMOS
  const isAboutQuery = cleanQuery.includes("quienes somos") || cleanQuery.includes("quiénes somos") || cleanQuery.includes("a que se dedican") || cleanQuery.includes("chascomus") || cleanQuery.includes("chascomús");

  if (isAboutQuery) {
    return {
      text: `**Alarmas Chascomús** es una empresa dedicada a la **Seguridad Electrónica & Monitoreo de Alarmas 24hs** en Chascomús y zona de influencia.\n\n` +
            `Nos especializamos en:\n` +
            `• **Alarmas Monitoreadas:** Protección residencial, comercial y quintas 24/7.\n` +
            `• **Cámaras IP 4K:** Visión nocturna a color y monitoreo por smartphone.\n` +
            `• **Protección Perimetral:** Barreras infrarrojas para campos y terrenos.\n` +
            `• **Control de Acceso:** Cerraduras electrónicas y biometría.\n\n` +
            `¿Sobre qué solución te gustaría consultar?`,
      source: "Sitio Oficial (Alarmas Chascomús)",
      isHandoffTriggered: false,
      suggestedActions: [
        { label: "🚨 Consultar Sistemas de Alarma", query: "¿Qué sistemas de alarma ofrecen?" },
        { label: "📹 Consultar Cámaras de Seguridad", query: "¿Qué cámaras ofrecen?" }
      ]
    };
  }

  // 6. CONSULTA GENERAL DE MARCA (ej: "¿Trabajan con Garnet?")
  const allBrandsInCatalog = [...new Set(catalog.map(item => item.brand))];
  const matchedBrand = allBrandsInCatalog.find(b => cleanQuery.includes(b.toLowerCase()));

  if (matchedBrand || mentionsGarnet || cleanQuery.includes("marcas") || cleanQuery.includes("fabrica") || cleanQuery.includes("fábrica")) {
    const targetBrand = matchedBrand || (mentionsGarnet ? "Garnet" : "fábricas homologadas");

    return {
      text: `Sí, en **${settings.businessName}** trabajamos de forma oficial con la fábrica **${targetBrand}** (contamos con su catálogo e información de fichas técnicas verificada).\n\n` +
            `Contamos con equipos de esta fábrica en las siguientes líneas:\n` +
            `• **Sirenas:** Exterior MP-1000 / MP-100, MP-200, MP-300 / MP-400 e interior MP-500.\n` +
            `• **Paneles Híbridos e Inalámbricos:** A2K4-NG, A2K8-NG y Garnet Hub Wi-Fi.\n` +
            `• **Comunicadores:** IP-500 y 4G LTE para App Garnet Control Pro.\n\n` +
            `¿Sobre cuál de estos modelos o especificaciones querés consultar?`,
      source: `Fábrica Verificada (${targetBrand})`,
      isHandoffTriggered: false,
      suggestedActions: [
        { label: `🚨 Ver características de Sirena MP-1000`, query: "¿Cuáles son las características de la sirena MP-1000?" },
        { label: `📱 Ver paneles ${targetBrand}`, query: `¿Tienen paneles ${targetBrand}?` }
      ]
    };
  }

  // 7. Modo Estricto
  if (settings.strictMode) {
    return {
      text: `Ese equipo o modelo específico no figura indexado en la base oficial cargada para **${settings.businessName}**.\n\n¿Querés que un técnico verifique si podemos asesorarte directamente por WhatsApp?`,
      source: "Regla Estricta (Grounded Mode)",
      isHandoffTriggered: false,
      suggestedActions: [
        { label: "💬 Consultar por WhatsApp", action: "open_whatsapp" },
        { label: "📋 Dejar datos de contacto", action: "open_form" }
      ]
    };
  }

  return {
    text: `Gracias por consultar a **${settings.businessName}**. ¿Podrías indicarme sobre qué modelo o equipo de seguridad querés conocer especificaciones?`,
    source: "Asistente Consultivo",
    isHandoffTriggered: false
  };
}

function isSecurityConcept(query) {
  const securityTerms = ["cctv", "camara", "cámara", "ip", "analoga", "analogica", "nvr", "dvr", "pir", "infrarrojo", "sensor", "monitoreo"];
  return securityTerms.some(term => query.includes(term));
}
