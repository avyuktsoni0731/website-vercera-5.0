'use client'

import { Instagram, Linkedin, Globe } from 'lucide-react'

const SOCIAL_LINKS = [
  { href: 'https://www.instagram.com/amuroboclub', label: 'Instagram', icon: Instagram },
  { href: 'https://www.linkedin.com/company/amuroboclub', label: 'LinkedIn', icon: Linkedin },
  { href: 'https://amuroboclub.com', label: 'AMURoboclub Website', icon: Globe },
]

export function FloatingSocialNav() {
  return (
    <nav
      className="fixed z-[101] flex items-center gap-1 px-2.5 py-2 bg-card/80 border border-border/40 shadow-2xl rounded-full backdrop-blur-md transition-all duration-300
        bottom-6 right-6
        md:bottom-6 md:right-6
        max-md:left-1/2 max-md:right-auto max-md:-translate-x-1/2 max-md:bottom-5"
      aria-label="Social links"
      style={{ isolation: 'isolate' }}
    >
      {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-foreground/70 hover:text-accent hover:bg-secondary/50 rounded-full transition-colors"
          title={label}
        >
          <Icon size={18} strokeWidth={2} aria-hidden />
        </a>
      ))}
    </nav>
  )
}
