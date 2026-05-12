import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  getAllServices,
  getServiceBySlug,
  serviceSlugs,
} from '@/lib/services-content';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: 'Servicio | PROJECT VIGIA' };
  return {
    title: `${service.title} | PROJECT VIGIA`,
    description: service.shortDescription,
  };
}

export default async function ServicioPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const siblings = getAllServices().filter((s) => s.slug !== service.slug);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <section className="relative min-h-[340px] flex items-end border-b border-slate-200">
        <div className="absolute inset-0">
          <Image
            src={service.heroImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/85 to-slate-900/45" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12 pt-28 sm:pt-32">
          <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-2">
            Servicios
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 max-w-3xl">
            {service.title}
          </h1>
          <p className="text-lg text-slate-200 max-w-2xl leading-relaxed">{service.heroLead}</p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        {service.sections.map((block) => (
          <div key={block.heading} className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{block.heading}</h2>
            {block.paragraphs.map((p, i) => (
              <p key={i} className="text-slate-600 leading-relaxed mb-4 last:mb-0">
                {p}
              </p>
            ))}
          </div>
        ))}

        <div className="rounded-xl border border-blue-100 bg-blue-50/80 p-6 sm:p-8 mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">En la práctica incluye</h2>
          <ul className="space-y-3 text-slate-700">
            {service.highlights.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Ideal para</h2>
          <ul className="list-disc list-inside space-y-2 text-slate-600">
            {service.idealFor.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-200">
          <Link
            href="/plans"
            className="inline-flex justify-center px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg text-center"
          >
            Ver planes y precios
          </Link>
          <Link
            href="/#contact"
            className="inline-flex justify-center px-6 py-3 rounded-lg border-2 border-slate-300 text-slate-800 font-semibold hover:bg-slate-50 transition text-center"
          >
            Solicitar asesoría
          </Link>
          <Link
            href="/#what-we-do"
            className="inline-flex justify-center px-6 py-3 rounded-lg text-blue-600 font-semibold hover:text-blue-800 transition text-center sm:ml-auto"
          >
            ← Volver a servicios (inicio)
          </Link>
        </div>
      </article>

      <section className="bg-slate-50 border-y border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Otros servicios</h2>
          <div className="flex flex-wrap gap-3">
            {siblings.map((s) => (
              <Link
                key={s.slug}
                href={`/servicios/${s.slug}`}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-blue-400 hover:text-blue-700 transition"
              >
                {s.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
