import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import './Footer.css';

export default function Footer() {
  const { language } = useApp();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-links">
          {['home', 'about', 'skills', 'projects', 'experience', 'services', 'contact'].map(key => (
            <button key={key} onClick={() => scrollTo(key === 'home' ? 'home' : key)} className="footer-link">
              {t(`nav.${key}`, language)}
            </button>
          ))}
        </div>
        <p className="footer-text">
          {t('footer.made_with', language)} ❤️ by {language === 'en' ? 'Eslam Ahmed' : 'إسلام أحمد'}
        </p>
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} {t('footer.rights', language)}
        </p>
      </div>
    </footer>
  );
}
