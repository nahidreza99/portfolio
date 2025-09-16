"use client";

import { motion } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa";

interface PublicationItem {
  title: string;
  authors: string;
  publisher: string;
  year: string;
  doi: string;
  link: string;
}

const Publications = () => {
  const publications: PublicationItem[] = [
    {
      title:
        "MRI-Based Brain Tumor Classification Using Various Deep Learning Convolutional Networks and CNN",
      authors: "N., Reza et al.",
      publisher:
        "Lecture Notes in Networks and Systems, vol 729. Springer, Cham",
      year: "2023",
      doi: "10.1007/978-3-031-36246-0_17",
      link: "https://doi.org/10.1007/978-3-031-36246-0_17",
    },
    {
      title:
        "Green Banking Through Blockchain-Based Application for Secure Transactions",
      authors: "N., Reza et al.",
      publisher:
        "Lecture Notes in Networks and Systems, vol 853. Springer, Cham",
      year: "2023",
      doi: "10.1007/978-3-031-50327-6_24",
      link: "https://doi.org/10.1007/978-3-031-50327-6_24",
    },
  ];

  return (
    <section id="publications" className="py-20 md:py-28 px-4 md:px-8">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Publications</h2>
          <div className="w-20 h-1 bg-white mb-8"></div>
        </motion.div>

        <div className="grid gap-8">
          {publications.map((pub, idx) => (
            <motion.div
              key={pub.doi}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.7 }}
              viewport={{ once: true, amount: 0.2 }}
              className="p-6 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <h3 className="text-xl md:text-2xl font-bold mb-3">
                {pub.title}
              </h3>
              <p className="text-gray-300 mb-2">{pub.authors}</p>
              <p className="text-gray-400 text-sm mb-4">
                {pub.publisher} • {pub.year}
              </p>
              <a
                href={pub.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span>DOI: {pub.doi}</span>
                <FaExternalLinkAlt size={14} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Publications;
