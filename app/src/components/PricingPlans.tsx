import Link from 'next/link';
import Reveal from './Reveal';
import { marketingPlans } from '@/lib/subscription-plans';

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
            Modelo SaaS con suscripción mensual. Conectamos nuestra IA a las cámaras IP que ya
            tienes instaladas — <strong className="text-slate-800 font-semibold">no vendemos hardware</strong>. Atendemos
            a <strong className="text-slate-800 font-semibold">varios perfiles de cliente</strong> (público, privado,
            residencial, comercio, educación y más), ajustando el plan al número de flujos que
            quieras monitorear. Activación inmediata, sin contratos a largo plazo y con
            cancelación en cualquier momento.
          </p>
        </Reveal>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
          {marketingPlans.map((plan, index) => (
            <Reveal
              key={plan.slug}
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
                  href={`/checkout?plan=${plan.slug}`}
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
          <p className="text-sm text-slate-600 mb-3">
            <strong>Requisito:</strong> contar con cámaras IP compatibles con ONVIF o RTSP
            (Hikvision, Dahua, Axis y la mayoría de marcas del mercado). PROJECT VIGIA no
            comercializa cámaras: aprovechamos tu infraestructura existente.
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
