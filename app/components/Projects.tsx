"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FaExternalLinkAlt } from "react-icons/fa";
import type { ProjectSummary } from "../data/projects";

interface ProjectsProps {
  projects?: ProjectSummary[];
}

const Projects = ({ projects = [] }: ProjectsProps) => {
  const list = Array.isArray(projects) ? projects : [];
  return (
    <section id="projects" className="py-20 md:py-28 px-4 md:px-8 bg-[#000613]">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Projects</h2>
          <div className="w-20 h-1 bg-white mb-4"></div>
          <p className="text-gray-400 max-w-2xl">
            Selected work and personal projects I&apos;ve built or contributed
            to.
          </p>
        </motion.div>

        <div className="grid gap-10 md:gap-12">
          {list.map((project, idx) => (
            <motion.article
              key={project.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.7 }}
              viewport={{ once: true, amount: 0.2 }}
              className="p-6 md:p-8 bg-[#000613] rounded-xl border border-zinc-800 hover:border-zinc-600 transition-colors"
            >
              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                {project.thumbnail && (
                  <div className="md:w-96 shrink-0">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="block relative w-full aspect-video rounded-lg overflow-hidden bg-[#000613]"
                    >
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
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
                        {project.title}
                      </h3>
                      {project.client && (
                        <p className="text-gray-400 text-sm">{project.client}</p>
                      )}
                      {project.year && (
                        <p className="text-gray-500 text-sm mt-1">
                          {project.year}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="px-5 py-2.5 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition-colors text-center text-sm"
                      >
                        Read case study
                      </Link>
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 border border-zinc-600 rounded-md text-gray-300 hover:text-white hover:border-zinc-400 transition-colors"
                          title="Open live site"
                        >
                          <FaExternalLinkAlt size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6">{project.shortDescription}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 bg-[#000613] text-gray-300 text-sm rounded-full"
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
      </div>
    </section>
  );
};

export default Projects;
