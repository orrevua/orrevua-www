type TechTagProps = {
  name: string
}

export function TechTag({ name }: TechTagProps) {
  return (
    <span className="rounded-full border border-border bg-bg-tertiary px-3 py-1 font-mono text-xs text-text-secondary">
      {name}
    </span>
  )
}
