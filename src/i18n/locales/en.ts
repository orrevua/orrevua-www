import type { Translations } from "../types"

export const translations: Translations = {
  nav: {
    about: "about",
    experience: "experience",
    projects: "projects",
    skills: "skills",
    testimonials: "feedback",
    contact: "contact",
  },
  hero: {
    viewMyWork: "View my work",
  },
  about: {
    sectionLabel: "about",
    snapshotKeys: {
      location: "Location",
      experience: "Experience",
      focus: "Focus",
      education: "Education",
      english: "English",
      status: "Status",
    },
  },
  experience: {
    sectionLabel: "experience",
    present: "Present",
  },
  projects: {
    sectionLabel: "projects",
    viewAllOnGithub: "View all on GitHub →",
  },
  skills: {
    sectionLabel: "skills",
    categories: {
      languages: "Languages",
      backend: "Backend",
      frontend: "Frontend",
      databases: "Databases",
      infrastructure: "Infrastructure",
      practices: "Practices",
    },
  },
  testimonials: {
    sectionLabel: "feedback",
    heading: "What people say about working with me",
  },
  contact: {
    sectionLabel: "contact",
    heading: "Let's connect",
    description:
      "Open to conversations about engineering, architecture, or opportunities.",
    downloadResume: "Download Resume ↓",
    freelanceCta: "Hire me for a project →",
  },
  freelance: {
    title: "Work with me",
    subtitle:
      "Have a project in mind? Tell me about it and I'll get back to you within 48 hours.",
    backToPortfolio: "← Back to portfolio",
    nameLabel: "Name *",
    namePlaceholder: "Your name",
    emailLabel: "Email *",
    emailPlaceholder: "you@company.com",
    companyLabel: "Company",
    companyPlaceholder: "Your company (optional)",
    projectTypeLabel: "Project type",
    projectTypePlaceholder: "Select a project type",
    projectTypeOptions: {
      website: "Website / Landing page",
      webapp: "Web application",
      api: "API / Backend service",
      automation: "Automation / Scripting",
      consulting: "Consulting / Architecture review",
      other: "Other",
    },
    budgetLabel: "Budget",
    budgetPlaceholder: "e.g., $2,000 – $5,000 (optional)",
    timelineLabel: "Timeline",
    timelinePlaceholder: "e.g., 4-6 weeks (optional)",
    descriptionLabel: "Project description *",
    descriptionPlaceholder:
      "What are you building? What problem does it solve? Any technical requirements?",
    submit: "Send request",
    sending: "Sending...",
    successMessage:
      "Thanks! Your request was received. I'll reach out to you by email soon.",
    errorMessage: "Something went wrong. Please try again.",
  },
  feedback: {
    heading: "Leave a message",
    nameLabel: "Name *",
    namePlaceholder: "Your name",
    roleLabel: "Role",
    rolePlaceholder: "e.g., Software Engineer",
    companyLabel: "Company",
    companyPlaceholder: "e.g., Google",
    headingSubtitle: "Your message will be shown here after approval",
    messageLabel: "Message *",
    messagePlaceholder: "Share your thoughts...",
    submit: "Submit",
    sending: "Sending...",
    successMessage: "Thanks! Your feedback was submitted for review.",
    errorMessage: "Something went wrong. Please try again.",
  },
  footer: {
    copyright: "© 2026 Felipe Franca",
    builtWith: "Built with Next.js",
  },
  mascot: {
    hint: "Psst... try typing",
    hintCommand: "agent",
    hintLocation: "in the terminal",
    hintOpen: "Press Ctrl+` to open",
  },
  locationPreview: {
    openInMaps: "Open in Google Maps",
  },
  terminal: {
    welcome: [
      "Welcome to Felipe Franca's portfolio terminal.",
      "Type help to see available commands.",
      "",
    ],
    commandNotFound:
      "command not found: {command}. Type help for available commands.",
    commands: {
      help: "List all available commands",
      clear: "Clear terminal",
      exit: "Close terminal",
      ls: "List portfolio structure",
      whoami: "Who are you?",
      history: "Show command history",
      sudo: "Superuser command",
      sudoSu: "Switch to superuser",
      rm: "Remove files",
      vim: "Open vim editor",
      about: "About Felipe Franca",
      experience: "Professional experience",
      projects: "View projects",
      skills: "Technical skills",
      contact: "Contact information",
      github: "Open GitHub profile",
      linkedin: "Open LinkedIn profile",
      resume: "Download resume",
      stack: "Portfolio tech stack",
      theme: "Show color palette",
      themes: "List available themes",
      motd: "Message of the day",
      freelance: "Request a freelance project",
    },
    output: {
      helpShell: "Shell",
      helpPortfolio: "Portfolio",
      helpHeader: "Commands",
      whoamiResponse:
        "visitor — curious enough to open a terminal. I like you.",
      noHistory: "No history available.",
      sudoBox: [
        "┌─────────────────────────────────────────┐",
        "│  ROOT AUTHENTICATION SUCCEEDED          │",
        "│                                         │",
        "│  Hiring sequence initiated...             │",
        "│  Sending offer letter...                  │",
        "│  ████████████████████████████░░  93%    │",
        "│                                         │",
        "│  Just kidding. But let's talk!          │",
        "│  → felipevictor67@gmail.com            │",
        "└─────────────────────────────────────────┘",
      ],
      permissionDenied: "Permission denied.",
      rmResponse: "Nice try. This portfolio is immutable.",
      vimResponse:
        "You're stuck now. Just kidding — there's no vim here. Type exit to leave.",
      neofetchLabels: {
        os: "OS:       Human/Developer 6.0+",
        host: "Host:     Parnamirim, RN, Brazil",
        kernel: "Kernel:   B.Sc. IT — UFRN",
        shell: "Shell:    Python / TypeScript",
        wm: "WM:       Clean Architecture",
        terminal: "Terminal: This one, obviously",
        cpu: "CPU:      Backend × 6+ cores",
        memory: "Memory:   FastAPI / Django / NestJS",
        uptime: "Uptime:   Since 2015",
        packages: "Packages: 28 repos (github)",
      },
      agentLines: {
        initializing: "⚡ Initializing agentic workflow...",
        architectAgent: "┌─ Architect Agent ────────────────────────────────┐",
        analyzingVisitor: "│  ▸ Analyzing visitor profile...                  │",
        readingPatterns: "│  ▸ Reading behavioral patterns...                │",
        draftingSpec: "│  ▸ Drafting personalization spec...              │",
        specReady: "│  ✓ Spec ready. Delegating to Implementer.       │",
        implementerAgent:
          "┌─ Implementer Agent ──────────────────────────────┐",
        receivingSpec: "│  ▸ Receiving spec from Architect...              │",
        executingUnit: "│  ▸ Executing recommendation unit...              │",
        runningChecks: "│  ▸ Running quality checks...                     │",
        implementationComplete: "│  ✓ Implementation complete.                      │",
        reportTitle: "📋 Agent Report:",
        reportLine1: "   You opened a terminal on a portfolio site.",
        reportLine2: "   That tells me you're the kind of engineer who",
        reportLine3: "   reads the source, not just the UI.",
        reportLine4: "   This portfolio was built using the same",
        reportLine5: "   Architect → Implementer agentic workflow",
        reportLine6:
          "   Felipe uses to ship production code with Claude.",
        reportCta1:
          "   Want to work with someone who automates the",
        reportCta2:
          "   boring stuff and architects the hard stuff?",
      },
      aboutLabels: {
        location: "Location",
        experience: "Experience",
        focus: "Focus",
        education: "Education",
        english: "English",
        status: "Status",
      },
      experienceHeader: "Experience",
      experienceAllHeader: "Experience (All)",
      projectNotFound: "Project not found: {name}",
      projectsHeader: "Projects",
      technologies: "Technologies:",
      skillsHeader: "Skills",
      contactHeader: "Contact",
      githubOpening: "Opening GitHub...",
      linkedinOpening: "Opening LinkedIn...",
      adminOpening: "Opening admin panel...",
      resumeDownloading: "Downloading resume...",
      freelanceOpening: "Opening freelance request page...",
      stackHeader: "Tech Stack",
      stackIntro: "This portfolio is built with:",
      themeHeader: "Color Palette",
      themesHeader: "Available Themes",
      themeApplied: "Theme applied: {name}",
      themeNotFound: "Theme not found: \"{name}\". Run /themes to see available options.",
      themeReset: "Theme reset to default (Midnight).",
      themeUsage: "Usage: /theme apply <name> | /theme reset",
      themeCurrent: "(current)",
      noCommandsHistory: "No commands in history.",
      commandHistoryHeader: "Command History",
    },
    motd: [
      "\"Clean code is not written by following a set of rules.\" — Robert C. Martin",
      "\"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.\" — Martin Fowler",
      "Felipe once built a relational DBMS from scratch in C++. For a university assignment.",
      "Fun fact: 'orrevua' is 'auverro' backwards. Which is also not a word. But it sounds cool.",
    ],
  },
  data: {
    personal: {
      title: "Software Engineer",
      tagline:
        "I build backend services and microservices that scale. Currently crafting fintech solutions at Jeitto.",
      location: "Parnamirim, RN, Brazil",
      experience: "6+ years",
      focus: "Backend & Architecture",
      education: "B.Sc. IT — UFRN",
      english: "C2 Proficient",
      status: "Employed at Jeitto",
      aboutParagraphs: [
        "I'm a backend-focused fullstack developer from Natal, RN, Brazil. Over the past 6+ years I've built everything from healthcare platforms to fintech infrastructure — always with a bias toward clean, maintainable systems.",
        "I value architecture that outlasts the sprint it was built in. Domain-Driven Design, Clean Architecture, and test-driven workflows aren't buzzwords to me — they're how I ship code that other engineers can actually work with.",
        "Currently at Jeitto, I work on performance-critical user flows, optimize onboarding pipelines with FastAPI, and refactor legacy services into something the next developer won't dread opening.",
      ],
    },
    experiences: {
      jeitto: {
        role: "Software Engineer II",
        description:
          "Fintech infrastructure. FastAPI, DDD, Clean Architecture.",
        bullets: [
          "Engineering performance-critical user flows for a growing fintech platform",
          "Applying DDD and Clean Architecture to refactor legacy services",
          "Optimizing registration and login processes with async FastAPI operations",
        ],
      },
      cit: {
        role: "Software Developer",
        description:
          "Allocated at Jeitto fintech. Chatbot flows, backoffice systems.",
        bullets: [
          "Improved and extended services with focus on maintainability and architectural consistency",
          "Maintained and expanded chatbot conversation flows for better user interaction",
          "Delivered backoffice improvements with faster query performance and stronger test coverage",
        ],
        note: "allocated at Jeitto",
      },
      "gr-sistemas": {
        role: "Fullstack Developer",
        description:
          "Healthcare platform. Django/DRF, NestJS, React, AWS.",
        bullets: [
          "Developed and maintained a large-scale healthcare platform with Python/Django and DRF",
          "Maintained NestJS backend microservices ensuring stability across multiple services",
          "Built modular React + Tailwind interfaces consistent with the company's Design System",
          "Managed AWS infrastructure (EC2, RDS, S3, CloudFront) and GitLab CI/CD pipelines",
        ],
      },
      tera: {
        role: "Fullstack Learning Facilitator",
        description:
          "Teaching and mentoring students transitioning into fullstack development.",
        bullets: [
          "Moderated virtual classrooms and supported active learning for career-transitioning students",
          "Assisted students with problem solving, debugging, and fullstack concepts",
        ],
      },
      strategi: {
        role: "Junior Developer",
        description:
          "Web applications, REST APIs, web scraping, automation.",
        bullets: [
          "Developed web applications using Python/Flask, React, and Node.js",
          "Implemented and maintained REST APIs integrating backend with frontend systems",
          "Built web scraping solutions and automation routines for client business processes",
        ],
      },
      "crea-rn": {
        role: "Software Dev & Support Intern",
        description:
          "Internal systems development with Django, HTML/CSS/JS.",
        bullets: [
          "Developed and maintained web pages using HTML, CSS, JavaScript, and Python/Django",
          "Provided technical support and assisted the IT team in improving internal tools",
        ],
      },
      teleperformance: {
        role: "Customer Service Agent",
        description: "Technical support and customer service.",
        bullets: [
          "Provided technical support and problem resolution for client companies",
        ],
      },
      focus: {
        role: "Intern",
        description:
          "Technical support, computer/network maintenance, SQL.",
        bullets: [
          "Database analysis and data correction using SQL queries",
          "Computer and network maintenance",
        ],
      },
    },
    projects: {
      predsaude: {
        displayName: "PredSaúde — Public Health Platform",
        description:
          "Full-stack SaaS platform for Brazilian municipalities, unifying patient records across UBS and UPA units.",
        longDescription:
          "Full-stack SaaS platform for Brazilian municipalities, unifying patient records across UBS and UPA units and integrating with the federal e-SUS APS ecosystem and the national RNDS (Rede Nacional de Dados em Saúde). Used in production across multiple municipalities in Rio Grande do Norte and Pará.",
      },
      "gabinajm-portfolio": {
        displayName: "Client Portfolio Site",
        description:
          "Production portfolio built for a product designer client. Multi-language, CMS-powered.",
        longDescription:
          "A professional portfolio website for a product designer, featuring bilingual support (EN/PT), Sanity CMS integration for easy content updates, responsive design, contact form via SendGrid, and performance monitoring. Built with Next.js 16 App Router and deployed on Vercel.",
      },
      heic2format: {
        displayName: "HEIC Image Converter",
        description:
          "Browser-based HEIC to JPG/PNG converter. No server, no uploads — everything runs client-side.",
        longDescription:
          "A web application that converts HEIC image files to other formats entirely on the client side. Zero server-side processing, complete privacy — your images never leave your browser.",
      },
      "transfer-bank": {
        displayName: "Mock PIX Banking App",
        description:
          "Simulated PIX banking SPA with transaction history and analytics charts.",
        longDescription:
          "A mock banking application simulating Brazilian PIX transactions. Features user registration, PIX key management, deposits, transfers, transaction history, and an analytics dashboard with charts. Includes validation against duplicate PIX keys and self-transfers.",
      },
      "sgbd-imd": {
        displayName: "Relational DBMS",
        description:
          "Relational database management system built from scratch in C++.",
        longDescription:
          "A relational database management system implemented from the ground up in C++ as a university project at UFRN. Demonstrates deep understanding of data structures, query processing, and system-level programming.",
      },
      podcastr: {
        displayName: "Podcastr",
        description:
          "Podcast player web app built during Rocketseat NLW#05.",
        longDescription:
          "A web application for listening to podcasts, built during the Next Level Week #05 event by Rocketseat. Features audio playback controls, episode listing, and a clean interface.",
      },
      "expense-viewer": {
        displayName: "Expense Viewer",
        description: "Expense tracking application.",
        longDescription:
          "A JavaScript application for tracking and visualizing personal expenses.",
      },
      "discrete-mathematics-tutor": {
        displayName: "Discrete Mathematics Tutor",
        description:
          "Adaptive Intelligent Tutoring System with knowledge graph visualization and AI chat.",
        longDescription:
          "An adaptive Intelligent Tutoring System for a Brazilian mathematics course. Runs diagnostic assessments, displays a knowledge graph with 17 concepts color-coded by mastery level, and tailors content based on student performance. Includes an optional AI tutor chat powered by Gemini.",
      },
      loansforgood: {
        displayName: "Loans For Good",
        description:
          "Loan proposal management system with dynamic form configuration and task queue processing.",
        longDescription:
          "A full-stack loan proposal management system. Administrators customize loan application forms by selecting and configuring fields. Proposals are submitted via API, processed through a Celery task queue, and reviewed in the admin panel.",
      },
      "fullstack-afiliados": {
        displayName: "Affiliate Transactions Manager",
        description:
          "Full-stack app for uploading and managing affiliate transaction data with JWT auth.",
        longDescription:
          "A full-stack application for managing transaction data. Users upload transaction files, view records, and perform CRUD operations through authenticated endpoints using JWT.",
      },
      "lobby-order-storing": {
        displayName: "Lobby Order Storing",
        description:
          "Web application for storing and managing orders in a lobby system.",
        longDescription:
          "A Next.js web application for storing and managing orders in a lobby system.",
      },
      "evergreen-presentation": {
        displayName: "Evergreen Presentation",
        description:
          "Web-based presentation app built with TypeScript and Tailwind CSS.",
        longDescription:
          "A web-based presentation application for creating and displaying slideshows, built with modern frontend tooling.",
      },
      "electric-discharge-information": {
        displayName: "Electric Discharge Info",
        description:
          "Informational site about electrical safety in daily life.",
        longDescription:
          "An educational website about how to deal with electricity on a daily basis, making electrical safety knowledge more accessible.",
      },
      "zipcode-geolocation": {
        displayName: "Zipcode Geolocation",
        description:
          "Google Maps integration for zipcode-based geolocation lookup.",
        longDescription:
          "A study project demonstrating integration with the Google Maps API to provide geolocation functionality based on zip codes.",
      },
      "user-managing": {
        displayName: "User Managing",
        description:
          "CRUD user management app with profile registration flow.",
        longDescription:
          "A user management application with a three-step registration process: user registration, profile creation, and a listing view showing users with their associated profiles. Full-stack with a Django REST API backend.",
      },
      "todo-list-react": {
        displayName: "Todo List",
        description:
          "Simple task registration app with empty submission prevention.",
        longDescription:
          "A task registration application built with ReactJS, featuring empty submission prevention.",
      },
      "temperature-forecasting": {
        displayName: "Temperature Forecasting",
        description:
          "Django app integrating with ThingSpeak IoT platform for temperature data analysis.",
        longDescription:
          "A web application built with Django that integrates with the ThingSpeak IoT data platform to collect and analyze temperature data.",
      },
      "iot-thingspeak": {
        displayName: "IoT ThingSpeak",
        description:
          "IoT data collection and visualization using Django and ThingSpeak.",
        longDescription:
          "A Python-based IoT project that integrates with the ThingSpeak platform for data collection and visualization, built with Django.",
      },
      "item-reminder": {
        displayName: "Item Reminder",
        description:
          "Java application for item reminders using Maven.",
        longDescription:
          "A Java application for managing item reminders, built with Maven.",
      },
      "projeto-final-cadastro": {
        displayName: "Registration System",
        description:
          "Buyer and seller registration system with multi-payment support in Java.",
        longDescription:
          "A Java registration system for buyers and sellers, featuring product registration, purchase/sale transactions, and multiple payment methods (Pix, Boleto, Debit, Credit card). Demonstrates OOP concepts like abstract classes, generics, and enums.",
      },
    },
  },
}
