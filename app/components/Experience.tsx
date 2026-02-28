"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

interface ExperienceItem {
  company: string;
  position: string;
  period: string;
  location: string;
  highlights: string[];
  tech: string;
}

const Experience = () => {
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

  const experiences: ExperienceItem[] = [
    {
      company: "Counterfoil",
      position: "Lead Software Engineer",
      period: "September 2024 - Present",
      location: "New York, USA (Remote)",
      tech: "Django, FastAPI, Docker, Kubernetes, Azure",
      highlights: [
        "Launched B2B AI RevOPS platform → serving 50+ businesses",
        "Improved performance by 40% with profiling & caching",
        "Refactored the core application engine, increasing maintainability and reducing developer onboarding time by 50%.",
        "Led CI/CD + security, achieving 99.99% uptime",
      ],
    },
    {
      company: "Ternary Solutions Inc.",
      position: "Founding Engineer",
      period: "January 2024 - Present",
      location: "Dhaka, Bangladesh (On-Site)",
      tech: "Django, Next.js, Node.js, Kotlin, Flutter, Docker, Kubernetes, Azure",
      highlights: [
        "Delivered 20+ client projects end-to-end",
        "Established best practices: testing frameworks, code standards, scalable infra",
        "Mentored engineers → accelerated team velocity",
      ],
    },
    {
      company: "MarketSwipe Ltd.",
      position: "Contract Based Developer",
      period: "March 2024 - July 2024",
      location: "Dhaka, Bangladesh",
      tech: "Next.js, Express.js, Strapi, PostgreSQL, Docker, Javascript",
      highlights: [
        "Built and deployed Next.js applications integrated with Strapi CMS, enabling clients to easily manage and scale dynamic content-driven websites.",
        "Developed backend infrastructure for a consumer mobile application, integrating third-party APIs and ensuring secure, scalable performance.",
        "Streamlined deployment via Docker + CI/CD pipelines",
      ],
    },
    {
      company: "Teal & Mandy",
      position: "Software Engineer | Frontend",
      period: "May 2023 - December 2023",
      location: "Newark, Delaware, USA (Remote)",
      tech: "React, Next.js, Payload CMS, Docker, Javascript, Typescript, Node.js, AWS",
      highlights: [
        "Created blazing fast server-side applications with Next.js",
        "Achieved 95+ lighthouse score following industry best practices",
        "Optimized deployment via Docker containers on AWS",
      ],
    },
  ];

  return (
    <section id="experience" className="py-20 md:py-28 px-4 md:px-8">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience</h2>
          <div className="w-20 h-1 bg-white mb-8"></div>
        </motion.div>

        <div className="grid gap-10 md:gap-16">
          {experiences.map((exp, idx) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.7 }}
              viewport={{ once: true, amount: 0.2 }}
              className="hidden-element grid md:grid-cols-[1fr_2fr] gap-6 md:gap-10"
            >
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  {exp.company}
                </h3>
                <p className="text-gray-300 mt-1">{exp.position}</p>
                <p className="text-gray-400 text-sm mt-2">{exp.period}</p>
                <p className="text-gray-400 text-sm">{exp.location}</p>
              </div>

              <div>
                <div className="mb-4 p-3 bg-zinc-900/80 rounded-md">
                  <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-1">
                    Tech Stack
                  </h4>
                  <p className="text-gray-300">{exp.tech}</p>
                </div>
                <ul className="space-y-2">
                  {exp.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-gray-300 mt-1">•</span>
                      <span className="text-gray-300">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
