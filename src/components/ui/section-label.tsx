type SectionLabelProps = {
  number: string
  label: string
}

export function SectionLabel({ number, label }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-text-tertiary mb-8">
      <span className="text-accent">{number}.</span>
      <span>{label}</span>
    </div>
  )
}
