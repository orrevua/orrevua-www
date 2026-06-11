export type ThemePalette = {
  "--bg-primary": string
  "--bg-secondary": string
  "--bg-tertiary": string
  "--border": string
  "--text-primary": string
  "--text-secondary": string
  "--text-tertiary": string
  "--accent": string
  "--accent-hover": string
  "--accent-muted": string
  "--success": string
  "--warning": string
  "--error": string
}

export type ThemeDefinition = {
  id: string
  name: string
  description: string
  palette: ThemePalette
}
