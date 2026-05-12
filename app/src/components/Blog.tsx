import Image from 'next/image';
import Link from 'next/link';
import Reveal from './Reveal';
import { blogPosts } from '@/lib/blog-posts';

/** Tarjetas del blog en la página de inicio (mismo contenido que /blog). */
export default function Blog() {
  const articles = blogPosts;

  return (
    <section id="blog" className="py-20 sm:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3">
            Blog VIGIA
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Contenido para quienes operan seguridad en{' '}
            <strong className="text-slate-800 font-semibold">
              sector público, empresa, conjunto residencial, comercio o educación
            </strong>
            : IA aplicada al video de <strong className="text-slate-800 font-semibold">cámaras que ya existen</strong>, sin
            confundir software con venta de hardware.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <Reveal
              key={article.slug}
              as="article"
              delay={(((index % 3) + 1) as 1 | 2 | 3)}
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 flex flex-col"
            >
              <Link href={`/blog/${article.slug}`} className="relative h-48 overflow-hidden block shrink-0">
                <Image
                  src={article.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-white/95 text-slate-900 text-xs font-semibold px-3 py-1 rounded-full">
                  {article.category}
                </span>
              </Link>

              <div className="p-6 flex flex-col flex-1">
                <p className="text-xs text-slate-500 mb-2">{article.date}</p>
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition leading-snug">
                  <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
                  {article.excerpt}
                </p>
                <Link
                  href={`/blog/${article.slug}`}
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-sm mt-auto"
                >
                  Leer más
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-block border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-blue-600 hover:text-white transition"
          >
            Ver todos los artículos
          </Link>
        </div>
      </div>
    </section>
  );
}
