type SectionHeadingProps = {
  eyebrow: string
  title: string
  description: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/70">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-heading text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-8 text-white/65 sm:text-lg">
        {description}
      </p>
    </div>
  )
}
