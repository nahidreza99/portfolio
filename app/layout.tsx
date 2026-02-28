import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://portfolio-nine-rho-47.vercel.app/";

export const metadata: Metadata = {
  title: "Nahid Reza | Full-Stack Engineer",
  description:
    "Portfolio of Nahid Reza - Full-Stack Engineer, Cloud & DevOps Specialist. Expertise in Django, FastAPI, Next.js, and Kubernetes.",
  keywords:
    "Nahid Reza, Full-Stack Engineer, Software Engineer, Django, FastAPI, Next.js, Kubernetes, Docker, Cloud, DevOps",
  openGraph: {
    title: "Nahid Reza | Full-Stack Engineer",
    description:
      "Full-Stack Engineer & Cloud & DevOps Specialist. Backend, frontend, and infrastructure—Django, FastAPI, Next.js, AWS, Terraform.",
    url: siteUrl,
    siteName: "Nahid Reza",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Nahid Reza - Full-Stack Engineer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nahid Reza | Full-Stack Engineer",
    description:
      "Full-Stack Engineer & Cloud & DevOps Specialist. Django, FastAPI, Next.js, AWS, Terraform.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
