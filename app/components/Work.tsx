"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { WorkSummary } from "../data/works";

interface WorkProps {
  works: WorkSummary[];
}

const Work = ({ works }: WorkProps) => {
  return (
    <section id="work" className="py-20 md:py-28 px-4 md:px-8">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Works</h2>
          <div className="w-20 h-1 bg-white mb-4"></div>
          <p className="text-gray-400 max-w-2xl">
            Selected case studies from professional engagements. Architecture,
            roles, and delivery context for each project.
          </p>
        </motion.div>

        <div className="grid gap-10 md:gap-12">
          {works.map((work, idx) => (
            <motion.article
              key={work.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.7 }}
              viewport={{ once: true, amount: 0.2 }}
              className="p-6 md:p-8 bg-zinc-900/80 rounded-xl border border-zinc-800 hover:border-zinc-600 transition-colors"
            >
              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                {work.thumbnail && (
                  <div className="md:w-96 shrink-0">
                    <Link
                      href={`/work/${work.slug}`}
                      className="block relative w-full aspect-video rounded-lg overflow-hidden bg-black/40"
                    >
                      <Image
                        src={work.thumbnail}
                        alt={work.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 24rem"
                      />
                    </Link>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold mb-1">
                        {work.title}
                      </h3>
                      {work.client && (
                        <p className="text-gray-400 text-sm">{work.client}</p>
                      )}
                      {work.year && (
                        <p className="text-gray-500 text-sm mt-1">{work.year}</p>
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
                        className="px-3 py-1 bg-black/70 text-gray-300 text-sm rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            href="/work"
            className="inline-block px-8 py-3 border border-white/30 rounded-md font-medium hover:bg-white/10 transition-colors"
          >
            View all case studies
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Work;
