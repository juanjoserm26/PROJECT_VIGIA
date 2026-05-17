/**
 * Artículos del blog — metadatos + cuerpo para páginas dedicadas.
 */

export type BlogSection =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'links'; title: string; items: { label: string; href: string }[] };

export interface BlogPost {
  slug: string;
  category: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  readTime: string;
  sections: BlogSection[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'yolov8-vigilancia-detalle',
    category: 'IA en seguridad',
    title: 'YOLOv8 y vigilancia urbana: detección objetiva en tiempo real',
    date: '23 de abril de 2026',
    excerpt:
      'La detección en tiempo real con YOLOv8 convierte el video de tus cámaras ya instaladas en alertas accionables. PROJECT VIGIA no suministra hardware.',
    image: '/images/vigia-blog-detection.jpg',
    readTime: '6 min',
    sections: [
      {
        type: 'paragraph',
        text:
          'PROJECT VIGIA utiliza modelos de visión tipo YOLOv8 para analizar flujos de video provenientes de cámaras IP ya instaladas. La idea central es pasar de un sistema que solo graba a uno que prioriza eventos y reduce la dependencia de tener una persona mirando decenas de pantallas simultáneamente.',
      },
      {
        type: 'heading',
        text: 'Qué tipo de eventos apunta el modelo',
      },
      {
        type: 'paragraph',
        text:
          'En la línea técnica del proyecto se trabaja con detecciones objetivas —por ejemplo patrones asociados a agresiones físicas en curso o presencia visual de objetos clasificados por morfología— siempre sujetas a validación humana antes de escalamiento operativo. No se trata de perfilar a personas por “sospecha” subjetiva ni por apariencia; los comportamientos cotidianos no generan por sí solos una alerta.',
      },
      {
        type: 'paragraph',
        text:
          'Las alertas llegan al panel web y a los canales configurados según el plan (correo, WhatsApp u otros en niveles superiores), de modo que seguridad física o comunidad puedan focalizar la atención donde realmente hubo un disparo del modelo.',
      },
      {
        type: 'heading',
        text: 'Sin venta de cámaras',
      },
      {
        type: 'paragraph',
        text:
          'Somos software en la nube: integramos por ONVIF/RTSP con tus equipos existentes. El cliente conserva la propiedad del hardware y nosotros sumamos la capa de inteligencia y continuidad operativa compatible con el modelo SaaS descrito en nuestra propuesta comercial.',
      },
    ],
  },
  {
    slug: 'integracion-onvif-camaras',
    category: 'Tecnología',
    title: 'Integración ONVIF: aprovecha tus cámaras IP existentes',
    date: '8 de abril de 2026',
    excerpt:
      '¿Sirve cualquier cámara? No. Te explicamos IP vs analógica, ONVIF, requisitos y cómo PROJECT VIGIA se conecta sin vender hardware.',
    image: '/images/vigia-blog-cameras.jpg',
    readTime: '12 min',
    sections: [
      {
        type: 'paragraph',
        text:
          'Muchos clientes preguntan lo mismo antes de contratar: «¿cualquier cámara de vigilancia sirve?». La respuesta corta es no. PROJECT VIGIA es software en la nube: analizamos el video de cámaras que ya tienes, si cumplen requisitos técnicos. No vendemos ni instalamos equipos; sumamos inteligencia artificial sobre tu infraestructura existente.',
      },
      {
        type: 'heading',
        text: '¿Sirve cualquier cámara de vigilancia?',
      },
      {
        type: 'paragraph',
        text:
          'No es «cualquier» cámara. Hacen falta dispositivos con tecnología de red y, preferiblemente, el estándar abierto ONVIF. Las cámaras analógicas antiguas (cable coaxial hacia un DVR) no se integran directamente con nuestra plataforma: necesitan migración previa a IP.',
      },
      {
        type: 'heading',
        text: 'Cámaras cerradas vs cámaras ONVIF (abiertas)',
      },
      {
        type: 'paragraph',
        text:
          'Las cámaras «cerradas» solo hablan el idioma de su fabricante: una marca X suele funcionar pleno con grabador X. Las cámaras con ONVIF llevan firmware alineado a un protocolo global: actúan como traductor entre marcas. Así puedes tener Hikvision en acceso, Dahua en patio y otra marca en ascensores, y aun así centralizar el análisis en un solo servicio SaaS.',
      },
      {
        type: 'list',
        items: [
          'Cerradas: ecosistema propietario, menos flexibilidad al cambiar de proveedor de software.',
          'ONVIF: interoperabilidad entre fabricantes (Hikvision, Dahua, Axis y otros certificados).',
          'PROJECT VIGIA se conecta por ONVIF/RTSP a la capa de captura; tú conservas la propiedad del hardware.',
        ],
      },
      {
        type: 'heading',
        text: 'IP vs analógica: ¿cuál necesitas?',
      },
      {
        type: 'paragraph',
        text:
          'Un sistema IP envía video digital por red (Ethernet o Wi‑Fi) hacia un NVR o la nube; permite mayor resolución, acceso remoto y escalado. Las analógicas usan señal por cable coaxial hacia un DVR: son más simples y baratas al inicio, pero limitan calidad, analítica avanzada e integración con plataformas modernas como la nuestra.',
      },
      {
        type: 'image',
        src: '/images/blog/camara-red-vs-analogica.png',
        alt: 'Comparación entre cámara de red IP con NVR y app móvil frente a cámara analógica con DVR y monitor coaxial',
        caption:
          'Esquema comparativo: cámara de red (IP) con NVR y acceso móvil frente a cámara analógica con DVR y monitor local.',
      },
      {
        type: 'image',
        src: '/images/blog/ip-vs-analogica-comparativa.png',
        alt: 'Infografía que contrasta ventajas de cámaras IP frente a cámaras analógicas',
        caption:
          'Las cámaras IP suelen ofrecer mejor definición, cableado de red (PoE), analítica y escalabilidad frente al coaxial analógico.',
      },
      {
        type: 'heading',
        text: 'Requisitos para que tu cámara sea compatible',
      },
      {
        type: 'list',
        items: [
          'Debe ser cámara IP: digital, conectada por red (Ethernet/PoE o Wi‑Fi estable). Las analógicas puras no aplican.',
          'Certificación ONVIF del fabricante (perfiles S/T según funciones de streaming y metadatos).',
          'Conectividad mínima ~10 Mbps por cámara activa y acceso a la URL RTSP/ONVIF en tu red.',
          'Marcas habituales en Colombia: Hikvision, Dahua, Axis y equivalentes compatibles ONVIF.',
        ],
      },
      {
        type: 'heading',
        text: 'Cómo encaja tu instalación actual',
      },
      {
        type: 'paragraph',
        text:
          'En la mayoría de sitios las cámaras IP se conectan a un NVR o switch PoE en red local; desde ahí PROJECT VIGIA toma el flujo para procesarlo con IA en la nube. No reemplazamos tu grabador ni tus pantallas de guardia: añadimos detección objetiva, alertas y panel web.',
      },
      {
        type: 'image',
        src: '/images/blog/onvif-poe-sistema.png',
        alt: 'Diagrama de cámaras PoE IP conectadas a NVR, monitor, router y dispositivos móviles',
        caption:
          'Ejemplo de arquitectura IP: cámaras PoE, NVR/grabador en red y visualización local o remota.',
      },
      {
        type: 'image',
        src: '/images/blog/onvif-nvr-marcas.png',
        alt: 'Diagrama de conexión de cámaras IP a NVR con logos de marcas compatibles ONVIF',
        caption:
          'ONVIF permite combinar marcas distintas en un mismo ecosistema de videovigilancia.',
      },
      {
        type: 'heading',
        text: 'Por qué ONVIF importa para PROJECT VIGIA',
      },
      {
        type: 'paragraph',
        text:
          'ONVIF estandariza descubrimiento, streaming y metadatos entre fabricantes. Para ti significa menor vendor lock-in en captura y onboarding centrado en credenciales de red y políticas de retención, no en obra civil ni cambio masivo de CCTV.',
      },
      {
        type: 'list',
        items: [
          'Menor inversión inicial: no exigimos cambiar DVR ni cableado solo por integrarnos.',
          'Escalado por número de flujos según tu plan de suscripción mensual.',
          'Soporte técnico en conexión de fuentes, prueba de latencia y capacitación en el panel web.',
        ],
      },
      {
        type: 'paragraph',
        text:
          'Si aún no tienes cámaras IP ONVIF, te orientamos en la selección; la compra e instalación física siguen siendo responsabilidad del cliente o de su integrador de seguridad. Nosotros entregamos el análisis inteligente y la operación del servicio.',
      },
      {
        type: 'links',
        title: 'Referencias y lectura complementaria',
        items: [
          {
            label: '¿Qué son las cámaras IP ONVIF? — Jer-Tech',
            href: 'https://jer-tech.com/es/que-son-las-camaras-ip-onvif/',
          },
          {
            label: 'Sistema de cámaras IP vs tradicionales — Bokysee',
            href: 'https://bokysee.com/es/ip-camera-system-vs-traditional-cameras/',
          },
          {
            label: 'Cámaras IP vs analógicas — CCTV Barato',
            href: 'https://www.cctvbarato.com/es/blog/camaras-de-seguridad-y-videovigilancia/diferencias-entre-camaras-de-vigilancia-ip-wifi-y-analogicas-instalacion-y-ventajas',
          },
          {
            label: 'Cámaras IP vs analógicas (artículo LinkedIn / Hexacorp)',
            href: 'https://es.linkedin.com/pulse/c%C3%A1maras-ip-vs-anal%C3%B3gicas-cu%C3%A1l-es-la-mejor-opci%C3%B3n-para-aupoc',
          },
          {
            label: 'Sitio oficial ONVIF',
            href: 'https://www.onvif.org/',
          },
        ],
      },
    ],
  },
  {
    slug: 'piloto-barrio-uis-bucaramanga',
    category: 'Caso de éxito',
    title: 'Piloto barrio UIS: validación en entorno real de Bucaramanga',
    date: '16 de febrero de 2026',
    excerpt:
      'Cómo validamos PROJECT VIGIA en el sector cercano a la Universidad Industrial de Santander con apoyo de comercios y conjuntos residenciales.',
    image: '/images/vigia-service-innovation.jpg',
    readTime: '7 min',
    sections: [
      {
        type: 'paragraph',
        text:
          'El Plan de Negocios contempla una primera validación en Bucaramanga, con especial interés en el barrio cercano a la Universidad Industrial de Santander (UIS). Es un entorno mixto: circulación estudiantil, locales comerciales y unidades residenciales concentradas en pocas manzanas.',
      },
      {
        type: 'heading',
        text: 'Qué buscábamos demostrar',
      },
      {
        type: 'list',
        items: [
          'Que la integración ONVIF sea viable con cámaras reales de comercio y portería, no solo en laboratorio.',
          'Que el flujo de alertas y el panel sean usables por perfiles no técnicos (administración, conserjería).',
          'Que el costo operativo y el tiempo de reacción mejoren frente al monitoreo manual continuo.',
        ],
      },
      {
        type: 'paragraph',
        text:
          'Trabajar con actores del territorio —comercios, conjuntos y, en su momento, entidades de seguridad— permite ajustar el producto a la realidad de calle, no solo a la especificación. Ese aprendizaje alimenta la hoja de ruta de la plataforma y el despliegue progresivo de capacidades de analítica y reportes.',
      },
    ],
  },
  {
    slug: 'red-municipal-video-ia',
    category: 'Sector público',
    title: 'Red municipal de video: IA sobre cámaras ya instaladas por la ciudad',
    date: '11 de febrero de 2026',
    excerpt:
      'Bucaramanga ha invertido en una red de CCTV propiedad de la administración. PROJECT VIGIA aporta el software de análisis; las cámaras siguen siendo de la ciudad o del operador contratado.',
    image: '/images/vigia-service-monitoring.jpg',
    readTime: '6 min',
    sections: [
      {
        type: 'paragraph',
        text:
          'Las administraciones municipales han destinado recursos significativos a videovigilancia urbana. El siguiente paso natural es extraer valor del video: menos revisión reactiva de grabaciones y más capacidad de respuesta temprana ante incidentes.',
      },
      {
        type: 'heading',
        text: 'Rol de PROJECT VIGIA frente al hardware público',
      },
      {
        type: 'paragraph',
        text:
          'No vendemos ni instalamos el parque de cámaras: sumamos una capa SaaS de análisis inteligente sobre fuentes que ya están en la red institucional o que operan bajo esquemas de contratación existentes. La articulación con la Policía Nacional y centros de comando es parte del diseño de valor del proyecto, siempre como herramienta de apoyo a la decisión humana.',
      },
      {
        type: 'paragraph',
        text:
          'Los planes Enterprise contemplan integraciones más profundas (API, multicanal, SLA dedicado) cuando la entidad requiere convivencia con sistemas legados o reporting personalizado.',
      },
    ],
  },
  {
    slug: 'conjuntos-alertas-automaticas',
    category: 'Conjuntos residenciales',
    title: 'Vigilancia para conjuntos: alertas por WhatsApp y email automáticas',
    date: '5 de febrero de 2026',
    excerpt:
      'Reduce la dependencia del monitoreo humano constante. La administradora recibe notificación inmediata clasificada por tipo de evento.',
    image: '/images/vigia-service-ai.jpg',
    readTime: '5 min',
    sections: [
      {
        type: 'paragraph',
        text:
          'En conjuntos residenciales, la portería suele concentrar la vista de las cámaras, pero no puede vigilar todas las zonas comunes con la misma intensidad 24/7. Las alertas automáticas permiten que el mismo personal actúe más rápido cuando el modelo detecta un evento de interés.',
      },
      {
        type: 'heading',
        text: 'Qué recibe la administración',
      },
      {
        type: 'list',
        items: [
          'Notificaciones por correo en todos los planes con soporte por ese canal.',
          'En Plan Avanzado y superiores: WhatsApp y panel web para trazabilidad.',
          'Histórico consultable para reuniones de copropiedad y seguimiento de casos.',
        ],
      },
      {
        type: 'paragraph',
        text:
          'La propuesta es coherente con el segmento de clientes secundarios descrito en la estrategia: conjuntos con infraestructura instalada que buscan automatizar detección sin proyecto de cámaras nuevo.',
      },
    ],
  },
  {
    slug: 'analitica-patrones-riesgo',
    category: 'Analítica',
    title: 'Reportes de patrones de riesgo por zona y horario',
    date: '29 de enero de 2026',
    excerpt:
      'El módulo de analítica histórica identifica tendencias en eventos detectados. Decisiones operativas basadas en datos reales.',
    image: '/images/vigia-service-analytics.jpg',
    readTime: '5 min',
    sections: [
      {
        type: 'paragraph',
        text:
          'Además del tiempo real, la plataforma almacena eventos en base de datos relacional para consultas posteriores. Eso habilita cruces por zona, franja horaria y tipo de alerta, útiles para dirección de seguridad o comités de convivencia.',
      },
      {
        type: 'heading',
        text: 'Del dato a la decisión',
      },
      {
        type: 'paragraph',
        text:
          'Los planes superiores incorporan análisis de patrones y, en Enterprise, reportes personalizados e integración API con sistemas del cliente. El objetivo es apoyar presupuestos de refuerzo de cobertura, turnos de vigilancia o diálogo con la comunidad con evidencia cuantificable, no solo anécdotas.',
      },
      {
        type: 'paragraph',
        text:
          'El tratamiento de imágenes debe alinearse siempre a la normativa de datos personales vigente; el diseño del servicio contempla políticas de retención y acceso acordes al uso institucional o privado.',
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAllPostSlugs(): string[] {
  return blogPosts.map((p) => p.slug);
}
