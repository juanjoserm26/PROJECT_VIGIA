/**
 * Contenido de las páginas de servicio, alineado al documento guía
 * «Plan de Negocios – Project Vigia» (módulos completos).
 */

export const serviceSlugs = [
  'vigilancia-con-ia',
  'monitoreo-en-tiempo-real',
  'analitica-avanzada',
  'innovacion',
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

export interface ServiceDetail {
  slug: ServiceSlug;
  title: string;
  shortDescription: string;
  heroImage: string;
  heroLead: string;
  sections: { heading: string; paragraphs: string[] }[];
  highlights: string[];
  idealFor: string[];
}

const services: Record<ServiceSlug, ServiceDetail> = {
  'vigilancia-con-ia': {
    slug: 'vigilancia-con-ia',
    title: 'Vigilancia con IA',
    shortDescription:
      'Modelos YOLOv8 analizan el video de tus cámaras IP para detectar eventos delictivos en curso y generar alertas tempranas al panel del cliente.',
    heroImage: '/images/vigia-service-ai.jpg',
    heroLead:
      'A diferencia del CCTV que solo graba, PROJECT VIGIA automatiza el análisis del video para priorizar alertas y acortar los tiempos de reacción — siempre como apoyo al criterio humano y a las autoridades.',
    sections: [
      {
        heading: 'Detección con visión por computador',
        paragraphs: [
          'La plataforma utiliza modelos de inteligencia artificial tipo YOLOv8 (Ultralytics) sobre OpenCV para procesar flujos en tiempo real. El objetivo del proyecto es contribuir a la detección oportuna y a la respuesta temprana ante robos, atracos, riñas y agresiones físicas, apoyando la capacidad de respuesta de entidades como la Policía Nacional y mejorando la seguridad en entornos urbanos.',
          'El sistema no sustituye la labor institucional: actúa como herramienta de apoyo para priorizar alertas, optimizar recursos y mejorar la toma de decisiones operativas.',
        ],
      },
      {
        heading: 'Transparencia: qué sí clasifica el modelo (y qué no)',
        paragraphs: [
          'Es importante precisar que PROJECT VIGIA no etiqueta “actividades sospechosas” en un sentido subjetivo ni por apariencia física. El enfoque documentado identifica únicamente tipos de eventos objetivos y medibles: la presencia visual de armas (clasificadas por tipo según su morfología) y patrones de movimiento corporal asociados a agresiones físicas en curso —por ejemplo forcejeos, golpes o derribo de personas.',
          'Conductas como permanecer quieto, caminar en grupo o vestir de determinada manera no activan alertas por sí solas. Dado que la detección se basa en criterios visuales y no en la legalidad de los objetos detectados, toda alerta es presentada a un operador humano, quien toma la decisión final —incluida la de contactar a las autoridades.',
        ],
      },
      {
        heading: 'Planes y profundidad de detección',
        paragraphs: [
          'Según el portafolio comercial: el Plan Básico contempla detección básica orientada a robos y atracos; el Plan Avanzado incorpora detección avanzada y análisis de patrones; el Plan Enterprise suma detección completa, reportes personalizados y API para integrarse con sistemas del cliente.',
        ],
      },
    ],
    highlights: [
      'Integración con cámaras IP ya instaladas mediante estándar ONVIF y transmisión RTSP (p. ej. Hikvision, Dahua, Axis).',
      'Clasificación de alertas por tipo de evento y nivel de riesgo; canal de notificación según plan (correo; en planes superiores también WhatsApp y panel web).',
      'Procesamiento en la nube con infraestructura que permite analizar múltiples flujos simultáneamente.',
      'Alineado al modelo SaaS y a los segmentos de cliente público (Policía y entidades de seguridad), privado (conjuntos, comercios, universidades) y comunidad beneficiaria.',
    ],
    idealFor: [
      'Cliente directo institucional: Policía Nacional y centros de monitoreo que supervisan muchas fuentes a la vez.',
      'Clientes secundarios: conjuntos residenciales, comercios e instituciones educativas con videovigilancia pero alta dependencia del monitoreo manual.',
      'Entornos piloto y urbanos como el barrio cercano a la UIS en Bucaramanga, donde el proyecto valida la solución en un contexto residencial, comercial y educativo mixto.',
    ],
  },
  'monitoreo-en-tiempo-real': {
    slug: 'monitoreo-en-tiempo-real',
    title: 'Monitoreo en tiempo real',
    shortDescription:
      'Panel web para visualizar flujos de video, gestionar alertas y supervisar el estado del servicio sin sustituir tus cámaras: acceso desde navegador con integración ONVIF.',
    heroImage: '/images/vigia-service-monitoring.jpg',
    heroLead:
      'Centraliza la observación y las alertas generadas por la IA en un único panel accesible desde internet: compatible con Chrome, Firefox y Edge, sin instalar software adicional en el equipo del cliente.',
    sections: [
      {
        heading: 'Panel web y operación',
        paragraphs: [
          'La propuesta de valor del plan incluye un panel intuitivo para visualización y gestión de alertas (Plan de Negocios, sección oportunidades / solución). Desde ahí el cliente consulta eventos en vivo y el histórico almacenado en base de datos para facilitar la toma de decisiones.',
          'Las necesidades del mercado que el documento prioriza incluyen: reducir la dependencia del monitoreo humano exclusivamente mirando pantallas, recibir alertas tempranas automatizadas y optimizar el uso de cámaras ya instaladas transformándolas en monitoreo activo.',
        ],
      },
      {
        heading: 'Condiciones técnicas mínimas',
        paragraphs: [
          'La ficha técnica del producto establece conexión a internet de mínimo 10 Mbps por cámara activa, cámaras IP compatibles con ONVIF y acceso por navegador web. El cliente no requiere comprar hardware adicional para adoptar el servicio.',
        ],
      },
      {
        heading: 'Correspondencia con los planes',
        paragraphs: [
          'Las notificaciones evolucionan con el plan: correo en Plan Básico; correo, WhatsApp y panel web en Plan Avanzado; en Plan Enterprise, canal multicanal e integración con sistemas del cliente.',
        ],
      },
    ],
    highlights: [
      'Visualización de información en tiempo real para facilitar decisiones operativas.',
      'Compatible con integración ONVIF / RTSP sobre infraestructura existente.',
      'SLA de disponibilidad del servicio del 99,5 % según condiciones comerciales del plan.',
      'Soporte técnico por correo y WhatsApp en horario laboral; actualizaciones de plataforma incluidas en la suscripción.',
    ],
    idealFor: [
      'Administradores de conjuntos y comercios que hoy dependen de portería o personal de sala para vigilar pantallas.',
      'Empresas de seguridad electrónica y mesas de monitoreo que buscan automatizar la detección y focalizar la atención humana.',
      'Instituciones educativas con múltiples puntos de cámara y necesidad de respuesta coordinada.',
    ],
  },
  'analitica-avanzada': {
    slug: 'analitica-avanzada',
    title: 'Analítica avanzada',
    shortDescription:
      'Los eventos detectados se almacenan en base de datos relacional para consulta histórica, patrones de riesgo por zona y horario, y reportes ejecutivos.',
    heroImage: '/images/vigia-service-analytics.jpg',
    heroLead:
      'Convierte registros de incidentes en información estructurada: identifica patrones en zonas específicas y franjas horarias y apoya auditorías y decisiones de seguridad ciudadana o corporativa.',
    sections: [
      {
        heading: 'Base de datos y análisis histórico',
        paragraphs: [
          'Según la solución descrita en el Plan de Negocios, la plataforma almacena los eventos en una base de datos relacional (PostgreSQL en la composición tecnológica), lo que permite organizar, filtrar y consultar lo ocurrido después del hecho.',
          'Esta capacidad responde directamente a necesidades formuladas en el estudio de mercado: contar con información estructurada para identificar patrones de riesgo y disponer de análisis histórico de eventos, no solo grabación pasiva.',
        ],
      },
      {
        heading: 'Reportes y planes superiores',
        paragraphs: [
          'El proceso de producción del servicio incluye la generación periódica de reportes mensuales de eventos y análisis de patrones mediante el panel y herramientas de reporte.',
          'El Plan Avanzado incorpora detección avanzada más análisis de patrones; el Plan Enterprise añade reportes personalizados y API para integrar la información con los sistemas del cliente.',
        ],
      },
      {
        heading: 'Normativa y uso responsable de datos',
        paragraphs: [
          'El proyecto debe cumplir la Ley 1581 de 2012 y el Decreto 1377 de 2013 en cuanto a tratamiento de imágenes y video de personas, además del marco de delitos informáticos (Ley 1273 de 2009). La analítica se diseña para fines de seguridad y gestión del riesgo con trazabilidad.',
        ],
      },
    ],
    highlights: [
      'Consulta histórica de eventos clasificados para soporte a investigaciones internas o coordinación con autoridades.',
      'Identificación de patrones por zona y horario para ajustar rutas, cobertura de cámaras o políticas de respuesta.',
      'Reportes ejecutivos para dirección u órganos de vigilancia sin revisar manualmente todas las horas de video.',
      'Escalabilidad acorde al volumen de clientes y cámaras proyectados en el plan de negocio.',
    ],
    idealFor: [
      'Alcaldías y operadores de videovigilancia urbana que ya cuentan con cientos de cámaras (referencia de mercado local en el documento).',
      'Gerencias que deben demostrar resultados y cumplimiento ante junta directiva o comunidad.',
      'Organizaciones que requieren integración vía API en el Plan Enterprise.',
    ],
  },
  innovacion: {
    slug: 'innovacion',
    title: 'Innovación',
    shortDescription:
      'Software como servicio (SaaS) en desarrollo de sistemas informáticos (CIIU 6201): suscripción mensual, sin licencias perpetuas obligatorias ni reemplazo masivo de infraestructura de captura.',
    heroImage: '/images/vigia-service-innovation.jpg',
    heroLead:
      'PROJECT VIGIA se plantea como un servicio SaaS de análisis inteligente de video con IA, compatible con cámaras existentes mediante ONVIF —una propuesta diferenciada frente a esquemas dominados por hardware cerrado o soluciones enterprise de precio elevado.',
    sections: [
      {
        heading: 'Modelo de negocio y diferenciación',
        paragraphs: [
          'El cliente no adquiere licencias perpetuas ni hardware adicional obligatorio: paga una suscripción mensual según el plan (Básico, Avanzado, Enterprise), accediendo desde cualquier dispositivo con internet.',
          'El documento posiciona el proyecto frente a referencias como March Networks (precios altos, orientación a grandes empresas) o ecosistemas tipo Hikvision centrados en hardware propietario: PROJECT VIGIA apuesta por software abierto al contexto colombiano, integración con IP existente y precios de entrada acordes al mercado local.',
        ],
      },
      {
        heading: 'Composición tecnológica (referencia Plan de Negocios)',
        paragraphs: [
          'Backend: Python 3.11, FastAPI, YOLOv8 (Ultralytics), OpenCV. Frontend: React y TypeScript. Base de datos: PostgreSQL. Infraestructura: Docker y nube (AWS o GCP). Protocolos de integración: ONVIF y RTSP. Seguridad: TLS/SSL, autenticación JWT, respaldos y políticas de retención configurables.',
        ],
      },
      {
        heading: 'Contexto territorial y escalabilidad',
        paragraphs: [
          'La sede principal del proyecto es Bucaramanga; el piloto se enfoca en el entorno del barrio cercano a la UIS, con articulación potencial con la Policía y entidades de seguridad. La infraestructura cloud inicial contempla escalar clientes y cámaras activas conforme crece la demanda.',
        ],
      },
    ],
    highlights: [
      'Enfoque SaaS (CIIU 6201) complementado por consultoría e implementación (CIIU 6202) y procesamiento/datos (CIIU 6311) según el plan de negocio.',
      'Demostraciones gratuitas de 30 días para nuevos clientes y estrategias de venta directa y alianzas con integradores locales.',
      'Actualizaciones de software incluidas sin costo adicional en la suscripción.',
      'Propuesta alineada con la modernización de videovigilancia sin descartar la base de cámaras ya instalada en la ciudad.',
    ],
    idealFor: [
      'Entidades públicas y privadas que buscan modernizar videovigilancia sin proyecto masivo de renovación de CCTV.',
      'Integradores de seguridad que pueden actuar como canal de distribución indirecta.',
      'Equipos de TI que valoran stack actual (FastAPI, React, PostgreSQL, Docker) y despliegue en nube con GPU para inferencia.',
    ],
  },
};

export function isServiceSlug(s: string): s is ServiceSlug {
  return (serviceSlugs as readonly string[]).includes(s);
}

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  if (!isServiceSlug(slug)) return undefined;
  return services[slug];
}

export function getAllServices(): ServiceDetail[] {
  return serviceSlugs.map((slug) => services[slug]);
}
