import type { ExperienceEntry } from "@/types"

export const experiences: ExperienceEntry[] = [
  {
    id: "jeitto",
    company: "Jeitto",
    role: "Software Engineer II",
    startDate: "Feb 2026",
    endDate: null,
    description:
      "Fintech infrastructure. FastAPI, DDD, Clean Architecture.",
    bullets: [
      "Engineering performance-critical user flows for a growing fintech platform",
      "Applying DDD and Clean Architecture to refactor legacy services",
      "Optimizing registration and login processes with async FastAPI operations",
    ],
    technologies: ["Python", "FastAPI", "DDD", "Clean Architecture", "Hexagonal Architecture", "GCP"],
    isPreCareer: false,
  },
  {
    id: "cit",
    company: "CI&T",
    role: "Software Developer",
    startDate: "Aug 2024",
    endDate: "Jan 2026",
    description:
      "Allocated at Jeitto fintech. Chatbot flows, backoffice systems.",
    bullets: [
      "Improved and extended services with focus on maintainability and architectural consistency",
      "Maintained and expanded chatbot conversation flows for better user interaction",
      "Delivered backoffice improvements with faster query performance and stronger test coverage",
    ],
    technologies: [
      "Python",
      "FastAPI",
      "DDD",
      "Clean Architecture",
      "Jenkins",
    ],
    isPreCareer: false,
    note: "allocated at Jeitto",
  },
  {
    id: "gr-sistemas",
    company: "GR Sistemas",
    role: "Fullstack Developer",
    startDate: "Jun 2022",
    endDate: "Jul 2024",
    description:
      "Healthcare platform. Django/DRF, NestJS, React, AWS.",
    bullets: [
      "Developed and maintained a large-scale healthcare platform with Python/Django and DRF",
      "Maintained NestJS backend microservices ensuring stability across multiple services",
      "Built modular React + Tailwind interfaces consistent with the company's Design System",
      "Managed AWS infrastructure (EC2, RDS, S3, CloudFront) and GitLab CI/CD pipelines",
    ],
    technologies: [
      "Python",
      "Django",
      "DRF",
      "NestJS",
      "React",
      "Tailwind CSS",
      "AWS",
      "GitLab CI/CD",
    ],
    isPreCareer: false,
  },
  {
    id: "tera",
    company: "Tera",
    role: "Fullstack Learning Facilitator",
    startDate: "Dec 2021",
    endDate: "Aug 2022",
    description:
      "Teaching and mentoring students transitioning into fullstack development.",
    bullets: [
      "Moderated virtual classrooms and supported active learning for career-transitioning students",
      "Assisted students with problem solving, debugging, and fullstack concepts",
    ],
    technologies: ["JavaScript", "React", "Node.js", "Python"],
    isPreCareer: false,
  },
  {
    id: "strategi",
    company: "Strategi Consultoria",
    role: "Junior Developer",
    startDate: "May 2021",
    endDate: "Jun 2022",
    description:
      "Web applications, REST APIs, web scraping, automation.",
    bullets: [
      "Developed web applications using Python/Flask, React, and Node.js",
      "Implemented and maintained REST APIs integrating backend with frontend systems",
      "Built web scraping solutions and automation routines for client business processes",
    ],
    technologies: ["Python", "Flask", "React", "Node.js", "REST APIs"],
    isPreCareer: false,
  },
  {
    id: "crea-rn",
    company: "Crea-RN",
    role: "Software Dev & Support Intern",
    startDate: "Feb 2020",
    endDate: "May 2021",
    description:
      "Internal systems development with Django, HTML/CSS/JS.",
    bullets: [
      "Developed and maintained web pages using HTML, CSS, JavaScript, and Python/Django",
      "Provided technical support and assisted the IT team in improving internal tools",
    ],
    technologies: ["Python", "Django", "HTML", "CSS", "JavaScript"],
    isPreCareer: false,
  },
  {
    id: "teleperformance",
    company: "Teleperformance Brasil",
    role: "Customer Service Agent",
    startDate: "May 2017",
    endDate: "Jan 2020",
    description: "Technical support and customer service.",
    bullets: [
      "Provided technical support and problem resolution for client companies",
    ],
    technologies: [],
    isPreCareer: true,
  },
  {
    id: "focus",
    company: "Focus Automacao Comercial",
    role: "Intern",
    startDate: "Jan 2015",
    endDate: "Mar 2015",
    description:
      "Technical support, computer/network maintenance, SQL.",
    bullets: [
      "Database analysis and data correction using SQL queries",
      "Computer and network maintenance",
    ],
    technologies: ["SQL"],
    isPreCareer: true,
  },
]
