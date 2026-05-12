import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { blogPosts } from '@/lib/blog-posts';

export const metadata: Metadata = {
  title: 'Blog | PROJECT VIGIA',
  description:
    'Artículos sobre vigilancia inteligente, ONVIF, IA aplicada al video y casos en Bucaramanga. Sin venta de hardware.',
};

export default function BlogIndexPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        <div className="border-b border-slate-200 bg-gradient-to-b from-slate-900 to-slate-800 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-3">
              Recursos
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Blog VIGIA</h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              IA sobre el video de cámaras que ya tienes. Sin confundir software con venta de equipos.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((article) => (
              <article
                key={article.slug}
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
                  <h2 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition leading-snug">
                    <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">{article.excerpt}</p>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-sm mt-auto"
                  >
                    Leer más
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
