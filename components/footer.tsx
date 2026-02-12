import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary/50 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
                <span className="text-foreground font-display font-bold">V</span>
              </div>
              <span className="font-display font-bold text-lg">Vercera</span>
            </div>
            <p className="text-foreground/60 text-sm">
              National-level technical fest bringing together innovators and builders from across the country.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#home" className="text-foreground/60 hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#events" className="text-foreground/60 hover:text-accent transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-foreground/60 hover:text-accent transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-foreground/60 hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-bold text-foreground">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/rules" className="text-foreground/60 hover:text-accent transition-colors">
                  Rules & Guidelines
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="text-foreground/60 hover:text-accent transition-colors">
                  Schedule
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-foreground/60 hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-foreground/60 hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-foreground">Get in Touch</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Mail size={16} className="text-accent flex-shrink-0 mt-0.5" />
                <a href="mailto:info@vercera.com" className="text-foreground/60 hover:text-accent transition-colors">
                  info@vercera.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={16} className="text-accent flex-shrink-0 mt-0.5" />
                <a href="tel:+919999999999" className="text-foreground/60 hover:text-accent transition-colors">
                  +91 9999 999 999
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-accent flex-shrink-0 mt-0.5" />
                <span className="text-foreground/60">Tech Campus, Innovation Hub, City</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-foreground/60 text-sm">
          <p>&copy; {currentYear} Vercera Technical Fest. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-accent transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              LinkedIn
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
