import type { SkillCategory } from "@/types"

export const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    skills: ["Python", "TypeScript", "JavaScript", "SQL", "C++"],
  },
  {
    name: "Backend",
    skills: ["FastAPI", "Django", "DRF", "Flask", "NestJS", "Node.js"],
  },
  {
    name: "Frontend",
    skills: ["React", "Next.js", "Tailwind CSS", "HTML/CSS"],
  },
  {
    name: "Databases",
    skills: ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
  },
  {
    name: "Infrastructure",
    skills: ["AWS", "GCP", "Docker", "Jenkins", "GitLab CI/CD"],
  },
  {
    name: "Practices",
    skills: ["DDD", "Clean Architecture", "TDD", "Hexagonal Architecture", "REST APIs"],
  },
]
