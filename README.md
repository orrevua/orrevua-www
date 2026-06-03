# orrevua.dev

Portfolio application built with Next.js 16, TypeScript, and Tailwind CSS 4. Deployed on Vercel.

**Live:** https://orrevua.dev

---

## Features

- **Bilingual interface** — Full EN/PT support with locale persistence
- **Interactive terminal** — Unix-style emulator with 20+ commands (`Ctrl + Backtick` to open)
- **Feedback system (GitOps)** — Public form submissions create GitHub PRs automatically
- **Auto-translation** — Feedback messages are translated bidirectionally (EN/PT) via MyMemory API with tinyld language detection
- **Admin panel** — Moderation dashboard at `/admin` for approving, rejecting, and editing feedback translations before merge
- **Security hardening** — CSP headers, HSTS, timing-safe auth, rate limiting, CSRF protection, honeypot anti-spam

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Framework | Next.js 16, React 19 |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4, Framer Motion |
| GitHub API | @octokit/rest |
| Translation | tinyld + MyMemory API |
| Monitoring | @vercel/analytics, @vercel/speed-insights |
| Deploy | Vercel (auto-deploy on push to main) |

## Getting Started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

### Environment Variables

Create `.env.local` with:

```
GITHUB_TOKEN=           # Fine-grained PAT (Contents + PRs write, scoped to this repo)
GITHUB_REPO_OWNER=      # Repository owner
GITHUB_REPO_NAME=       # Repository name
ADMIN_SECRET_TOKEN=     # Admin panel authentication token
```

## Architecture

```
src/
├── app/                # Pages and API routes
│   ├── api/feedback/   # Feedback submission (GitOps PR creation)
│   ├── api/admin/      # Admin endpoints (list, moderate, update-translation)
│   └── admin/          # Admin moderation panel
├── components/
│   ├── sections/       # Page sections (hero, about, experience, projects, skills, testimonials, contact)
│   ├── terminal/       # Interactive terminal emulator (6 components)
│   └── ui/             # Reusable UI components
├── lib/                # GitHub client, auth, rate limiting, translation, terminal logic
├── i18n/               # Locale provider, translation types, EN/PT locale files
├── data/               # Static data files + feedbacks.json
└── types/              # TypeScript type definitions
```

## Feedback Flow

```
Form submission → Validation + Rate limit → Language detection → Auto-translate
    → Create branch → Commit to feedbacks.json → Open PR
        → Admin reviews translations → Approve/Reject
            → Merge → Vercel auto-deploy → Feedback visible on site
```

## Documentation

Full technical documentation (in Portuguese): [`docs/DOCUMENTATION.md`](docs/DOCUMENTATION.md)

## License

Private repository. All rights reserved.
