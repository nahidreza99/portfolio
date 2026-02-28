"use client";

import { motion } from "framer-motion";
import { Link } from "react-scroll";
import { FaCode, FaServer, FaCloudUploadAlt, FaTasks } from "react-icons/fa";

interface ServiceItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
}

const WhatIDo = () => {
  const services: ServiceItem[] = [
    {
      icon: (
        <FaCode
          size={36}
          className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
        />
      ),
      title: "Frontend Development",
      description:
        "I create responsive, engaging user interfaces that provide excellent user experiences. Specializing in modern JavaScript frameworks and mobile-first design.",
      tags: [
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Mobile Responsive",
        "UI/UX",
      ],
    },
    {
      icon: (
        <FaServer
          size={36}
          className="text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]"
        />
      ),
      title: "Backend Development",
      description:
        "I build robust, scalable backend systems that power complex applications. From RESTful APIs to database architecture, I ensure your systems are efficient and maintainable.",
      tags: [
        "Django",
        "FastAPI",
        "Express.js",
        "PostgreSQL",
        "MongoDB",
        "RESTful APIs",
        "Microservices",
      ],
    },
    {
      icon: (
        <FaCloudUploadAlt
          size={36}
          className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
        />
      ),
      title: "DevOps & Cloud",
      description:
        "I implement CI/CD pipelines, container orchestration, and cloud infrastructure to ensure your applications run reliably and scale efficiently.",
      tags: [
        "Docker",
        "Kubernetes",
        "AWS",
        "Azure",
        "CI/CD",
        "Infrastructure as Code",
        "Monitoring",
      ],
    },
    {
      icon: (
        <FaTasks
          size={36}
          className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
        />
      ),
      title: "Project Management",
      description:
        "I lead teams to deliver projects on time and within scope. Skilled in agile methodologies, technical planning, and ensuring high-quality outcomes.",
      tags: [
        "Agile/Scrum",
        "Team Leadership",
        "Technical Planning",
        "Risk Management",
        "Stakeholder Communication",
      ],
    },
  ];

  return (
    <section
      id="whatido"
      className="py-20 md:py-28 px-4 md:px-8 bg-[#000613]"
    >
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">What I Do</h2>
          <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
            I deliver end-to-end solutions by combining technical expertise with
            strategic vision.
          </p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
            With over 3 years of experience building scalable applications for
            startups and enterprises, I provide comprehensive services across
            the entire software development lifecycle.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.7 }}
              viewport={{ once: true, amount: 0.2 }}
              className="bg-[#000613] backdrop-blur-sm p-5 md:p-6 rounded-xl border border-zinc-800 hover:border-zinc-600 hover:shadow-lg hover:shadow-blue-900/10 transition-all hover:-translate-y-1"
            >
              <div className="mb-4 p-3 bg-[#000613] rounded-full w-16 h-16 flex items-center justify-center">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-gray-300 mb-4">{service.description}</p>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-zinc-900/80 text-gray-300 text-sm rounded-full hover:bg-zinc-800 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link
            to="skills"
            spy={true}
            smooth={true}
            offset={-80}
            duration={800}
            className="inline-block px-8 py-3 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition-colors"
          >
            Explore My Skills
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatIDo;
