import type { PersonalInfo } from "@/types"

export const personalInfo: PersonalInfo = {
  name: "Felipe Franca",
  title: "Software Engineer",
  tagline:
    "I build backend systems that scale. Currently engineering fintech infrastructure at Jeitto.",
  location: "Parnamirim, RN, Brazil",
  experience: "6+ years",
  focus: "Backend & Architecture",
  education: "B.Sc. IT — UFRN",
  english: "C2 Proficient",
  status: "Employed at Jeitto",
  email: "felipevictor67@gmail.com",
  socials: [
    {
      platform: "github",
      url: "https://github.com/orrevua",
      label: "GitHub",
    },
    {
      platform: "linkedin",
      url: "https://linkedin.com/in/flpfranca",
      label: "LinkedIn",
    },
    {
      platform: "email",
      url: "mailto:felipevictor67@gmail.com",
      label: "Email",
    },
  ],
  aboutParagraphs: [
    "I'm a backend-focused fullstack developer from Natal, RN, Brazil. Over the past 6+ years I've built everything from healthcare platforms to fintech infrastructure — always with a bias toward clean, maintainable systems.",
    "I value architecture that outlasts the sprint it was built in. Domain-Driven Design, Clean Architecture, and test-driven workflows aren't buzzwords to me — they're how I ship code that other engineers can actually work with.",
    "Currently at Jeitto, I work on performance-critical user flows, optimize onboarding pipelines with FastAPI, and refactor legacy services into something the next developer won't dread opening.",
  ],
}
