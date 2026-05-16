import { useApp } from '../../context/AppContext';
import { t, getPeriodText } from '../../utils/translations';
import experienceData from '../../data/experience.json';
import './Experience.css';

export default function Experience() {
  const { language } = useApp();

  return (
    <section id="experience" className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t('experience.title', language)}</h2>
          <p className="section-subtitle">{t('experience.subtitle', language)}</p>
        </div>

        <div className="timeline">
          {experienceData.map((exp, idx) => (
            <div key={exp.id} className="timeline-item" style={{ '--delay': `${idx * 0.2}s` }}>
              <div className="timeline-dot" />
              <div className="timeline-content glass-card">
                <div className="timeline-period">
                  {getPeriodText(exp.period.start, exp.period.end, language)}
                </div>
                <h3 className="timeline-position">{exp.position[language]}</h3>
                <h4 className="timeline-company">{exp.company}</h4>
                <p className="timeline-desc">{exp.description[language]}</p>
                {exp.achievements && (
                  <ul className="timeline-achievements">
                    {exp.achievements.map((ach, i) => (
                      <li key={i} className="achievement-item">{ach[language]}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
