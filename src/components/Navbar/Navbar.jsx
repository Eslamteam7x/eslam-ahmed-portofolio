import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { HiMenu, HiX } from 'react-icons/hi';
import { BsSun, BsMoon, BsTranslate } from 'react-icons/bs';
import './Navbar.css';

const navLinks = [
  { key: 'home', path: '/#home' },
  { key: 'about', path: '/#about' },
  { key: 'skills', path: '/#skills' },
  { key: 'projects', path: '/#projects' },
  { key: 'experience', path: '/#experience' },
  { key: 'services', path: '/#services' },
  { key: 'contact', path: '/#contact' },
];

export default function Navbar() {
  const { language, toggleLanguage, theme, toggleTheme } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (path) => {
    setMobileOpen(false);
    if (path.startsWith('/#')) {
      const id = path.slice(2);
      if (location.pathname !== '/') {
        window.location.href = '/';
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="logo" onClick={() => setMobileOpen(false)}>
          <span className="logo-text gradient-text">&lt;EA /&gt;</span>
        </Link>

        <div className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <a
              key={link.key}
              href={link.path}
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.path);
              }}
            >
              {t(`nav.${link.key}`, language)}
            </a>
          ))}
          <Link to="/admin" className="nav-link admin-link" onClick={() => setMobileOpen(false)}>
            {t('nav.admin', language)}
          </Link>
        </div>

        <div className="nav-actions">
          <button onClick={toggleLanguage} className="nav-icon-btn" title={t('language.en', language)}>
            <BsTranslate />
            <span className="lang-label">{language === 'en' ? 'AR' : 'EN'}</span>
          </button>
          <button onClick={toggleTheme} className="nav-icon-btn" title={t('theme.dark', language)}>
            {theme === 'dark' ? <BsSun /> : <BsMoon />}
          </button>
          <button className="nav-icon-btn mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
}
