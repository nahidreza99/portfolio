"use client";

import { useState, useEffect } from "react";
import { Link } from "react-scroll";
import { motion } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-black/80 backdrop-blur-lg shadow-lg"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <Link
          to="hero"
          spy={true}
          smooth={true}
          duration={500}
          className="font-mono font-bold text-xl cursor-pointer"
        >
          NR
        </Link>

        <div className="hidden md:flex space-x-8">
          {["whatido", "skills", "experience", "projects", "publications"].map(
            (item) => (
              <Link
                key={item}
                to={item}
                spy={true}
                smooth={true}
                offset={-80}
                duration={500}
                className="text-sm uppercase tracking-wider hover:text-gray-300 cursor-pointer transition-colors"
                activeClass="font-bold"
              >
                {item === "whatido" ? "what i do" : item}
              </Link>
            )
          )}
        </div>

        <Link
          to="contact"
          spy={true}
          smooth={true}
          offset={-80}
          duration={500}
          className="px-5 py-2 border border-white/30 rounded-full text-sm hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
        >
          Contact
        </Link>
      </div>
    </motion.nav>
  );
};

export default Navbar;
