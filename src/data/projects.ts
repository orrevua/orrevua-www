import type { Project } from "@/types"

export const projects: Project[] = [
  {
    id: "gabinajm-portfolio",
    name: "gabinajm-portfolio",
    displayName: "Client Portfolio Site",
    description:
      "Production portfolio built for a product designer client. Multi-language, CMS-powered.",
    longDescription:
      "A professional portfolio website for a product designer, featuring bilingual support (EN/PT), Sanity CMS integration for easy content updates, responsive design, contact form via SendGrid, and performance monitoring. Built with Next.js 16 App Router and deployed on Vercel.",
    technologies: ["Next.js", "Sanity", "Tailwind CSS", "TypeScript", "SendGrid"],
    githubUrl: "https://github.com/orrevua/gabinajm-portfolio",
    liveUrl: "https://www.gabinajm.com.br",
    isFeatured: true,
  },
  {
    id: "heic2format",
    name: "heic2format-frontend",
    displayName: "HEIC Image Converter",
    description:
      "Browser-based HEIC to JPG/PNG converter. No server, no uploads — everything runs client-side.",
    longDescription:
      "A web application that converts HEIC image files to other formats entirely on the client side. Zero server-side processing, complete privacy — your images never leave your browser.",
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    githubUrl: "https://github.com/orrevua/heic2format-frontend",
    liveUrl: "https://heic2format.vercel.app",
    isFeatured: true,
  },
  {
    id: "transfer-bank",
    name: "transferBank",
    displayName: "Mock PIX Banking App",
    description:
      "Simulated PIX banking SPA with transaction history and analytics charts.",
    longDescription:
      "A mock banking application simulating Brazilian PIX transactions. Features user registration, PIX key management, deposits, transfers, transaction history, and an analytics dashboard with charts. Includes validation against duplicate PIX keys and self-transfers.",
    technologies: ["React", "TypeScript", "Vite", "Chart.js"],
    githubUrl: "https://github.com/orrevua/transferBank",
    isFeatured: false,
    badge: "study",
  },
  {
    id: "sgbd-imd",
    name: "SGBD-IMD",
    displayName: "Relational DBMS",
    description:
      "Relational database management system built from scratch in C++.",
    longDescription:
      "A relational database management system implemented from the ground up in C++ as a university project at UFRN. Demonstrates deep understanding of data structures, query processing, and system-level programming.",
    technologies: ["C++"],
    githubUrl: "https://github.com/orrevua/SGBD-IMD",
    isFeatured: false,
    badge: "study",
  },
  {
    id: "podcastr",
    name: "podcastr",
    displayName: "Podcastr",
    description: "Podcast player web app built during Rocketseat NLW#05.",
    longDescription:
      "A web application for listening to podcasts, built during the Next Level Week #05 event by Rocketseat. Features audio playback controls, episode listing, and a clean interface.",
    technologies: ["TypeScript", "Next.js", "React"],
    githubUrl: "https://github.com/orrevua/podcastr",
    isFeatured: false,
    badge: "study",
  },
  {
    id: "expense-viewer",
    name: "expense_viewer",
    displayName: "Expense Viewer",
    description: "Expense tracking application.",
    longDescription:
      "A JavaScript application for tracking and visualizing personal expenses.",
    technologies: ["Next.js", "React", "Supabase", "Tailwind CSS"],
    githubUrl: "https://github.com/orrevua/expense_viewer",
    liveUrl: "https://expense-viewer-nu.vercel.app/",
    isFeatured: true,
  },
]
