import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  blogPosts,
  getPostBySlug,
  type BlogSection,
} from '@/lib/blog-posts';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Artículo | PROJECT VIGIA' };
  return {
    title: `${post.title} | Blog PROJECT VIGIA`,
    description: post.excerpt,
  };
}

function SectionBlock({ section }: { section: BlogSection }) {
  switch (section.type) {
    case 'paragraph':
      return (
        <p className="text-slate-600 leading-relaxed text-lg mb-6 last:mb-0">{section.text}</p>
      );
    case 'heading':
      return (
        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4 first:mt-0">{section.text}</h2>
      );
    case 'list':
      return (
        <ul className="list-disc list-inside space-y-3 text-slate-600 text-lg mb-8 ml-1">
          {section.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const others = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <article>
        <header className="relative min-h-[280px] sm:min-h-[360px] flex flex-col justify-end border-b border-slate-200">
          <div className="absolute inset-0">
            <Image
              src={post.image}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/85 to-slate-900/35" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-10 pt-24 sm:pt-28">
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
              <span className="inline-flex rounded-full bg-blue-500/90 px-3 py-1 text-xs font-semibold text-white">
                {post.category}
              </span>
              <span className="text-slate-300">{post.date}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-300">Lectura ~{post.readTime}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-white leading-tight tracking-tight">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-slate-200 leading-relaxed max-w-2xl">{post.excerpt}</p>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 mb-8 group"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-blue-200 bg-blue-50 transition group-hover:-translate-x-0.5">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </span>
            Volver al blog
          </Link>
          <p className="text-sm text-slate-500 mb-10 pb-10 border-b border-slate-200">
            Por el equipo PROJECT VIGIA · Bucaramanga, Colombia
          </p>

          <div className="prose-blog">
            {post.sections.map((section, i) => (
              <SectionBlock key={i} section={section} />
            ))}
          </div>

          <div className="mt-14 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/90 to-slate-50 p-8 sm:p-10">
            <p className="text-slate-800 font-semibold text-lg mb-2">
              ¿Quieres aplicar esto a tus cámaras existentes?
            </p>
            <p className="text-slate-600 mb-6">
              Suscripción SaaS por planes, sin venta de hardware. Te asesoramos en integración ONVIF y despliegue.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/plans"
                className="inline-flex justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-md"
              >
                Ver planes y precios
              </Link>
              <Link
                href="/#contact"
                className="inline-flex justify-center rounded-lg border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
              >
                Solicitar asesoría
              </Link>
            </div>
          </div>
        </div>
      </article>

      {others.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 mb-8">Más en el blog</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {others.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                >
                  <p className="text-xs font-semibold text-blue-600 mb-2">{p.category}</p>
                  <p className="font-semibold text-slate-900 group-hover:text-blue-700 transition leading-snug">
                    {p.title}
                  </p>
                  <p className="mt-2 text-sm text-slate-500 line-clamp-2">{p.excerpt}</p>
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/blog" className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                Ver todos los artículos →
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
