import Link from 'next/link';
import Reveal from './Reveal';

interface Plan {
  name: string;
  description: string;
  price: string;
  priceNote?: string;
  features: string[];
  segment: string;
  highlighted?: boolean;
}

const plans: Plan[] = [
  {
    name: 'Plan Básico',
    description: 'Pequeños comercios y tiendas',
    price: '$350.000',
    priceNote: 'COP / mes',
    segment: 'Hasta 4 cámaras IP',
    features: [
      'Hasta 4 cámaras IP (ONVIF/RTSP)',
      'Detección básica: robos y atracos',
      'Notificaciones por email',
      'Panel web de visualización',
      'Soporte por correo (48h)',
      'Almacenamiento de eventos 30 días',
    ],
  },
  {
    name: 'Plan Avanzado',
    description: 'Conjuntos residenciales e instituciones educativas',
    price: '$950.000',
    priceNote: 'COP / mes',
    segment: 'Hasta 16 cámaras IP',
    features: [
      'Hasta 16 cámaras IP (ONVIF/RTSP)',
      'Detección avanzada + análisis de patrones',
      'Alertas por email, WhatsApp y panel web',
      'Análisis histórico por zona y horario',
      'Soporte prioritario (24h)',
      'Almacenamiento de eventos 90 días',
      'Reportes mensuales automáticos',
    ],
    highlighted: true,
  },
  {
    name: 'Plan Enterprise',
    description: 'Policía Nacional, grandes empresas y municipios',
    price: '$2.500.000+',
    priceNote: 'COP / mes',
    segment: 'Cámaras ilimitadas',
    features: [
      'Cámaras IP ilimitadas',
      'Detección completa + reportes personalizados',
      'API de integración con sistemas del cliente',
      'Multicanal: email, WhatsApp, SMS, webhook',
      'Soporte dedicado 24/7 + SLA personalizado',
      'Almacenamiento ilimitado de eventos',
      'Facturación a 30 días',
      'Configuración on-premise opcional',
    ],
  },
];

export default function PricingPlans() {
  return (
    <section id="pricing" className="py-20 sm:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Reveal className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3">
            Planes de suscripción
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Modelo SaaS con suscripción mensual. Demo gratuita de 30 días para los primeros
            clientes piloto. Sin contratos a largo plazo, sin compra de hardware adicional.
          </p>
        </Reveal>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan, index) => (
            <Reveal
              key={index}
              delay={((index + 1) as 1 | 2 | 3)}
              className={`relative rounded-lg transition-all duration-300 ${
                plan.highlighted
                  ? 'md:scale-105 bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-blue-500 shadow-2xl hover:-translate-y-1'
                  : 'bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1'
              }`}
            >
              {/* Popular Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Más Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Plan Name */}
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    plan.highlighted ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mb-1 ${
                    plan.highlighted ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {plan.description}
                </p>
                <p
                  className={`text-xs uppercase tracking-wider font-semibold mb-6 ${
                    plan.highlighted ? 'text-blue-300' : 'text-blue-600'
                  }`}
                >
                  {plan.segment}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <span
                    className={`text-4xl font-bold ${
                      plan.highlighted ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`ml-2 text-sm ${
                      plan.highlighted ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {plan.priceNote}
                  </span>
                </div>

                {/* CTA Button */}
                <Link
                  href={`/checkout?plan=${plan.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`w-full block text-center py-3 px-4 rounded-md font-semibold transition-all mb-8 ${
                    plan.highlighted
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  Solicitar plan
                </Link>

                {/* Features List */}
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <span
                        className={`font-bold mt-1 ${
                          plan.highlighted ? 'text-blue-400' : 'text-blue-600'
                        }`}
                      >
                        ✓
                      </span>
                      <span
                        className={`text-sm ${
                          plan.highlighted ? 'text-slate-200' : 'text-slate-700'
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-16 max-w-3xl mx-auto">
          <p className="text-slate-700 text-base mb-2">
            Todos los planes incluyen <strong>configuración inicial</strong>, capacitación virtual
            y SLA de disponibilidad del 99.5%.
          </p>
          <p className="text-sm text-slate-500">
            Pago vía PSE, transferencia bancaria o tarjeta. Programa de referidos: 15% de
            descuento por cliente nuevo. {' '}
            <a href="#contact" className="text-blue-600 hover:text-blue-700 font-semibold">
              Solicita una asesoría personalizada
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
