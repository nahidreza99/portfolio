"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaReact,
  FaNodeJs,
  FaDocker,
  FaAws,
  FaMicrosoft,
} from "react-icons/fa";
import {
  SiDjango,
  SiFastapi,
  SiNextdotjs,
  SiKubernetes,
  SiMongodb,
  SiPostgresql,
  SiTypescript,
  SiFlutter,
  SiGooglecloud,
} from "react-icons/si";

interface SkillItem {
  name: string;
  icon: React.ReactNode;
  category: "frontend" | "backend" | "mobile" | "database" | "devops";
}

const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);

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

  const skills: SkillItem[] = [
    { name: "React", icon: <FaReact size={42} />, category: "frontend" },
    { name: "Next.js", icon: <SiNextdotjs size={42} />, category: "frontend" },
    {
      name: "TypeScript",
      icon: <SiTypescript size={42} />,
      category: "frontend",
    },
    { name: "Node.js", icon: <FaNodeJs size={42} />, category: "backend" },
    { name: "Django", icon: <SiDjango size={42} />, category: "backend" },
    { name: "FastAPI", icon: <SiFastapi size={42} />, category: "backend" },
    { name: "Flutter", icon: <SiFlutter size={42} />, category: "mobile" },
    {
      name: "PostgreSQL",
      icon: <SiPostgresql size={42} />,
      category: "database",
    },
    { name: "MongoDB", icon: <SiMongodb size={42} />, category: "database" },
    { name: "Docker", icon: <FaDocker size={42} />, category: "devops" },
    {
      name: "Kubernetes",
      icon: <SiKubernetes size={42} />,
      category: "devops",
    },
    { name: "AWS", icon: <FaAws size={42} />, category: "devops" },
    { name: "Azure", icon: <FaMicrosoft size={42} />, category: "devops" },
    { name: "GCP", icon: <SiGooglecloud size={42} />, category: "devops" },
  ];

  const categories = ["frontend", "backend", "mobile", "database", "devops"];

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-20 md:py-28 bg-zinc-900 px-4 md:px-8"
    >
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Skills & Tech Stack
          </h2>
          <div className="w-20 h-1 bg-white mb-8"></div>
        </motion.div>

        <div className="grid gap-12">
          {categories.map((category) => (
            <div key={category} className="hidden-element">
              <h3 className="text-xl md:text-2xl font-semibold capitalize mb-6">
                {category === "devops" ? "DevOps & Cloud" : category}
              </h3>
              <div className="tech-grid">
                {skills
                  .filter((skill) => skill.category === category)
                  .map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      className="flex flex-col items-center gap-2 p-4 bg-black bg-opacity-40 rounded-lg hover:bg-opacity-60 transition-all"
                    >
                      {skill.icon}
                      <span className="text-sm text-center">{skill.name}</span>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-16 text-center text-lg text-gray-300 hidden-element"
        >
          I specialize in building scalable, production-ready systems with
          cloud-native architecture and DevOps best practices.
        </motion.p>
      </div>
    </section>
  );
};

export default Skills;
