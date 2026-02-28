import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WhatIDo from "./components/WhatIDo";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Work from "./components/Work";
import Publications from "./components/Publications";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { getAllWorks } from "./data/works";

export default async function Home() {
  const works = await getAllWorks();
  return (
    <main className="bg-black text-white">
      <Navbar />
      <Hero />
      <WhatIDo />
      <Skills />
      <Experience />
      <Projects />
      <Work works={works} />
      <Publications />
      <Contact />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
