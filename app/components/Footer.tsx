"use client";

import { FaGithub, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="py-8 px-4 bg-black border-t border-gray-800">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center"
        >
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Nahid Reza. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Built with Next.js
            </p>
          </div>

          <div className="flex gap-4">
            <a
              href="https://github.com/nahidreza99"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://linkedin.com/in/nahidreza99"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
