import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getWorkBySlug, getAllSlugs } from "../../lib/case-studies";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) return { title: "Work | Nahid Reza" };
  return {
    title: `${work.frontmatter.title} | Case Study | Nahid Reza`,
    description: work.frontmatter.shortDescription,
  };
}

const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-2xl md:text-3xl font-bold text-gray-100 mt-12 mb-4 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-xl md:text-2xl font-bold text-gray-100 mt-10 mb-3">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-lg font-semibold text-gray-200 mt-6 mb-2">
      {children}
    </h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-gray-300 leading-relaxed mb-4">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal list-inside text-gray-300 space-y-2 mb-4">
      {children}
    </ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="text-gray-300">{children}</li>
  ),
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="overflow-x-auto my-6 rounded-lg border border-zinc-700">
      <table className="w-full text-left border-collapse">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead className="bg-zinc-900/80">{children}</thead>
  ),
  tbody: ({ children }: { children?: React.ReactNode }) => (
    <tbody className="divide-y divide-zinc-800">{children}</tbody>
  ),
  tr: ({ children }: { children?: React.ReactNode }) => (
    <tr className="border-b border-zinc-800">{children}</tr>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="py-3 px-4 text-gray-400 font-medium text-sm uppercase tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="py-3 px-4 text-gray-300">{children}</td>
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const { src, alt } = props;
    if (!src || typeof src !== "string") return null;
    return (
      <span className="block my-6 rounded-lg overflow-hidden border border-zinc-700">
        <Image
          src={src}
          alt={alt ?? "Diagram"}
          width={1200}
          height={630}
          className="w-full h-auto object-contain"
        />
      </span>
    );
  },
  hr: () => <hr className="border-zinc-700 my-8" />,
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-gray-200">{children}</strong>
  ),
};

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) notFound();

  const { frontmatter, content } = work;

  return (
    <main className="text-white min-h-screen">
      <Navbar />
      <article className="pt-28 pb-20 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-8"
          >
            ← Back to Work
          </Link>

          <header className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {frontmatter.title}
            </h1>
            {frontmatter.client && (
              <p className="text-gray-400">{frontmatter.client}</p>
            )}
            {frontmatter.year && (
              <p className="text-gray-500 text-sm mt-1">{frontmatter.year}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-6">
              {frontmatter.tech.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 bg-zinc-900/80 text-gray-300 text-sm rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          </header>

          <div className="prose-custom">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {content}
            </ReactMarkdown>
          </div>

          <div className="mt-16 pt-8 border-t border-zinc-800">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              ← Back to Work
            </Link>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
