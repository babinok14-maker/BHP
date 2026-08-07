import { ArrowUp, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'
import './Footer.css'

const LINK_COLS = [
  ['About', 'Investors', 'Careers', 'Suppliers'],
  ['What we do', 'Sustainability', 'News', 'Contact us'],
]

const LEGAL = ['Privacy Policy', 'Modern Slavery Act Statement', 'Terms of use', 'Cookie Preferences']

function XLogo(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function TikTokLogo(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
      <path d="M16.6 5.82c-.87-.85-1.4-2.02-1.4-3.32h-3.45v13.6a2.83 2.83 0 1 1-2-2.71v-3.5a6.3 6.3 0 1 0 5.45 6.24V9.3a8.2 8.2 0 0 0 4.9 1.62V7.5a4.85 4.85 0 0 1-3.5-1.68z" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__scroll-wrap">
        <button
          className="footer__scroll-top"
          aria-label="Scroll to top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp size={20} />
        </button>
      </div>

      <div className="container footer__main">
        <div className="footer__brand">
          <span className="footer__logo">BHP</span>
          <p>&copy; BHP 2026</p>
        </div>

        <nav className="footer__links" aria-label="Footer">
          {LINK_COLS.map((col, i) => (
            <ul key={i}>
              {col.map((link) => (
                <li key={link}><a href="#top">{link}</a></li>
              ))}
            </ul>
          ))}
        </nav>
      </div>

      <div className="container footer__bottom">
        <div className="footer__social">
          <span>Follow us on</span>
          <a href="#top" aria-label="Facebook"><Facebook size={18} /></a>
          <a href="#top" aria-label="Instagram"><Instagram size={18} /></a>
          <a href="#top" aria-label="LinkedIn"><Linkedin size={18} /></a>
          <a href="#top" aria-label="X"><XLogo /></a>
          <a href="#top" aria-label="YouTube"><Youtube size={18} /></a>
          <a href="#top" aria-label="TikTok"><TikTokLogo /></a>
        </div>

        <div className="footer__legal">
          {LEGAL.map((item) => (
            <a href="#top" key={item}>{item}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}
