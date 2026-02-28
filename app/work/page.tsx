import Link from "next/link";
import Image from "next/image";
import { getAllWorks } from "../lib/case-studies";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "Work | Nahid Reza",
  description:
    "Case studies and selected work—service management systems, full-stack applications, and production deployments.",
};

export default async function WorkPage() {
  const works = await getAllWorks();

  return (
    <main className="bg-black text-white min-h-screen">
      <Navbar />
      <section className="pt-28 pb-20 px-4 md:px-8">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Work</h1>
          <div className="w-20 h-1 bg-white mb-4"></div>
          <p className="text-gray-400 max-w-2xl mb-16">
            Selected case studies from professional engagements. Detailed
            architecture, roles, and delivery context for each project.
          </p>

          <div className="grid gap-12 md:gap-16">
            {works.map((work) => (
              <article
                key={work.slug}
                className="border border-zinc-800 rounded-xl p-6 md:p-8 hover:border-zinc-600 transition-colors"
              >
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                  {work.thumbnail && (
                    <div className="md:w-[27rem] shrink-0">
                      <Link
                        href={`/work/${work.slug}`}
                        className="block relative w-full aspect-video rounded-lg overflow-hidden bg-zinc-800"
                      >
                        <Image
                          src={work.thumbnail}
                          alt={work.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 27rem"
                        />
                      </Link>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold mb-1">
                          {work.title}
                        </h2>
                        {work.client && (
                          <p className="text-gray-400 text-sm">{work.client}</p>
                        )}
                        {work.year && (
                          <p className="text-gray-500 text-sm mt-1">
                            {work.year}
                          </p>
                        )}
                      </div>
                      <Link
                        href={`/work/${work.slug}`}
                        className="shrink-0 px-5 py-2.5 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition-colors text-center text-sm"
                      >
                        Read case study
                      </Link>
                    </div>
                    <p className="text-gray-300 mb-6">{work.shortDescription}</p>
                    <div className="flex flex-wrap gap-2">
                      {work.tech.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1 bg-zinc-900 text-gray-300 text-sm rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
