import type { Translations } from "../types"

export const translations: Translations = {
  nav: {
    about: "sobre",
    experience: "experiência",
    projects: "projetos",
    skills: "habilidades",
    testimonials: "feedback",
    contact: "contato",
    blog: "blog",
  },
  blog: {
    sectionLabel: "blog",
    indexTitle: "Dicas e artigos técnicos",
    indexSubtitle: "Anotações da base de código — padrões nos quais me apoio, trade-offs que faço, e coisas que eu queria ter sabido antes.",
    emptyState: "Nenhum post por aqui ainda.",
    filterAll: "todos",
    filterByTag: "Filtrar por tag:",
    readingTime: "{min} min de leitura",
    publishedOn: "Publicado em {date}",
    backToBlog: "← Voltar ao blog",
    notAvailableInLocale: "Este post ainda não está disponível no seu idioma.",
  },
  hero: {
    viewMyWork: "Ver meu trabalho",
  },
  about: {
    sectionLabel: "sobre",
    snapshotKeys: {
      location: "Localização",
      experience: "Experiência",
      focus: "Foco",
      education: "Formação",
      english: "Inglês",
      status: "Status",
    },
  },
  experience: {
    sectionLabel: "experiência",
    present: "Atual",
  },
  projects: {
    sectionLabel: "projetos",
    viewAllOnGithub: "Ver todos no GitHub →",
    showStudyProjects: "Mostrar projetos de estudo",
    hideStudyProjects: "Ocultar projetos de estudo",
  },
  skills: {
    sectionLabel: "habilidades",
    categories: {
      languages: "Linguagens",
      backend: "Backend",
      frontend: "Frontend",
      databases: "Bancos de Dados",
      infrastructure: "Infraestrutura",
      practices: "Práticas",
    },
  },
  testimonials: {
    sectionLabel: "feedback",
    heading: "O que dizem sobre trabalhar comigo",
  },
  contact: {
    sectionLabel: "contato",
    heading: "Vamos conversar",
    description:
      "Aberto a conversas sobre engenharia, arquitetura ou oportunidades.",
    downloadResume: "Baixar Currículo ↓",
    freelanceCta: "Contrate-me para um projeto →",
  },
  freelance: {
    title: "Trabalhe comigo",
    subtitle:
      "Tem um projeto em mente? Conte-me sobre ele e retorno em até 48 horas.",
    backToPortfolio: "← Voltar ao portfólio",
    nameLabel: "Nome *",
    namePlaceholder: "Seu nome",
    emailLabel: "Email *",
    emailPlaceholder: "voce@empresa.com",
    companyLabel: "Empresa",
    companyPlaceholder: "Sua empresa (opcional)",
    projectTypeLabel: "Tipo de projeto",
    projectTypePlaceholder: "Selecione um tipo de projeto",
    projectTypeOptions: {
      website: "Site / Landing page",
      webapp: "Aplicação web",
      api: "API / Serviço backend",
      automation: "Automação / Scripts",
      consulting: "Consultoria / Revisão de arquitetura",
      other: "Outro",
    },
    budgetLabel: "Orçamento",
    budgetPlaceholder: "ex: R$ 10.000 – R$ 25.000 (opcional)",
    timelineLabel: "Prazo",
    timelinePlaceholder: "ex: 4-6 semanas (opcional)",
    descriptionLabel: "Descrição do projeto *",
    descriptionPlaceholder:
      "O que você quer construir? Que problema resolve? Algum requisito técnico?",
    submit: "Enviar solicitação",
    sending: "Enviando...",
    successMessage:
      "Obrigado! Sua solicitação foi recebida. Entrarei em contato por email em breve.",
    errorMessage: "Algo deu errado. Tente novamente.",
  },
  feedback: {
    heading: "Deixe uma mensagem",
    nameLabel: "Nome *",
    namePlaceholder: "Seu nome",
    roleLabel: "Cargo",
    rolePlaceholder: "ex: Engenheiro de Software",
    companyLabel: "Empresa",
    companyPlaceholder: "ex: Google",
    headingSubtitle: "Sua mensagem será exibida aqui após aprovação",
    messageLabel: "Mensagem *",
    messagePlaceholder: "Compartilhe seus pensamentos...",
    submit: "Enviar",
    sending: "Enviando...",
    successMessage: "Obrigado! Seu feedback foi enviado para revisão.",
    errorMessage: "Algo deu errado. Tente novamente.",
  },
  footer: {
    copyright: "© 2026 Felipe Franca",
    builtWith: "Feito com Next.js",
  },
  mascot: {
    hint: "Psst... tente digitar",
    hintCommand: "agent",
    hintLocation: "no terminal",
    hintOpen: "Pressione Ctrl+` para abrir",
  },
  locationPreview: {
    openInMaps: "Abrir no Google Maps",
  },
  terminal: {
    welcome: [
      "Bem-vindo ao terminal do portfólio de Felipe Franca.",
      "Digite help para ver os comandos disponíveis.",
      "",
    ],
    commandNotFound:
      "comando não encontrado: {command}. Digite help para ver os comandos disponíveis.",
    commands: {
      help: "Listar todos os comandos disponíveis",
      clear: "Limpar terminal",
      exit: "Fechar terminal",
      ls: "Listar estrutura do portfólio",
      whoami: "Quem é você?",
      history: "Mostrar histórico de comandos",
      sudo: "Comando de superusuário",
      sudoSu: "Trocar para superusuário",
      rm: "Remover arquivos",
      vim: "Abrir editor vim",
      about: "Sobre Felipe Franca",
      experience: "Experiência profissional",
      projects: "Ver projetos",
      skills: "Habilidades técnicas",
      contact: "Informações de contato",
      github: "Abrir perfil do GitHub",
      linkedin: "Abrir perfil do LinkedIn",
      resume: "Baixar currículo",
      stack: "Stack tecnológica do portfólio",
      theme: "Mostrar paleta de cores",
      themes: "Listar temas disponíveis",
      motd: "Mensagem do dia",
      freelance: "Solicitar um projeto freelance",
    },
    output: {
      helpShell: "Shell",
      helpPortfolio: "Portfólio",
      helpHeader: "Comandos",
      whoamiResponse:
        "visitante — curioso o suficiente pra abrir um terminal. Gostei de você.",
      noHistory: "Nenhum histórico disponível.",
      sudoBox: [
        "┌─────────────────────────────────────────┐",
        "│  AUTENTICAÇÃO ROOT BEM-SUCEDIDA         │",
        "│                                         │",
        "│  Sequência de contratação iniciada...    │",
        "│  Enviando carta proposta...              │",
        "│  ████████████████████████████░░  93%    │",
        "│                                         │",
        "│  Brincadeira. Mas vamos conversar!      │",
        "│  → felipevictor67@gmail.com            │",
        "└─────────────────────────────────────────┘",
      ],
      permissionDenied: "Permissão negada.",
      rmResponse: "Boa tentativa. Este portfólio é imutável.",
      vimResponse:
        "Agora você está preso. Brincadeira — não tem vim aqui. Digite exit para sair.",
      neofetchLabels: {
        os: "OS:       Human/Developer 6.0+",
        host: "Host:     Parnamirim, RN, Brasil",
        kernel: "Kernel:   B.Sc. TI — UFRN",
        shell: "Shell:    Python / TypeScript",
        wm: "WM:       Clean Architecture",
        terminal: "Terminal: Este aqui, obviamente",
        cpu: "CPU:      Backend × 6+ cores",
        memory: "Memory:   FastAPI / Django / NestJS",
        uptime: "Uptime:   Desde 2015",
        packages: "Packages: 28 repos (github)",
      },
      agentLines: {
        initializing: "⚡ Inicializando workflow agêntico...",
        architectAgent: "┌─ Agente Arquiteto ───────────────────────────────┐",
        analyzingVisitor: "│  ▸ Analisando perfil do visitante...             │",
        readingPatterns: "│  ▸ Lendo padrões comportamentais...              │",
        draftingSpec: "│  ▸ Redigindo spec de personalização...           │",
        specReady: "│  ✓ Spec pronta. Delegando ao Implementador.     │",
        implementerAgent:
          "┌─ Agente Implementador ───────────────────────────┐",
        receivingSpec: "│  ▸ Recebendo spec do Arquiteto...                │",
        executingUnit: "│  ▸ Executando unidade de recomendação...         │",
        runningChecks: "│  ▸ Executando verificações de qualidade...       │",
        implementationComplete: "│  ✓ Implementação completa.                      │",
        reportTitle: "📋 Relatório do Agente:",
        reportLine1: "   Você abriu um terminal num site de portfólio.",
        reportLine2: "   Isso me diz que você é o tipo de engenheiro que",
        reportLine3: "   lê o código-fonte, não só a interface.",
        reportLine4: "   Este portfólio foi construído usando o mesmo",
        reportLine5: "   workflow agêntico Arquiteto → Implementador",
        reportLine6:
          "   que o Felipe usa pra entregar código em produção com Claude.",
        reportCta1:
          "   Quer trabalhar com alguém que automatiza o",
        reportCta2:
          "   tedioso e arquiteta o difícil?",
      },
      aboutLabels: {
        location: "Localização",
        experience: "Experiência",
        focus: "Foco",
        education: "Formação",
        english: "Inglês",
        status: "Status",
      },
      experienceHeader: "Experiência",
      experienceAllHeader: "Experiência (Todas)",
      projectNotFound: "Projeto não encontrado: {name}",
      projectsHeader: "Projetos",
      technologies: "Tecnologias:",
      skillsHeader: "Habilidades",
      contactHeader: "Contato",
      githubOpening: "Abrindo GitHub...",
      linkedinOpening: "Abrindo LinkedIn...",
      adminOpening: "Abrindo painel administrativo...",
      resumeDownloading: "Baixando currículo...",
      freelanceOpening: "Abrindo página de solicitação freelance...",
      stackHeader: "Stack Tecnológica",
      stackIntro: "Este portfólio foi construído com:",
      themeHeader: "Paleta de Cores",
      themesHeader: "Temas Disponíveis",
      themeApplied: "Tema aplicado: {name}",
      themeNotFound: "Tema não encontrado: \"{name}\". Execute /themes para ver as opções.",
      themeReset: "Tema restaurado para o padrão (Midnight).",
      themeUsage: "Uso: /theme apply <nome> | /theme reset",
      themeCurrent: "(atual)",
      noCommandsHistory: "Nenhum comando no histórico.",
      commandHistoryHeader: "Histórico de Comandos",
    },
    motd: [
      "\"Código limpo não é escrito seguindo um conjunto de regras.\" — Robert C. Martin",
      "\"Qualquer tolo pode escrever código que um computador entende. Bons programadores escrevem código que humanos entendem.\" — Martin Fowler",
      "Felipe uma vez construiu um SGBD relacional do zero em C++. Para um trabalho da faculdade.",
      "Curiosidade: 'orrevua' é 'auverro' ao contrário. Que também não é uma palavra. Mas soa legal.",
    ],
  },
  data: {
    personal: {
      title: "Engenheiro de Software",
      tagline:
        "Construo serviços backend e microsserviços que escalam. Atualmente desenvolvendo soluções fintech na Jeitto.",
      location: "Parnamirim, RN, Brasil",
      experience: "6+ anos",
      focus: "Backend & Arquitetura",
      education: "B.Sc. TI — UFRN",
      english: "C2 Proficiente",
      status: "Empregado na Jeitto",
      aboutParagraphs: [
        "Sou um desenvolvedor fullstack focado em backend de Natal, RN, Brasil. Nos últimos 6+ anos construí de tudo, de plataformas de saúde a infraestrutura fintech — sempre com foco em sistemas limpos e manuteníveis.",
        "Valorizo arquitetura que dura mais que a sprint em que foi construída. Domain-Driven Design, Clean Architecture e workflows orientados a testes não são buzzwords pra mim — é como eu entrego código com que outros engenheiros conseguem trabalhar.",
        "Atualmente na Jeitto, trabalho em fluxos de usuário críticos para performance, otimizo pipelines de cadastro com FastAPI e refatoro serviços legados em algo que o próximo desenvolvedor não vai ter medo de abrir.",
      ],
    },
    experiences: {
      jeitto: {
        role: "Engenheiro de Software II",
        description:
          "Infraestrutura fintech. FastAPI, DDD, Clean Architecture.",
        bullets: [
          "Engenharia de fluxos de usuário críticos para performance em plataforma fintech em crescimento",
          "Aplicando DDD e Clean Architecture para refatorar serviços legados",
          "Otimizando processos de cadastro e login com operações assíncronas em FastAPI",
        ],
      },
      cit: {
        role: "Desenvolvedor de Software",
        description:
          "Alocado na fintech Jeitto. Fluxos de chatbot, sistemas backoffice.",
        bullets: [
          "Melhorei e estendi serviços com foco em manutenibilidade e consistência arquitetural",
          "Mantive e expandi fluxos de conversação de chatbot para melhor interação do usuário",
          "Entreguei melhorias de backoffice com performance de consulta mais rápida e maior cobertura de testes",
        ],
        note: "alocado na Jeitto",
      },
      "gr-sistemas": {
        role: "Desenvolvedor Fullstack",
        description:
          "Plataforma de saúde. Django/DRF, NestJS, React, AWS.",
        bullets: [
          "Desenvolvi e mantive plataforma de saúde em larga escala com Python/Django e DRF",
          "Mantive microsserviços backend em NestJS garantindo estabilidade entre múltiplos serviços",
          "Construí interfaces modulares em React + Tailwind consistentes com o Design System da empresa",
          "Gerenciei infraestrutura AWS (EC2, RDS, S3, CloudFront) e pipelines CI/CD no GitLab",
        ],
      },
      tera: {
        role: "Facilitador de Aprendizado Fullstack",
        description:
          "Ensino e mentoria de alunos em transição para desenvolvimento fullstack.",
        bullets: [
          "Moderei salas de aula virtuais e apoiei aprendizado ativo de alunos em transição de carreira",
          "Auxiliei alunos com resolução de problemas, debugging e conceitos fullstack",
        ],
      },
      strategi: {
        role: "Desenvolvedor Júnior",
        description:
          "Aplicações web, APIs REST, web scraping, automação.",
        bullets: [
          "Desenvolvi aplicações web usando Python/Flask, React e Node.js",
          "Implementei e mantive APIs REST integrando backend com sistemas frontend",
          "Construí soluções de web scraping e rotinas de automação para processos de negócio de clientes",
        ],
      },
      "crea-rn": {
        role: "Estagiário de Dev & Suporte",
        description:
          "Desenvolvimento de sistemas internos com Django, HTML/CSS/JS.",
        bullets: [
          "Desenvolvi e mantive páginas web usando HTML, CSS, JavaScript e Python/Django",
          "Prestei suporte técnico e auxiliei a equipe de TI na melhoria de ferramentas internas",
        ],
      },
      teleperformance: {
        role: "Agente de Atendimento ao Cliente",
        description: "Suporte técnico e atendimento ao cliente.",
        bullets: [
          "Prestei suporte técnico e resolução de problemas para empresas clientes",
        ],
      },
      focus: {
        role: "Estagiário",
        description:
          "Suporte técnico, manutenção de computadores/redes, SQL.",
        bullets: [
          "Análise de banco de dados e correção de dados usando consultas SQL",
          "Manutenção de computadores e redes",
        ],
      },
    },
    projects: {
      predsaude: {
        displayName: "PredSaúde — Plataforma de Saúde Pública",
        description:
          "Plataforma SaaS full-stack para municípios brasileiros, unificando prontuários de pacientes entre unidades UBS e UPA.",
        longDescription:
          "Plataforma SaaS full-stack para municípios brasileiros, unificando prontuários de pacientes entre unidades UBS e UPA e integrando com o ecossistema federal e-SUS APS e a RNDS (Rede Nacional de Dados em Saúde) do Ministério da Saúde. Em produção em múltiplos municípios do Rio Grande do Norte e Pará.",
      },
      "gabinajm-portfolio": {
        displayName: "Site Portfólio de Cliente",
        description:
          "Portfólio de produção construído para uma cliente product designer. Multi-idioma, com CMS.",
        longDescription:
          "Site de portfólio profissional para uma product designer, com suporte bilíngue (EN/PT), integração com Sanity CMS para atualizações fáceis de conteúdo, design responsivo, formulário de contato via SendGrid e monitoramento de performance. Construído com Next.js 16 App Router e deploy na Vercel.",
      },
      ragkit: {
        displayName: "ragkit — RAG Híbrido Local-First",
        description:
          "Toolkit de RAG híbrido local-first — busca densa + lexical sobre SQLite e Ollama, com CLI, servidor MCP e um harness de avaliação de retrieval embutido. 100% offline.",
        longDescription:
          "Um sistema de RAG híbrido local-first que indexa notas, specs e código em SQLite (sqlite-vec + FTS5) com embeddings do Ollama, e então combina busca vetorial e lexical com Reciprocal Rank Fusion. Inclui uma CLI, um servidor MCP via stdio para agentes, um modo de query explicável e um harness de avaliação ancorado na fonte que mede a qualidade do retrieval (Hit Rate, MRR, nDCG, precisão/recall) — determinístico e pronto para CI.",
      },
      heic2format: {
        displayName: "Conversor de Imagem HEIC",
        description:
          "Conversor HEIC para JPG/PNG no navegador. Sem servidor, sem uploads — tudo roda no cliente.",
        longDescription:
          "Uma aplicação web que converte arquivos de imagem HEIC para outros formatos inteiramente no lado do cliente. Zero processamento no servidor, privacidade completa — suas imagens nunca saem do seu navegador.",
      },
      "transfer-bank": {
        displayName: "App Bancário PIX Mock",
        description:
          "SPA bancária simulada com PIX, histórico de transações e gráficos analíticos.",
        longDescription:
          "Uma aplicação bancária mock simulando transações PIX brasileiras. Inclui cadastro de usuários, gerenciamento de chaves PIX, depósitos, transferências, histórico de transações e dashboard analítico com gráficos. Inclui validação contra chaves PIX duplicadas e auto-transferências.",
      },
      "sgbd-imd": {
        displayName: "SGBD Relacional",
        description:
          "Sistema de gerenciamento de banco de dados relacional construído do zero em C++.",
        longDescription:
          "Um sistema de gerenciamento de banco de dados relacional implementado do zero em C++ como projeto universitário na UFRN. Demonstra profundo entendimento de estruturas de dados, processamento de consultas e programação em nível de sistema.",
      },
      podcastr: {
        displayName: "Podcastr",
        description:
          "App web de player de podcast construído durante Rocketseat NLW#05.",
        longDescription:
          "Uma aplicação web para ouvir podcasts, construída durante o evento Next Level Week #05 da Rocketseat. Inclui controles de reprodução de áudio, listagem de episódios e uma interface limpa.",
      },
      "expense-viewer": {
        displayName: "Visualizador de Despesas",
        description: "Aplicação de rastreamento de despesas.",
        longDescription:
          "Uma aplicação JavaScript para rastrear e visualizar despesas pessoais.",
      },
      "discrete-mathematics-tutor": {
        displayName: "Tutor de Matemática Discreta",
        description:
          "Sistema Tutor Inteligente adaptativo com visualização de grafo de conhecimento e chat com IA.",
        longDescription:
          "Um Sistema Tutor Inteligente adaptativo para um curso de matemática brasileiro. Realiza avaliações diagnósticas, exibe um grafo de conhecimento com 17 conceitos codificados por cor de acordo com o nível de domínio, e adapta o conteúdo com base no desempenho do estudante. Inclui chat com tutor IA via Gemini.",
      },
      loansforgood: {
        displayName: "Loans For Good",
        description:
          "Sistema de gerenciamento de propostas de empréstimo com formulários dinâmicos e fila de tarefas.",
        longDescription:
          "Um sistema full-stack de gerenciamento de propostas de empréstimo. Administradores customizam formulários de aplicação selecionando e configurando campos. Propostas são submetidas via API, processadas por uma fila Celery, e revisadas no painel admin.",
      },
      "fullstack-afiliados": {
        displayName: "Gerenciador de Transações de Afiliados",
        description:
          "App full-stack para upload e gerenciamento de dados de transações de afiliados com JWT.",
        longDescription:
          "Uma aplicação full-stack para gerenciamento de dados de transações. Usuários fazem upload de arquivos de transação, visualizam registros e realizam operações CRUD através de endpoints autenticados com JWT.",
      },
      "lobby-order-storing": {
        displayName: "Lobby Order Storing",
        description:
          "Aplicação web para armazenar e gerenciar pedidos em um sistema de lobby.",
        longDescription:
          "Uma aplicação web Next.js para armazenar e gerenciar pedidos em um sistema de lobby.",
      },
      "evergreen-presentation": {
        displayName: "Evergreen Presentation",
        description:
          "App de apresentação web construído com TypeScript e Tailwind CSS.",
        longDescription:
          "Uma aplicação web de apresentação para criar e exibir slideshows, construída com ferramentas modernas de frontend.",
      },
      "electric-discharge-information": {
        displayName: "Info Descarga Elétrica",
        description:
          "Site informativo sobre segurança elétrica no dia a dia.",
        longDescription:
          "Um site educacional sobre como lidar com eletricidade no dia a dia, tornando o conhecimento sobre segurança elétrica mais acessível.",
      },
      "zipcode-geolocation": {
        displayName: "Geolocalização por CEP",
        description:
          "Integração com Google Maps para busca de geolocalização por CEP.",
        longDescription:
          "Um projeto de estudo demonstrando integração com a API do Google Maps para funcionalidade de geolocalização baseada em CEP.",
      },
      "user-managing": {
        displayName: "Gerenciamento de Usuários",
        description:
          "App CRUD de gerenciamento de usuários com fluxo de cadastro de perfil.",
        longDescription:
          "Uma aplicação de gerenciamento de usuários com processo de cadastro em três etapas: registro de usuário, criação de perfil e uma listagem mostrando usuários com seus perfis associados. Full-stack com backend em Django REST API.",
      },
      "todo-list-react": {
        displayName: "Lista de Tarefas",
        description:
          "App simples de registro de tarefas com prevenção de envio vazio.",
        longDescription:
          "Uma aplicação de registro de tarefas construída com ReactJS, com prevenção de envio vazio.",
      },
      "temperature-forecasting": {
        displayName: "Previsão de Temperatura",
        description:
          "App Django integrando com a plataforma IoT ThingSpeak para análise de dados de temperatura.",
        longDescription:
          "Uma aplicação web construída com Django que integra com a plataforma de dados IoT ThingSpeak para coletar e analisar dados de temperatura.",
      },
      "iot-thingspeak": {
        displayName: "IoT ThingSpeak",
        description:
          "Coleta e visualização de dados IoT usando Django e ThingSpeak.",
        longDescription:
          "Um projeto IoT em Python que integra com a plataforma ThingSpeak para coleta e visualização de dados, construído com Django.",
      },
      "item-reminder": {
        displayName: "Lembrete de Itens",
        description:
          "Aplicação Java para lembretes de itens usando Maven.",
        longDescription:
          "Uma aplicação Java para gerenciamento de lembretes de itens, construída com Maven.",
      },
      "projeto-final-cadastro": {
        displayName: "Sistema de Cadastro",
        description:
          "Sistema de cadastro de compradores e vendedores com suporte a múltiplos pagamentos em Java.",
        longDescription:
          "Um sistema de cadastro em Java para compradores e vendedores, com registro de produtos, transações de compra/venda e múltiplos métodos de pagamento (Pix, Boleto, Débito, Cartão de crédito). Demonstra conceitos de POO como classes abstratas, generics e enums.",
      },
    },
  },
}
