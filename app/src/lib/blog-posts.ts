/**
 * Artículos del blog — metadatos + cuerpo para páginas dedicadas.
 */

export type BlogSection =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] };

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
      'Conecta marcas como Hikvision, Dahua o Axis vía ONVIF sin cambiar tus equipos: solo agregamos la capa de software en la nube.',
    image: '/images/vigia-blog-cameras.jpg',
    readTime: '5 min',
    sections: [
      {
        type: 'paragraph',
        text:
          'Gran parte de las instalaciones en comercios, conjuntos y sedes institucionales ya cuenta con cámaras IP compatibles con el estándar ONVIF y transmisión RTSP. Esa infraestructura es el punto de partida de PROJECT VIGIA: no necesitas un proyecto de renovación masiva para empezar a analizar video de forma inteligente.',
      },
      {
        type: 'heading',
        text: 'Por qué ONVIF importa',
      },
      {
        type: 'paragraph',
        text:
          'ONVIF define perfiles comunes para descubrimiento, streaming y metadatos entre fabricantes. Para el cliente significa menos vendor lock-in en la capa de captura: puedes mantener Dahua en acceso, Hikvision en patio y otra marca en ascensores, y aun así converger el análisis en una sola plataforma SaaS.',
      },
      {
        type: 'list',
        items: [
          'Menor CAPEX inicial al no exigir cambiar DVR ni cableado solo por nuestra integración.',
          'Tiempo de onboarding enfocado en credenciales de red y políticas de retención, no en obra civil.',
          'Escalado por número de flujos según tu plan de suscripción mensual.',
        ],
      },
      {
        type: 'paragraph',
        text:
          'Nuestro equipo técnico apoya la configuración inicial documentada en el proceso comercial: conexión de fuentes, prueba de latencia y capacitación breve en el panel web.',
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
