"use client";

import { useState, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navSections = [
  { id: "whatido", label: "what i do" },
  { id: "skills", label: "skills" },
  { id: "experience", label: "experience" },
  { id: "projects", label: "projects" },
  { id: "work", label: "work" },
  { id: "publications", label: "publications" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

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
        <NextLink
          href="/"
          className="font-mono font-bold text-xl cursor-pointer"
        >
          NR
        </NextLink>

        <div className="hidden md:flex space-x-8">
          {navSections.map((item) =>
            item.id === "work" && !isHome ? (
              <NextLink
                key={item.id}
                href="/work"
                className="text-sm uppercase tracking-wider hover:text-gray-300 transition-colors"
              >
                {item.label}
              </NextLink>
            ) : isHome ? (
              <ScrollLink
                key={item.id}
                to={item.id}
                spy={true}
                smooth={true}
                offset={-80}
                duration={500}
                className="text-sm uppercase tracking-wider hover:text-gray-300 cursor-pointer transition-colors"
                activeClass="font-bold"
              >
                {item.label}
              </ScrollLink>
            ) : (
              <NextLink
                key={item.id}
                href={`/#${item.id}`}
                className="text-sm uppercase tracking-wider hover:text-gray-300 transition-colors"
              >
                {item.label}
              </NextLink>
            )
          )}
        </div>

        {isHome ? (
          <ScrollLink
            to="contact"
            spy={true}
            smooth={true}
            offset={-80}
            duration={500}
            className="px-5 py-2 border border-white/30 rounded-full text-sm hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
          >
            Contact
          </ScrollLink>
        ) : (
          <NextLink
            href="/#contact"
            className="px-5 py-2 border border-white/30 rounded-full text-sm hover:bg-white hover:text-black transition-all duration-300"
          >
            Contact
          </NextLink>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
