type IconProps = {
  name: string
  className?: string
}

export function Icon({ name, className = 'h-5 w-5' }: IconProps) {
  const commonProps = {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    viewBox: '0 0 24 24',
  }

  if (name === 'profile') {
    return (
      <svg {...commonProps}>
        <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </svg>
    )
  }

  if (name === 'experience') {
    return (
      <svg {...commonProps}>
        <rect x="4" y="6" width="16" height="14" rx="2" />
        <path d="M9 6V4h6v2" />
        <path d="M4 12h16" />
      </svg>
    )
  }

  if (name === 'projects') {
    return (
      <svg {...commonProps}>
        <path d="m8 8-4 4 4 4" />
        <path d="m16 8 4 4-4 4" />
        <path d="M14 5 10 19" />
      </svg>
    )
  }

  if (name === 'contact') {
    return (
      <svg {...commonProps}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    )
  }

  if (name === 'resume') {
    return (
      <svg {...commonProps}>
        <path d="M8 7h8" />
        <path d="M8 11h8" />
        <path d="M8 15h5" />
        <rect x="4" y="3" width="16" height="18" rx="2" />
      </svg>
    )
  }

  if (name === 'terminal') {
    return (
      <svg {...commonProps}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="m7 9 3 3-3 3" />
        <path d="M13 15h4" />
      </svg>
    )
  }

  if (name === 'uses') {
    return (
      <svg {...commonProps}>
        <path d="M12 8a4 4 0 1 0 4 4" />
        <path d="M2 12h3" />
        <path d="M19 12h3" />
        <path d="M12 2v3" />
        <path d="M12 19v3" />
        <path d="m4.9 4.9 2.2 2.2" />
        <path d="m16.9 16.9 2.2 2.2" />
        <path d="m4.9 19.1 2.2-2.2" />
        <path d="m16.9 7.1 2.2-2.2" />
      </svg>
    )
  }

  if (name === 'notes') {
    return (
      <svg {...commonProps}>
        <path d="M7 4h10l3 3v13H7Z" />
        <path d="M17 4v4h4" />
        <path d="M10 12h6" />
        <path d="M10 16h6" />
      </svg>
    )
  }

  if (name === 'github') {
    return (
      <svg {...commonProps}>
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.1-1.5 6.1-6.7A5.2 5.2 0 0 0 20 5.8 4.8 4.8 0 0 0 19.9 2S18.7 1.7 16 3.5a13.4 13.4 0 0 0-7 0C6.3 1.7 5.1 2 5.1 2A4.8 4.8 0 0 0 5 5.8a5.2 5.2 0 0 0-1.2 3.6c0 5.2 3.1 6.4 6.1 6.7a3.4 3.4 0 0 0-.9 2.6V22" />
      </svg>
    )
  }

  if (name === 'twitter') {
    return (
      <svg {...commonProps}>
        <path d="M18 5h3l-7 7 8 10h-6l-5-6-6 6H2l8-8-8-9h6l5 6Z" />
      </svg>
    )
  }

  if (name === 'disc') {
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="1.5" />
      </svg>
    )
  }

  if (name === 'book') {
    return (
      <svg {...commonProps}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z" />
      </svg>
    )
  }

  if (name === 'search') {
    return (
      <svg {...commonProps}>
        <circle cx="11" cy="11" r="6" />
        <path d="m20 20-4.2-4.2" />
      </svg>
    )
  }

  return (
    <svg {...commonProps}>
      <path d="M6 6h12v12H6z" />
      <path d="m9 9 6 6" />
    </svg>
  )
}
