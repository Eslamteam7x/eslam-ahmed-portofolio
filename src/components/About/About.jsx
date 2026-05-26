import { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { getPersonalInfo } from '../../utils/dataService';
import { FaCalendarAlt, FaProjectDiagram, FaSmile, FaAward } from 'react-icons/fa';
import './About.css';

export default function About() {
  const { language } = useApp();
  const [personalInfo] = useState(getPersonalInfo());

  const stats = [
    { key: 'projects', icon: FaProjectDiagram },
    { key: 'experience', icon: FaCalendarAlt },
    { key: 'clients', icon: FaSmile },
    { key: 'certificates', icon: FaAward },
  ];
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    const children = sectionRef.current?.querySelectorAll('.fade-in');
    children?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="section" ref={sectionRef}>
      <div className="container">
        <div className="section-header fade-in">
          <h2 className="section-title">{t('about.title', language)}</h2>
          <p className="section-subtitle">{t('about.subtitle', language)}</p>
        </div>

        <div className="about-grid">
          <div className="about-content fade-in">
            <p className="about-bio">
              {language === 'en' ? personalInfo.bio.en : personalInfo.bio.ar}
            </p>
            <div className="about-specs">
              <h3 className="about-specs-title">
                {language === 'en' ? 'Specializations' : 'التخصصات'}
              </h3>
              <div className="specs-list">
                {personalInfo.specializations.map((spec, i) => (
                  <span key={i} className="spec-tag">{spec}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="about-stats fade-in">
            {stats.map(({ key, icon: Icon }) => (
              <div key={key} className="stat-card glass-card">
                <Icon className="stat-icon" />
                <span className="stat-number">{personalInfo.stats[key]}+</span>
                <span className="stat-label">{t(`about.${key}`, language)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
