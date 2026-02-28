"use client";

import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Contact = () => {
  return (
    <section id="contact" className="py-20 md:py-28 px-4 md:px-8 bg-zinc-900">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Me</h2>
          <div className="w-20 h-1 bg-white mb-8"></div>
        </motion.div>

        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl text-gray-300 mb-4"
          >
            I&apos;m always open to discussing new projects, opportunities, or
            collaborations.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            viewport={{ once: true }}
            className="space-y-2 mb-10"
          >
            <p className="text-lg text-white">
              Reach out at{" "}
              <a
                href="mailto:nahidreza99@gmail.com"
                className="font-semibold text-white underline decoration-white/50 underline-offset-2 hover:decoration-white transition-colors"
              >
                nahidreza99@gmail.com
              </a>
            </p>
            <p className="text-gray-400">
              Or connect on{" "}
              <a
                href="https://linkedin.com/in/nahidreza99"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors underline decoration-gray-500 underline-offset-2 hover:decoration-white"
              >
                LinkedIn
              </a>
              .
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-8"
          >
            <a
              href="mailto:nahidreza99@gmail.com"
              className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group"
            >
              <div className="w-12 h-12 bg-black flex items-center justify-center rounded-full group-hover:bg-zinc-800 transition-colors">
                <FaEnvelope size={20} />
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-wider text-gray-400">
                  Email
                </h3>
                <span className="text-white">nahidreza99@gmail.com</span>
              </div>
            </a>
            <a
              href="https://github.com/nahidreza99"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group"
            >
              <div className="w-12 h-12 bg-black flex items-center justify-center rounded-full group-hover:bg-zinc-800 transition-colors">
                <FaGithub size={20} />
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-wider text-gray-400">
                  GitHub
                </h3>
                <span className="text-white">github.com/nahidreza99</span>
              </div>
            </a>
            <a
              href="https://linkedin.com/in/nahidreza99"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group"
            >
              <div className="w-12 h-12 bg-black flex items-center justify-center rounded-full group-hover:bg-zinc-800 transition-colors">
                <FaLinkedin size={20} />
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-wider text-gray-400">
                  LinkedIn
                </h3>
                <span className="text-white">linkedin.com/in/nahidreza99</span>
              </div>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
