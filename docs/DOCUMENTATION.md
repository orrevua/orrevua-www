# Documentacao Tecnica - orrevua.dev

**Repositorio:** [orrevua/orrevua-www](https://github.com/orrevua/orrevua-www)
**URL de Producao:** https://orrevua.dev
**Ultima atualizacao:** Junho 2026

---

## Sumario

1. [Visao Geral](#visao-geral)
2. [Stack Tecnologica](#stack-tecnologica)
3. [Arquitetura do Projeto](#arquitetura-do-projeto)
4. [Internacionalizacao (i18n)](#internacionalizacao-i18n)
5. [Sistema de Feedback (GitOps)](#sistema-de-feedback-gitops)
6. [Traducao Automatica](#traducao-automatica)
7. [Painel Administrativo](#painel-administrativo)
8. [Terminal Interativo](#terminal-interativo)
9. [Seguranca](#seguranca)
10. [Integracao com GitHub](#integracao-com-github)
11. [Integracao com Vercel](#integracao-com-vercel)
12. [Variaveis de Ambiente](#variaveis-de-ambiente)
13. [API Routes](#api-routes)
14. [Tipos TypeScript](#tipos-typescript)
15. [Estrutura de Diretorios](#estrutura-de-diretorios)
16. [Blog Bilingue (MDX)](#blog-bilingue-mdx)
17. [Blog CMS (Editor Rico + PRs)](#blog-cms-editor-rico--prs)

---

## Visao Geral

Aplicacao fullstack de portfolio construida com Next.js 16 (App Router) e TypeScript, com funcionalidades que vao alem de um portfolio estatico convencional:

- Interface bilingue (EN/PT) com persistencia de preferencia
- Terminal interativo no estilo Unix com 20+ comandos
- Sistema de feedback via GitOps (submissao gera PR no GitHub automaticamente)
- Traducao automatica bidirecional (EN/PT) das mensagens de feedback
- Painel administrativo para moderacao de feedbacks com edicao de traducoes
- Headers de seguranca robustos (CSP, HSTS, protecao contra clickjacking)
- Monitoramento de performance e analytics integrados via Vercel

---

## Stack Tecnologica

| Camada | Tecnologias |
|--------|-------------|
| **Framework** | Next.js 16.2.7, React 19.2.4 |
| **Linguagem** | TypeScript 5 (strict mode) |
| **Estilizacao** | Tailwind CSS 4, Framer Motion 12 |
| **Tipografia** | Geist (sans + mono) |
| **Icones** | Lucide React |
| **GitHub API** | @octokit/rest |
| **Deteccao de Idioma** | tinyld |
| **Traducao** | MyMemory API (gratuita, sem chave) |
| **Analytics** | @vercel/analytics, @vercel/speed-insights |
| **Deploy** | Vercel (auto-deploy via GitHub) |
| **Gerenciador de Pacotes** | pnpm |

---

## Arquitetura do Projeto

O projeto segue a arquitetura App Router do Next.js 16 com separacao clara entre componentes de servidor e cliente.

### Camada de Dados (`src/data/`)

Os dados do portfolio sao definidos em arquivos TypeScript estaticos, sem banco de dados externo:

- **`personal.ts`** - Dados de exibicao do proprietario (nome, titulo, localizacao, redes sociais, paragrafos do "sobre")
- **`experience.ts`** - Historico profissional (array de entradas com empresa, cargo, periodo, descricao, tecnologias)
- **`projects.ts`** - Projetos (array com 3 em destaque e demais listados)
- **`skills.ts`** - Habilidades tecnicas organizadas em 6 categorias
- **`feedbacks.json`** - Feedbacks aprovados (populado via merge de PRs no GitHub)

### Camada de Componentes (`src/components/`)

Organizada em quatro diretorios:

**`sections/`** - Secoes da pagina principal:
| Componente | Descricao |
|---|---|
| `hero.tsx` | Secao de abertura com titulo animado (cursor piscante), tagline e CTAs |
| `about.tsx` | Secao "sobre" com snapshot de informacoes e preview do Google Maps na localizacao |
| `experience.tsx` | Timeline profissional expansivel com tags de tecnologias |
| `projects.tsx` | Showcase de projetos com destaque para 3 featured e links para GitHub/demo |
| `skills.tsx` | Matriz de habilidades em 6 categorias |
| `testimonials.tsx` | Server component que carrega `feedbacks.json` e renderiza `TestimonialsClient` |
| `testimonials-client.tsx` | Client component que exibe feedbacks com mensagem localizada (EN/PT) |
| `feedback-form.tsx` | Formulario de submissao de feedback com validacao client-side |
| `contact.tsx` | Secao de contato com links de email, GitHub, LinkedIn e download de curriculo |

**`terminal/`** - Emulador de terminal (detalhado na [secao dedicada](#terminal-interativo))

**`layout/`** - `navbar.tsx` (navegacao fixa com scroll-spy e seletor de idioma) e `footer.tsx`

**`ui/`** - Componentes reutilizaveis: `section-label`, `tech-tag`, `icons`, `claude-mascot`, `location-preview`, `language-switch`

### Camada de Bibliotecas (`src/lib/`)

- **`github.ts`** - Cliente Octokit e constantes do repositorio
- **`admin-auth.ts`** - Autenticacao do painel admin com comparacao timing-safe
- **`rate-limit.ts`** - Rate limiting em memoria (cooldown de 60s por IP)
- **`translate.ts`** - Deteccao de idioma (tinyld) e traducao (MyMemory API)
- **`terminal/`** - Parser, formatador, registro de comandos e autocomplete do terminal
- **`hooks/`** - `use-keydown` (atalhos de teclado), `use-active-section` (Intersection Observer)

---

## Internacionalizacao (i18n)

### Arquitetura

O sistema de i18n e implementado via React Context sem dependencias externas.

**Arquivo:** `src/i18n/context.tsx`

```
LocaleProvider
  ├── Estado: locale ("en" | "pt")
  ├── Persistencia: localStorage (chave: "locale")
  ├── Hooks expostos:
  │   ├── useLocale() → { locale, setLocale, toggleLocale }
  │   └── useTranslation() → { t: Translations, locale }
  └── Hidratacao: resolvido assincronamente no mount para evitar mismatch SSR/CSR
```

### Estrutura de Traducoes

**Tipo:** `src/i18n/types.ts` - define a interface `Translations` com todas as chaves obrigatorias.

**Arquivos de traducao:**
- `src/i18n/locales/en.ts` - Ingles completo
- `src/i18n/locales/pt.ts` - Portugues completo

Ambos exportam um objeto `translations: Translations` com cobertura total de:
- Labels de navegacao e secoes
- Textos de UI (botoes, placeholders, mensagens)
- Conteudo do terminal (descricoes de comandos, outputs, MOTD)
- Dados contextuais (descricoes de experiencias, projetos)

### Troca de Idioma

O componente `LanguageSwitch` (`src/components/ui/language-switch.tsx`) renderiza um botao toggle EN/PT. Ao clicar, `toggleLocale()` alterna entre os idiomas. A preferencia persiste entre sessoes via `localStorage`.

Todos os componentes que necessitam de traducao utilizam o hook `useTranslation()` para acessar as strings localizadas.

---

## Sistema de Feedback (GitOps)

O sistema de feedback adota uma abordagem GitOps: cada submissao de feedback gera automaticamente uma branch e um Pull Request no repositorio GitHub. Isso garante rastreabilidade, revisao humana antes da publicacao e deploy automatico via Vercel apos o merge.

### Fluxo Completo

```
1. Visitante preenche formulario
        │
        ▼
2. POST /api/feedback
   ├── Validacao de origem (CSRF)
   ├── Rate limiting (60s/IP)
   ├── Sanitizacao de inputs
   ├── Verificacao de honeypot
   ├── Deteccao de idioma (tinyld)
   └── Traducao automatica (MyMemory)
        │
        ▼
3. GitHub API (via Octokit)
   ├── Cria branch: feedback/{feedbackId}
   ├── Atualiza feedbacks.json na branch
   ├── Commit: "feat: add feedback from {name}"
   └── Cria Pull Request com corpo detalhado
        │
        ▼
4. Admin modera via /admin
   ├── Visualiza feedback e traducoes
   ├── Edita traducoes se necessario
   └── Aprova / Rejeita
        │
        ▼
5. Merge do PR → feedbacks.json atualizado no main
        │
        ▼
6. Vercel detecta push → rebuild automatico
        │
        ▼
7. Feedback aparece na secao de testimonials
   (mensagem exibida no idioma ativo do usuario)
```

### Formulario de Feedback

**Componente:** `src/components/sections/feedback-form.tsx`

| Campo | Tipo | Obrigatorio | Limite |
|-------|------|-------------|--------|
| Nome | text | Sim | 100 chars |
| Cargo | text | Nao | 100 chars |
| Empresa | text | Nao | 100 chars |
| Mensagem | textarea | Sim | 10-1000 chars |
| Website | text (honeypot) | - | Oculto, invisivel |

O campo honeypot (`website`) e um input invisivel que funciona como anti-spam. Bots que preenchem todos os campos serao silenciosamente aceitos sem criar nenhum PR.

### Estrutura do Feedback no JSON

```json
{
  "id": "fb_1780491338349",
  "name": "Nome do autor",
  "role": "Cargo",
  "company": "Empresa",
  "message": "Mensagem original...",
  "messageEn": "Traducao em ingles...",
  "messagePt": "Traducao em portugues...",
  "date": "2026-06-03T12:55:39.130Z"
}
```

### Exibicao Localizada

O componente `TestimonialsClient` seleciona a mensagem com base no idioma ativo:

```typescript
const localizedMessage =
  locale === "pt"
    ? feedback.messagePt ?? feedback.message
    : feedback.messageEn ?? feedback.message
```

Quando o usuario troca o idioma, o componente re-renderiza com a traducao correspondente. Se uma traducao nao existir, o fallback e a mensagem original.

---

## Traducao Automatica

**Arquivo:** `src/lib/translate.ts`

### Deteccao de Idioma

Utiliza a biblioteca **tinyld** para deteccao estatistica de idioma. A funcao `detectLanguage()` retorna `"en"` ou `"pt"`. Qualquer idioma que nao seja portugues e tratado como ingles (fallback seguro para o contexto bilingue do site).

### API de Traducao

Utiliza a **MyMemory Translation API** - servico gratuito sem necessidade de chave de API.

- **Endpoint:** `https://api.mymemory.translated.net/get`
- **Limite:** 480 caracteres por requisicao (limite real da API: 500 chars)
- **Cota diaria:** ~5000 caracteres (suficiente para um portfolio)

### Chunking para Mensagens Longas

Mensagens que excedem 480 caracteres sao divididas automaticamente em chunks por sentenca (split em `.`, `!`, `?`). Cada chunk e traduzido individualmente e os resultados sao reunidos.

```
splitIntoChunks(text)
  ├── Se text.length <= 480 → retorna [text]
  └── Senao → divide por sentencas, agrupa respeitando o limite
```

### Fluxo de Traducao

```
translateFeedback(message)
  ├── detectLanguage(message) → "en" | "pt"
  ├── Se "pt" → traduz para EN, mantem original como PT
  └── Se "en" → mantem original como EN, traduz para PT
  
  Retorno: { messageEn: string, messagePt: string }
  Fallback em caso de erro: ambos recebem a mensagem original
```

---

## Painel Administrativo

**Rota:** `/admin`
**Componente:** `src/app/admin/page.tsx`

### Autenticacao

O painel e protegido por token Bearer. O login e feito via input de senha que envia o token no header `Authorization` das requisicoes subsequentes. A validacao utiliza `crypto.timingSafeEqual` para prevenir ataques de timing.

### Interface

O painel possui duas abas:

**Aba "Pending" (Pendentes)**
- Lista PRs abertos com branch `feedback/*`
- Para cada feedback exibe: nome, data, cargo/empresa, mensagem original, link para o PR
- Campos editaveis de traducao (English e Portugues) pre-populados pela traducao automatica
- Botao "Save translations" - persiste as edicoes no `feedbacks.json` da branch do PR
- Botoes de acao: **Approve** (merge + deleta branch) e **Reject** (fecha PR + deleta branch)

**Aba "Approved" (Aprovados)**
- Lista PRs merged com branch `feedback/*`
- Exibe estado "Reverted" para feedbacks que foram removidos apos aprovacao
- Botao **Revert** - remove o feedback do `feedbacks.json` no main (commit direto)

### Fluxo de Moderacao

```
Approve:
  octokit.pulls.merge() → octokit.git.deleteRef()
  → Vercel rebuild → feedback visivel no site

Reject:
  octokit.pulls.update({ state: "closed" }) → octokit.git.deleteRef()
  → PR fechado, nada publicado

Revert:
  Leitura de feedbacks.json no main
  → Filtra feedback por ID
  → Commit direto no main com JSON atualizado
  → Vercel rebuild → feedback removido
```

---

## Terminal Interativo

### Ativacao

- **Atalho de teclado:** `Ctrl + Backtick` (tecla de crase)
- **Mascote Claude:** Aparece apos 15-35 segundos com dica para abrir o terminal
- **Hint no footer:** Exibe "Press Ctrl+` to open"

### Arquitetura

O terminal e implementado inteiramente no client-side via React Context + useReducer.

**Componentes:**

| Componente | Funcao |
|---|---|
| `terminal-wrapper.tsx` | Inicializacao: LocaleProvider + TerminalProvider + keyboard binder |
| `terminal-provider.tsx` | Estado global do terminal via useReducer (open, minimized, maximized, history, input) |
| `terminal-overlay.tsx` | Modal animado com backdrop-blur e animacao spring (Framer Motion) |
| `terminal-chrome.tsx` | Barra de titulo estilo macOS (fechar, minimizar, maximizar) |
| `terminal-body.tsx` | Area de output com scroll automatico e animacao staggered |
| `terminal-input.tsx` | Input com keybindings, historico de comandos e tab-completion |

### Estado (TerminalState)

```typescript
{
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  history: TerminalHistoryEntry[]      // historico de outputs
  commandHistory: string[]             // historico de comandos (max 100)
  commandHistoryIndex: number          // posicao atual na navegacao
  currentInput: string
  cursorPosition: number
}
```

### Keybindings

| Tecla | Acao |
|-------|------|
| `Enter` | Executar comando |
| `Tab` | Autocomplete |
| `Arrow Up/Down` | Navegar historico de comandos |
| `Ctrl+U` | Limpar input |
| `Ctrl+L` | Limpar terminal |
| `Ctrl+C` | Cancelar input atual |

### Registro de Comandos

Os comandos sao definidos em `src/lib/terminal/commands.ts`. Cada comando implementa a interface:

```typescript
{
  name: string
  description: string
  usage?: string
  execute: (args: string[], t: Translations) => TerminalOutput
}
```

#### Comandos Shell

| Comando | Descricao |
|---------|-----------|
| `help` | Lista todos os comandos disponiveis |
| `clear` | Limpa o terminal |
| `exit` | Fecha o terminal |
| `ls` | Exibe arvore de diretorios do portfolio |
| `whoami` | Retorna "visitor - curious enough to open a terminal" |
| `history` | Mostra historico de comandos |
| `sudo` | Exibe box de "contratacao" (easter egg humoristico) |
| `rm` | "Nice try. This portfolio is immutable." |
| `vim` | "You're stuck now. Just kidding." |
| `neofetch` | ASCII art com informacoes do "sistema" (developer stats) |

#### Comandos de Portfolio

| Comando | Descricao |
|---------|-----------|
| `about` | Informacoes pessoais e biografia |
| `experience [--all]` | Historico profissional (flag `--all` inclui pre-carreira) |
| `projects [nome]` | Lista projetos ou detalha um especifico |
| `skills` | Matriz de habilidades tecnicas |
| `contact` | Email e links de redes sociais |
| `github` | Abre perfil no GitHub em nova aba |
| `linkedin` | Abre perfil no LinkedIn em nova aba |
| `admin` | Abre painel administrativo em nova aba |
| `resume` | Inicia download do curriculo em PDF |
| `stack` | Stack tecnologica do portfolio |
| `theme` | Paleta de cores com codigos hex |
| `motd` | Mensagem do dia (8 mensagens rotativas) |

#### Comando Especial: `agent`

Exibe uma animacao staggered (120ms entre linhas) simulando um workflow agentico Architect/Implementer:

```
⚡ Initializing agentic workflow...
┌─ Architect Agent ─────────────────────┐
│  ▸ Analyzing visitor profile...       │
│  ▸ Reading behavioral patterns...     │
│  ▸ Drafting personalization spec...   │
│  ✓ Spec ready. Delegating...         │
┌─ Implementer Agent ───────────────────┐
│  ▸ Receiving spec from Architect...   │
│  ▸ Executing recommendation unit...   │
│  ▸ Running quality checks...          │
│  ✓ Implementation complete.           │
📋 Agent Report:
   You opened a terminal on a portfolio site.
   That tells me you're the kind of engineer who
   reads the source, not just the UI.
```

### Parser e Autocomplete

- **Parser** (`parser.ts`): Tokeniza input em `{ command, args[] }`, trata aspas e espacos
- **Autocomplete** (`autocomplete.ts`): Tab-completion baseado no registro de comandos. Retorna match unico ou lista de opcoes

---

## Seguranca

### Headers HTTP (next.config.ts)

| Header | Valor | Proposito |
|--------|-------|-----------|
| `Content-Security-Policy` | Diretivas restritivas (ver abaixo) | Prevenir XSS, injecao de scripts |
| `X-Content-Type-Options` | `nosniff` | Prevenir MIME sniffing |
| `X-Frame-Options` | `DENY` | Prevenir clickjacking |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controlar vazamento de referrer |
| `Permissions-Policy` | Desabilita geolocation, mic, camera, payment | Restringir APIs do browser |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forcar HTTPS (somente producao) |

#### Diretivas CSP

```
default-src 'self'
script-src  'self' 'unsafe-inline' https://va.vercel-scripts.com https://vercel.live
style-src   'self' 'unsafe-inline'
img-src     'self' data: https:
connect-src 'self' https://vitals.vercel-analytics.com https://vercel.live
frame-src   https://maps.google.com https://www.google.com
base-uri    'self'
form-action 'self'
frame-ancestors 'none'
object-src  'none'
```

> `'unsafe-inline'` em `script-src` e necessario para o Next.js (scripts de hidratacao). Idealmente seria substituido por nonces quando suportado nativamente.

### Sanitizacao de Input

- **HTML stripping:** Regex `/<[^>]*>/g` remove todas as tags HTML dos inputs
- **Commit sanitization:** Regex que remove `\r`, `\n`, `\t`, ` `, `` dos valores usados em mensagens de commit
- **Limites de comprimento:** Nome/cargo/empresa < 100 chars, mensagem 10-1000 chars

### Autenticacao Admin

**Arquivo:** `src/lib/admin-auth.ts`

- Token Bearer extraido do header `Authorization`
- Comparacao via `crypto.timingSafeEqual` (previne timing attacks)
- Token armazenado em variavel de ambiente `ADMIN_SECRET_TOKEN`

### Rate Limiting

**Arquivo:** `src/lib/rate-limit.ts`

- Cooldown de 60 segundos por IP
- Armazenamento em `Map<string, number>` (memoria do processo)
- IP extraido de `x-real-ip` (prioridade) ou ultimo valor de `x-forwarded-for`
- Retorna header `Retry-After` no response 429

> Limitacao: o rate limiter reseta a cada cold start do serverless. Para protecao mais robusta, considerar Vercel KV ou Upstash Redis.

### Protecao CSRF

O endpoint de feedback valida que o header `Origin` da requisicao corresponde ao header `Host`. Requisicoes cross-origin sao rejeitadas com status 403.

### Honeypot Anti-Spam

Campo `website` invisivel no formulario. Se preenchido (comportamento tipico de bots), a API retorna sucesso sem criar nenhum PR.

---

## Integracao com GitHub

### Octokit Client

**Arquivo:** `src/lib/github.ts`

```typescript
export const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
export const owner = process.env.GITHUB_REPO_OWNER!
export const repo = process.env.GITHUB_REPO_NAME!
export const FEEDBACKS_PATH = "src/data/feedbacks.json"
export const BASE_BRANCH = "main"
```

### Operacoes GitHub API Utilizadas

| Metodo | Endpoint | Uso |
|--------|----------|-----|
| `octokit.git.getRef()` | GET /repos/{owner}/{repo}/git/ref/{ref} | Obter SHA da branch main |
| `octokit.git.createRef()` | POST /repos/{owner}/{repo}/git/refs | Criar branch de feedback |
| `octokit.git.deleteRef()` | DELETE /repos/{owner}/{repo}/git/refs/{ref} | Deletar branch apos moderacao |
| `octokit.repos.getContent()` | GET /repos/{owner}/{repo}/contents/{path} | Ler feedbacks.json |
| `octokit.repos.createOrUpdateFileContents()` | PUT /repos/{owner}/{repo}/contents/{path} | Atualizar feedbacks.json |
| `octokit.pulls.create()` | POST /repos/{owner}/{repo}/pulls | Criar PR de feedback |
| `octokit.pulls.list()` | GET /repos/{owner}/{repo}/pulls | Listar PRs para moderacao |
| `octokit.pulls.merge()` | PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge | Aprovar feedback |
| `octokit.pulls.update()` | PATCH /repos/{owner}/{repo}/pulls/{pull_number} | Fechar PR (rejeitar) |

### Token GitHub (Fine-Grained PAT)

O token deve ter escopo minimo, restrito ao repositorio `orrevua-www`:
- **Contents:** write (criar branches, commits)
- **Pull Requests:** write (criar, listar, merge, fechar PRs)

### Corpo do PR Gerado

```markdown
**Name:** {nome do autor}
**Role:** {cargo}
**Company:** {empresa}

**Message (original):**
> {mensagem original}

**English:**
> {traducao automatica EN}

**Portuguese:**
> {traducao automatica PT}

---
Translations were auto-generated. Edit them in the admin panel before approving if needed.
```

---

## Integracao com Vercel

### Deploy Automatico

O repositorio GitHub esta conectado ao Vercel. Cada push na branch `main` dispara automaticamente um novo build e deploy. Isso significa que:

- Aprovar um feedback no admin (merge de PR) → Vercel rebuilda → feedback aparece no site
- Reverter um feedback (commit direto no main) → Vercel rebuilda → feedback removido

### Analytics

**Pacote:** `@vercel/analytics`

Integrado no root layout (`src/app/layout.tsx`) via componente `<Analytics />`. Coleta metricas de pageview e interacao automaticamente.

### Speed Insights

**Pacote:** `@vercel/speed-insights`

Integrado no root layout via componente `<SpeedInsights />`. Monitora Core Web Vitals (LCP, FID, CLS) em producao.

### CSP para Vercel

Os headers CSP incluem excecoes especificas para servicos Vercel:
- `script-src`: `https://va.vercel-scripts.com`, `https://vercel.live`
- `connect-src`: `https://vitals.vercel-analytics.com`, `https://vercel.live`

### HSTS Condicional

O header `Strict-Transport-Security` so e adicionado quando `NODE_ENV === "production"`, evitando problemas com HTTP local durante desenvolvimento.

### Funcoes Serverless

As API routes (`/api/feedback`, `/api/admin/*`) executam como funcoes serverless no Vercel. Cada invocacao pode rodar em um container diferente, o que implica:
- Rate limiting em memoria se reseta entre containers/cold starts
- Nao ha estado compartilhado entre invocacoes

---

## Variaveis de Ambiente

| Variavel | Descricao | Uso |
|----------|-----------|-----|
| `GITHUB_TOKEN` | Fine-grained PAT do GitHub | Autenticacao Octokit para operacoes de branch/PR/commit |
| `GITHUB_REPO_OWNER` | Owner do repositorio (`orrevua`) | Identificacao do repo nas chamadas da API |
| `GITHUB_REPO_NAME` | Nome do repositorio (`orrevua-www`) | Identificacao do repo nas chamadas da API |
| `ADMIN_SECRET_TOKEN` | Token secreto do admin (SHA-256) | Autenticacao do painel administrativo |
| `NODE_ENV` | Ambiente de execucao | Condicional para HSTS (production only) |

> As variaveis devem ser configuradas tanto no `.env.local` (desenvolvimento) quanto no painel de Environment Variables do Vercel (producao).

---

## API Routes

### POST `/api/feedback`

Submissao de novo feedback.

| Aspecto | Detalhe |
|---------|---------|
| **Autenticacao** | Nenhuma (endpoint publico) |
| **Protecoes** | Origin check, rate limit, honeypot, sanitizacao |
| **Body** | `{ name, role?, company?, message, website? }` |
| **Sucesso** | 201 `{ success: true }` |
| **Erros** | 400 (validacao), 403 (CSRF), 429 (rate limit), 500 (erro interno) |

### GET `/api/admin/list`

Listagem de PRs de feedback.

| Aspecto | Detalhe |
|---------|---------|
| **Autenticacao** | Bearer token |
| **Query params** | `?state=merged` (opcional) |
| **Resposta** | Array de `FeedbackPR` com dados do JSON da branch (nome, cargo, empresa, mensagem, traducoes, data) |

### POST `/api/admin/moderate`

Moderacao de feedback (aprovar, rejeitar, reverter).

| Aspecto | Detalhe |
|---------|---------|
| **Autenticacao** | Bearer token |
| **Body** | `{ prNumber, branchName, action: "approve" \| "reject" \| "revert" }` |
| **approve** | Merge PR + deleta branch |
| **reject** | Fecha PR + deleta branch |
| **revert** | Remove feedback do `feedbacks.json` no main |

### POST `/api/admin/update-translation`

Atualizacao de traducoes em feedback pendente.

| Aspecto | Detalhe |
|---------|---------|
| **Autenticacao** | Bearer token |
| **Body** | `{ branchName, feedbackId, messageEn?, messagePt? }` |
| **Efeito** | Atualiza `feedbacks.json` na branch do PR com as traducoes editadas |

---

## Tipos TypeScript

**Arquivo:** `src/types/index.ts`

### Tipos de Dados

```typescript
SocialLink       { platform, url, label }
PersonalInfo     { name, title, tagline, location, ..., socials[], aboutParagraphs[] }
ExperienceEntry  { id, company, role, startDate, endDate, bullets[], technologies[], ... }
Project          { id, name, displayName, description, longDescription, technologies[], ... }
SkillCategory    { name, skills[] }
Feedback         { id, name, role, company, message, messageEn?, messagePt?, date }
```

### Tipos do Terminal

```typescript
TerminalLine          { content, style?, isLink? }
TerminalOutput        { lines[], staggered?, staggerDelay? }
TerminalCommand       { name, description, usage?, execute() }
TerminalHistoryEntry  { input, output }
TerminalState         { isOpen, isMinimized, isMaximized, history[], ... }
```

---

## Estrutura de Diretorios

```
src/
├── app/
│   ├── layout.tsx                         Root layout (fonts, Analytics, SpeedInsights)
│   ├── page.tsx                           Pagina principal
│   ├── globals.css                        Estilos globais
│   ├── admin/
│   │   ├── layout.tsx                     Layout do admin
│   │   └── page.tsx                       Painel de moderacao
│   └── api/
│       ├── feedback/route.ts              Submissao de feedback
│       └── admin/
│           ├── list/route.ts              Listagem de PRs
│           ├── moderate/route.ts          Moderacao (approve/reject/revert)
│           └── update-translation/route.ts Edicao de traducoes
├── components/
│   ├── layout/
│   │   ├── navbar.tsx                     Navegacao fixa
│   │   └── footer.tsx                     Rodape
│   ├── sections/
│   │   ├── hero.tsx                       Secao de abertura
│   │   ├── about.tsx                      Sobre
│   │   ├── experience.tsx                 Experiencia
│   │   ├── projects.tsx                   Projetos
│   │   ├── skills.tsx                     Habilidades
│   │   ├── testimonials.tsx               Testimonials (server)
│   │   ├── testimonials-client.tsx        Testimonials (client)
│   │   ├── feedback-form.tsx              Formulario de feedback
│   │   └── contact.tsx                    Contato
│   ├── terminal/
│   │   ├── terminal-wrapper.tsx           Inicializacao
│   │   ├── terminal-provider.tsx          Estado (Context + Reducer)
│   │   ├── terminal-overlay.tsx           Modal animado
│   │   ├── terminal-chrome.tsx            Barra de titulo
│   │   ├── terminal-body.tsx              Area de output
│   │   └── terminal-input.tsx             Input com keybindings
│   └── ui/
│       ├── section-label.tsx              Labels numerados
│       ├── tech-tag.tsx                   Tags de tecnologia
│       ├── icons.tsx                      Icones SVG
│       ├── claude-mascot.tsx              Mascote animado
│       ├── location-preview.tsx           Preview do Maps
│       └── language-switch.tsx            Toggle EN/PT
├── lib/
│   ├── github.ts                          Cliente Octokit
│   ├── admin-auth.ts                      Autenticacao admin
│   ├── rate-limit.ts                      Rate limiting
│   ├── translate.ts                       Deteccao + traducao
│   ├── terminal/
│   │   ├── parser.ts                      Parser de comandos
│   │   ├── formatter.ts                   Formatacao de output
│   │   ├── commands.ts                    Registro de comandos
│   │   └── autocomplete.ts               Tab-completion
│   └── hooks/
│       ├── use-keydown.ts                 Atalhos de teclado
│       └── use-active-section.ts          Intersection Observer
├── i18n/
│   ├── context.tsx                        Provider + hooks
│   ├── types.ts                           Interface Translations
│   └── locales/
│       ├── en.ts                          Ingles
│       └── pt.ts                          Portugues
├── config/
│   └── metadata.ts                        SEO metadata
├── data/
│   ├── personal.ts                        Dados pessoais
│   ├── experience.ts                      Experiencias
│   ├── projects.ts                        Projetos
│   ├── skills.ts                          Habilidades
│   └── feedbacks.json                     Feedbacks aprovados
└── types/
    └── index.ts                           Definicoes de tipos
```

> Nota: a arvore acima e um snapshot pre-blog. Arquivos adicionados posteriormente estao listados nas secoes [Blog Bilingue](#blog-bilingue-mdx) e [Blog CMS](#blog-cms-editor-rico--prs).

---

## Blog Bilingue (MDX)

Blog estatico bilingue publicado em `/blog`, com detalhe por post em `/blog/[slug]`. Conteudo autorado como arquivos MDX versionados no proprio repositorio, renderizado em tempo de build via `next-mdx-remote/rsc`.

### Modelo de Conteudo

Cada post tem duas variantes de idioma:

```
src/content/blog/{slug}/
  ├── en.mdx
  └── pt.mdx
```

Frontmatter (identico entre locales):

```yaml
---
slug: nome-do-post
title: "Titulo do post"
description: "Resumo de uma linha para cards e og:description"
date: 2026-07-25
tags: ["nextjs", "mdx"]
cover: "/blog/hero.png"   # opcional
---
```

### Loader

Arquivo: `src/lib/blog/loader.ts` (sincrono, base `fs`, seguro em RSC).

| Funcao | Retorno |
|--------|---------|
| `listPosts()` | `BlogPostMeta[]` ordenado por data desc |
| `getPostBySlug(slug)` | `BlogPost \| null` (inclui corpo MDX de ambos locales) |
| `listTags()` | `string[]` desduplicado, ordem asc |

O loader falha rapido no build se:
- Falta uma variante de locale
- Frontmatter invalido (chave obrigatoria ausente)
- Slug do frontmatter difere do nome do diretorio

### Rotas e Renderizacao

| Rota | Tipo | Nota |
|------|------|------|
| `/blog` | Static | Index com filtro de tag (querystring `?tag=`), cards no estilo de projetos |
| `/blog/[slug]` | SSG | `generateStaticParams` pre-gera todos os slugs; renderiza EN e PT no mesmo HTML; wrapper client alterna via `hidden` sem navegacao |
| `/sitemap.xml` | Static | Inclui todos os posts |
| `/robots.txt` | Static | Bloqueia `/admin` e `/api` |

### Estilizacao

Classe `.prose-blog` definida em `src/app/globals.css`, escrita a mao usando tokens de tema (`var(--text-primary)`, `var(--accent)`, `var(--bg-tertiary)`, etc.). Sem `@tailwindcss/typography`. Funciona com todos os temas do site.

### SEO

- `generateMetadata` por post: canonical, `og:type=article`, `publishedTime`, tags, cover
- JSON-LD `BlogPosting` inline no `<head>` do detalhe
- Sitemap com `lastModified: post.date`, `changeFrequency: monthly`

### Deps

- `next-mdx-remote` - renderizacao RSC de MDX
- `gray-matter` - parsing de frontmatter
- `marked` - Markdown -> HTML no CMS (server-side, sem eval)

---

## Blog CMS (Editor Rico + PRs)

Camada de CMS embutida em `/admin` que gerencia posts do blog via fluxo GitOps: toda mutacao abre um Pull Request no GitHub, o admin revisa, mescla, e o Vercel implanta.

### Fluxo de Publicacao

```
1. Admin abre /admin -> aba Blog
        |
        v
2. Clica "+ New post" (ou Continue editing em PR aberto, ou Edit em post publicado)
        |
        v
3. Preenche frontmatter + escreve corpo no editor TipTap (WYSIWYG)
   - Insere imagens (max 6, 2 MB, PNG/JPEG/WEBP)
   - Alterna EN/PT com toggle no topo
   - Traduz EN -> PT em um clique (preserva formatacao e codigo)
   - Clica "Preview" para abrir /admin/blog/preview em nova aba
        |
        v
4. Clica "Save & open PR" (ou "Update PR" se ja existe um aberto)
   Servidor:
   - Valida frontmatter, corpo Markdown, imagens (mime, magic bytes, tamanho)
   - Commit atomico: en.mdx + pt.mdx + public/blog/{slug}/*.png
   - Abre PR em branch blog/{slug}-{ts}
        |
        v
5. Revisa PR no GitHub (Vercel gera URL de preview)
        |
        v
6. Clica "Merge & publish" no admin (ou merge no GitHub)
        |
        v
7. Vercel detecta push em main -> rebuild -> post ao vivo em /blog
```

### Editor Rico (TipTap)

- Motor: `@tiptap/react` v3 + `starter-kit` (headings, negrito, italico, listas, blockquote, code, code block, link)
- Extensoes extras: `image` (com atributo customizado `data-pending`), `placeholder`
- Toolbar: `H2 H3 | B I | * List 1. List " </> <> | Link Image`
- Carregado via `dynamic({ ssr: false })` para nao pesar o bundle publico
- Contorna CSP estrito: sem `Function()` ou `eval` no runtime

### Round-trip HTML <-> Markdown

- Editar post existente: `marked.parse(md)` -> HTML -> TipTap `setContent`
- Salvar: `turndown(html)` -> Markdown -> commit
- Turndown configurado com `codeBlockStyle: fenced`, `headingStyle: atx`, `bulletListMarker: -`
- Regra customizada de imagem: `<img data-pending="{fn}">` -> `![alt](/blog/{slug}/{fn})`

### Traducao EN -> PT

Rota `POST /api/admin/blog/translate` recebe `{ title, description, texts: string[] }`, onde `texts` sao apenas os nos de texto extraidos do HTML (via DOMParser client-side). Codigo, headings, imagens e formatacao permanecem intactos porque o servidor so ve o texto puro.

O cliente aplica as traducoes de volta nos mesmos nos DOM. Backend: [MyMemory API](https://mymemory.translated.net) (gratuita).

### Preview Dedicado

Rota `/admin/blog/preview` (client-only) le o rascunho do `sessionStorage`/`localStorage` e renderiza usando o layout exato de `/blog/[slug]`: `<Navbar>`, header do post, `<article class="prose-blog">`, `<Footer>`. Imagens pendentes sao embutidas como data URLs.

Guarda de acesso: presenca de `adminToken` no storage; ausencia redireciona para `/admin`.

### Update-em-vez-de-nova-PR

Ao editar um post que ja tem PR aberto no repo, o botao Save vira "Update PR": o servidor identifica a branch existente, adiciona um novo commit no mesmo branch (via `git.createTree` + `git.createCommit` + `git.updateRef`), e o PR se atualiza sem abrir um novo. Se o post ja esta merged, uma nova edicao abre uma nova PR.

### API Routes Adicionadas

| Metodo | Rota | Descricao |
|--------|------|-----------|
| `GET`  | `/api/admin/blog/list` | Posts em main + PRs abertos de blog |
| `GET`  | `/api/admin/blog/get?slug={s}&ref={ref}` | Fetch `en.mdx` + `pt.mdx` (ref = main ou branch) |
| `POST` | `/api/admin/blog/save` | Cria/atualiza post, opcional `branchName` para reusar PR |
| `POST` | `/api/admin/blog/delete` | Abre PR removendo ambos arquivos |
| `POST` | `/api/admin/blog/merge` | Merge PR + delete branch (rejeita non-blog branches) |
| `POST` | `/api/admin/blog/translate` | Traduz `{title, description, texts[]}` |
| `GET`  | `/api/admin/ping` | Auth-only, usado no login (desacopla de GitHub) |

Todas as novas rotas passam por: `requireAdmin` -> `requireSameOrigin` -> rate limit por chave dedicada.

### Seguranca

| Vetor | Mitigacao |
|-------|-----------|
| CSRF | Header `Origin` verificado quando presente; ausencia = same-origin |
| XSS via MDX | `validateBody` rejeita `<script>`, `<iframe>`, `<style>`, event handlers, `javascript:` URLs |
| XSS via preview | Sanitizer DOMParser server-side + client-side antes de `dangerouslySetInnerHTML` |
| Imagens hostis | Filename regex + mime whitelist + magic-byte sniff (PNG/JPEG/WEBP), rejeita SVG |
| PR hijack | Merge endpoint aceita apenas branches `blog/*`; edit-existing-PR verifica slug corresponde |
| Payload flood | 15 MiB total, 2 MiB por imagem, max 6 imagens, corpo max 40 KB |

### Deps

- `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-placeholder`
- `turndown` (+ `@types/turndown` dev)
- `marked` (compartilhado com o blog)

### Arquivos Adicionados

```
src/app/admin/blog/preview/page.tsx
src/app/api/admin/blog/{list,get,save,delete,merge,translate}/route.ts
src/app/api/admin/ping/route.ts
src/components/admin/{admin-shell,feedback-tab,blog-tab,blog-post-list}.tsx
src/components/admin/{blog-editor,blog-editor-form,blog-tiptap-editor,blog-tiptap-toolbar}.tsx
src/components/admin/{blog-preview-view,blog-image-manager,blog-md-html}.tsx
src/lib/admin/sanitize-html.ts
src/lib/blog/{validate,route-guards,mdx-file,git-tree}.ts
```
