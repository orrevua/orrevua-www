import type { Project } from "@/types"

export const projects: Project[] = [
  {
    id: "predsaude",
    name: "predsaude",
    displayName: "PredSaúde — Public Health Platform",
    description:
      "Full-stack SaaS platform for Brazilian municipalities, unifying patient records across UBS and UPA units.",
    longDescription:
      "Full-stack SaaS platform for Brazilian municipalities, unifying patient records across UBS and UPA units and integrating with the federal e-SUS APS ecosystem and the national RNDS (Rede Nacional de Dados em Saúde). Used in production across multiple municipalities in Rio Grande do Norte and Pará.",
    technologies: ["Python", "TypeScript", "React", "Node.js", "AWS EC2", "AWS RDS", "AWS S3", "CloudFront", "PostgreSQL", "SSE", "REST APIs"],
    liveUrl: "https://predsaude.com",
    previewUrl: "/previews/predsaude.png",
    isFeatured: true,
    badge: "production",
  },
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
    id: "discrete-mathematics-tutor",
    name: "discrete-mathematics-tutor",
    displayName: "Discrete Mathematics Tutor",
    description:
      "Adaptive Intelligent Tutoring System with knowledge graph visualization and AI chat.",
    longDescription:
      "An adaptive Intelligent Tutoring System for a Brazilian mathematics course. Runs diagnostic assessments, displays a knowledge graph with 17 concepts color-coded by mastery level, and tailors content based on student performance. Includes an optional AI tutor chat powered by Gemini.",
    technologies: ["FastAPI", "Python", "Next.js", "TypeScript", "SQLite", "Gemini API"],
    githubUrl: "https://github.com/orrevua/discrete-mathematics-tutor",
    liveUrl: "https://discrete-mathematics-tutor.vercel.app",
    previewUrl: "/previews/discrete-mathematics-tutor.png",
    isFeatured: true,
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
    id: "loansforgood",
    name: "loansforgood",
    displayName: "Loans For Good",
    description:
      "Loan proposal management system with dynamic form configuration and task queue processing.",
    longDescription:
      "A full-stack loan proposal management system. Administrators customize loan application forms by selecting and configuring fields. Proposals are submitted via API, processed through a Celery task queue, and reviewed in the admin panel.",
    technologies: ["Django", "Django REST Framework", "React", "Vite", "PostgreSQL", "Celery", "Docker"],
    githubUrl: "https://github.com/orrevua/loansforgood",
    isFeatured: false,
    badge: "study",
  },
  {
    id: "fullstack-afiliados",
    name: "fullstack-afiliados",
    displayName: "Affiliate Transactions Manager",
    description:
      "Full-stack app for uploading and managing affiliate transaction data with JWT auth.",
    longDescription:
      "A full-stack application for managing transaction data. Users upload transaction files, view records, and perform CRUD operations through authenticated endpoints using JWT.",
    technologies: ["Django", "Django REST Framework", "React", "Vite", "TypeScript", "PostgreSQL", "Docker"],
    githubUrl: "https://github.com/orrevua/fullstack-afiliados",
    isFeatured: false,
    badge: "study",
  },
  {
    id: "lobby-order-storing",
    name: "lobby-order-storing",
    displayName: "Lobby Order Storing",
    description:
      "Web application for storing and managing orders in a lobby system.",
    longDescription:
      "A Next.js web application for storing and managing orders in a lobby system.",
    technologies: ["Next.js", "TypeScript", "React"],
    githubUrl: "https://github.com/orrevua/lobby-order-storing",
    liveUrl: "https://lobby-order-storing.vercel.app",
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
    id: "evergreen-presentation",
    name: "evergreen-presentation",
    displayName: "Evergreen Presentation",
    description:
      "Web-based presentation app built with TypeScript and Tailwind CSS.",
    longDescription:
      "A web-based presentation application for creating and displaying slideshows, built with modern frontend tooling.",
    technologies: ["TypeScript", "React", "Vite", "Tailwind CSS"],
    githubUrl: "https://github.com/orrevua/evergreen-presentation",
    liveUrl: "https://evergreen-presentation.vercel.app",
    isFeatured: false,
    badge: "study",
  },
  {
    id: "electric-discharge-information",
    name: "electric-discharge-information",
    displayName: "Electric Discharge Info",
    description:
      "Informational site about electrical safety in daily life.",
    longDescription:
      "An educational website about how to deal with electricity on a daily basis, making electrical safety knowledge more accessible.",
    technologies: ["HTML", "CSS", "JavaScript"],
    githubUrl: "https://github.com/orrevua/electric-discharge-information",
    liveUrl: "https://electric-discharge-information.vercel.app",
    isFeatured: false,
    badge: "study",
  },
  {
    id: "zipcode-geolocation",
    name: "zipcode_geolocation",
    displayName: "Zipcode Geolocation",
    description:
      "Google Maps integration for zipcode-based geolocation lookup.",
    longDescription:
      "A study project demonstrating integration with the Google Maps API to provide geolocation functionality based on zip codes.",
    technologies: ["JavaScript", "Vite", "Google Maps API"],
    githubUrl: "https://github.com/orrevua/zipcode_geolocation",
    liveUrl: "https://zipcode-geolocation.vercel.app",
    isFeatured: false,
    badge: "study",
  },
  {
    id: "user-managing",
    name: "user_managing",
    displayName: "User Managing",
    description:
      "CRUD user management app with profile registration flow.",
    longDescription:
      "A user management application with a three-step registration process: user registration, profile creation, and a listing view showing users with their associated profiles. Full-stack with a Django REST API backend.",
    technologies: ["TypeScript", "React", "Django", "Python"],
    githubUrl: "https://github.com/orrevua/user_managing",
    liveUrl: "https://user-managing.vercel.app",
    isFeatured: false,
    badge: "study",
  },
  {
    id: "todo-list-react",
    name: "todo-list-react",
    displayName: "Todo List",
    description:
      "Simple task registration app with empty submission prevention.",
    longDescription:
      "A task registration application built with ReactJS, featuring empty submission prevention.",
    technologies: ["JavaScript", "React", "CSS"],
    githubUrl: "https://github.com/orrevua/todo-list-react",
    liveUrl: "https://todo-list-react-vert.vercel.app",
    isFeatured: false,
    badge: "study",
  },
  {
    id: "temperature-forecasting",
    name: "temperature-forecasting",
    displayName: "Temperature Forecasting",
    description:
      "Django app integrating with ThingSpeak IoT platform for temperature data analysis.",
    longDescription:
      "A web application built with Django that integrates with the ThingSpeak IoT data platform to collect and analyze temperature data.",
    technologies: ["Python", "Django", "ThingSpeak API", "JavaScript"],
    githubUrl: "https://github.com/orrevua/temperature-forecasting",
    isFeatured: false,
    badge: "study",
  },
  {
    id: "iot-thingspeak",
    name: "iot_thingspeak",
    displayName: "IoT ThingSpeak",
    description:
      "IoT data collection and visualization using Django and ThingSpeak.",
    longDescription:
      "A Python-based IoT project that integrates with the ThingSpeak platform for data collection and visualization, built with Django.",
    technologies: ["Python", "Django", "ThingSpeak API", "SQLite"],
    githubUrl: "https://github.com/orrevua/iot_thingspeak",
    isFeatured: false,
    badge: "study",
  },
  {
    id: "item-reminder",
    name: "ItemReminder",
    displayName: "Item Reminder",
    description:
      "Java application for item reminders using Maven.",
    longDescription:
      "A Java application for managing item reminders, built with Maven.",
    technologies: ["Java", "Maven"],
    githubUrl: "https://github.com/orrevua/ItemReminder",
    isFeatured: false,
    badge: "study",
  },
  {
    id: "projeto-final-cadastro",
    name: "projeto-final-sistema-de-cadastro",
    displayName: "Registration System",
    description:
      "Buyer and seller registration system with multi-payment support in Java.",
    longDescription:
      "A Java registration system for buyers and sellers, featuring product registration, purchase/sale transactions, and multiple payment methods (Pix, Boleto, Debit, Credit card). Demonstrates OOP concepts like abstract classes, generics, and enums.",
    technologies: ["Java"],
    githubUrl: "https://github.com/orrevua/projeto-final-sistema-de-cadastro",
    isFeatured: false,
    badge: "study",
  },
]
