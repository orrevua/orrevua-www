export type Locale = "en" | "pt"

export type Translations = {
  nav: {
    about: string
    experience: string
    projects: string
    skills: string
    testimonials: string
    contact: string
  }
  hero: {
    viewMyWork: string
  }
  about: {
    sectionLabel: string
    snapshotKeys: {
      location: string
      experience: string
      focus: string
      education: string
      english: string
      status: string
    }
  }
  experience: {
    sectionLabel: string
    present: string
  }
  projects: {
    sectionLabel: string
    viewAllOnGithub: string
  }
  skills: {
    sectionLabel: string
    categories: {
      languages: string
      backend: string
      frontend: string
      databases: string
      infrastructure: string
      practices: string
    }
  }
  testimonials: {
    sectionLabel: string
    heading: string
  }
  contact: {
    sectionLabel: string
    heading: string
    description: string
    downloadResume: string
  }
  feedback: {
    heading: string
    nameLabel: string
    namePlaceholder: string
    roleLabel: string
    rolePlaceholder: string
    companyLabel: string
    companyPlaceholder: string
    headingSubtitle: string
    messageLabel: string
    messagePlaceholder: string
    submit: string
    sending: string
    successMessage: string
    errorMessage: string
  }
  footer: {
    copyright: string
    builtWith: string
  }
  mascot: {
    hint: string
    hintCommand: string
    hintLocation: string
    hintOpen: string
  }
  locationPreview: {
    openInMaps: string
  }
  terminal: {
    welcome: string[]
    commandNotFound: string
    commands: {
      help: string
      clear: string
      exit: string
      ls: string
      whoami: string
      history: string
      sudo: string
      sudoSu: string
      rm: string
      vim: string
      about: string
      experience: string
      projects: string
      skills: string
      contact: string
      github: string
      linkedin: string
      resume: string
      stack: string
      theme: string
      themes: string
      motd: string
    }
    output: {
      helpShell: string
      helpPortfolio: string
      helpHeader: string
      whoamiResponse: string
      noHistory: string
      sudoBox: string[]
      permissionDenied: string
      rmResponse: string
      vimResponse: string
      neofetchLabels: {
        os: string
        host: string
        kernel: string
        shell: string
        wm: string
        terminal: string
        cpu: string
        memory: string
        uptime: string
        packages: string
      }
      agentLines: {
        initializing: string
        architectAgent: string
        analyzingVisitor: string
        readingPatterns: string
        draftingSpec: string
        specReady: string
        implementerAgent: string
        receivingSpec: string
        executingUnit: string
        runningChecks: string
        implementationComplete: string
        reportTitle: string
        reportLine1: string
        reportLine2: string
        reportLine3: string
        reportLine4: string
        reportLine5: string
        reportLine6: string
        reportCta1: string
        reportCta2: string
      }
      aboutLabels: {
        location: string
        experience: string
        focus: string
        education: string
        english: string
        status: string
      }
      experienceHeader: string
      experienceAllHeader: string
      projectNotFound: string
      projectsHeader: string
      technologies: string
      skillsHeader: string
      contactHeader: string
      githubOpening: string
      linkedinOpening: string
      adminOpening: string
      resumeDownloading: string
      stackHeader: string
      stackIntro: string
      themeHeader: string
      themesHeader: string
      themeApplied: string
      themeNotFound: string
      themeReset: string
      themeUsage: string
      themeCurrent: string
      noCommandsHistory: string
      commandHistoryHeader: string
    }
    motd: string[]
  }
  data: {
    personal: {
      title: string
      tagline: string
      location: string
      experience: string
      focus: string
      education: string
      english: string
      status: string
      aboutParagraphs: string[]
    }
    experiences: Record<
      string,
      {
        role: string
        description: string
        bullets: string[]
        note?: string
      }
    >
    projects: Record<
      string,
      {
        displayName: string
        description: string
        longDescription: string
      }
    >
  }
}
