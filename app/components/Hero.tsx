"use client";

import { motion } from "framer-motion";
import { Link } from "react-scroll";

const Hero = () => {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center pt-24 pb-10 px-4 md:px-8"
    >
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl"
        >
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-gray-400 font-mono mb-2"
          >
            Hello, I&apos;m
          </motion.h3>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-4xl md:text-6xl font-bold mb-4 gradient-text"
          >
            Nahid Reza
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="text-2xl md:text-4xl font-bold mb-6 text-gray-200"
          >
            Full-Stack Engineer | Cloud & DevOps Specialist
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-8"
          >
            I design and scale web & mobile applications with Django, FastAPI,
            Next.js, and Kubernetes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7 }}
            className="flex flex-col md:flex-row gap-4"
          >
            <Link
              to="projects"
              spy={true}
              smooth={true}
              offset={-80}
              duration={800}
              className="px-8 py-3 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition-colors text-center"
            >
              View Projects
            </Link>
            <a
              href="/resume.pdf"
              download
              className="px-8 py-3 border border-white/30 rounded-md font-medium hover:bg-white/10 transition-colors text-center"
            >
              Download Resume
            </a>
            <Link
              to="contact"
              spy={true}
              smooth={true}
              offset={-80}
              duration={800}
              className="px-8 py-3 bg-black border border-white/30 rounded-md font-medium hover:bg-white/10 transition-colors text-center"
            >
              Contact Me
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
