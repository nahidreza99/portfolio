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
import { getAllProjects } from "./data/projects";

export default async function Home() {
  const [works, projects] = await Promise.all([
    getAllWorks(),
    getAllProjects(),
  ]);
  return (
    <main className="text-white min-h-screen">
      <Navbar />
      <Hero />
      <WhatIDo />
      <Experience />
      <Work works={works} />
      <Projects projects={projects} />
      <Publications />
      <Skills />
      <Contact />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
