"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

interface ProjectItem {
  title: string;
  description: string;
  problem: string;
  solution: string;
  impact: string;
  tech: string[];
  image?: string;
  github?: string;
  live?: string;
}

const Projects = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible-element");
          }
        });
      },
      { threshold: 0.1 }
    );

    const hiddenElements = document.querySelectorAll(".hidden-element");
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const projects: ProjectItem[] = [
    {
      title: "Web Hosting SaaS Platform",
      description:
        "A cloud hosting platform built from scratch on AWS with BLUE/GREEN deployment strategy.",
      problem:
        "Web applications often suffer from downtime during deployments, causing disruptions for users.",
      solution:
        "Developed a platform allowing seamless BLUE/GREEN deployments with zero downtime by duplicating environments and switching traffic only after the new environment is fully ready and tested.",
      impact:
        "Achieved 100% uptime during deployments, improved developer experience, and provided customers with reliable hosting.",
      tech: ["AWS", "Express.js", "Next.js", "Kubernetes", "Docker", "Node.js"],
      image: "/projects/storytelling.png",
    },
    {
      title: "AI-Powered Storytelling App",
      description:
        "Mobile application that generates personalized children's stories using AI.",
      problem:
        "Parents want personalized content for their children but creating custom stories is time-consuming.",
      solution:
        "Developed a backend infrastructure that integrates with NLP APIs to dynamically generate engaging, age-appropriate stories based on user preferences and reading history.",
      impact:
        "Enabled parents to create custom stories within seconds, resulting in higher engagement and improved reading habits among young users.",
      tech: [
        "Express.js",
        "Next.js",
        "Strapi CMS",
        "PostgreSQL",
        "Docker",
        "NLP APIs",
      ],
      image: "/projects/hosting_platform.png",
    },
  ];

  return (
    <section id="projects" className="py-20 md:py-28 px-4 md:px-8 bg-zinc-900">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Projects</h2>
          <div className="w-20 h-1 bg-white mb-8"></div>
        </motion.div>

        <div className="grid gap-20">
          {projects.map((project, idx) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.7 }}
              viewport={{ once: true, amount: 0.2 }}
              className="hidden-element"
            >
              <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                <div className="md:w-1/2">
                  <div className="relative w-full aspect-video bg-black/40 rounded-lg overflow-hidden">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-500">
                          No image available
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    {project.github && (
                      <Link
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        <FaGithub size={24} />
                      </Link>
                    )}
                    {project.live && (
                      <Link
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        <FaExternalLinkAlt size={22} />
                      </Link>
                    )}
                  </div>
                </div>

                <div className="md:w-1/2">
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-300 mb-6">{project.description}</p>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-2 text-gray-200">
                        Problem:
                      </h4>
                      <p className="text-gray-300">{project.problem}</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-2 text-gray-200">
                        Solution:
                      </h4>
                      <p className="text-gray-300">{project.solution}</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-2 text-gray-200">
                        Impact:
                      </h4>
                      <p className="text-gray-300">{project.impact}</p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-2">
                      Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-black/70 text-white text-sm rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
