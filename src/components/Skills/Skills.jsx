import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import skillsData from '../../data/skills.json';
import { FaMicrochip, FaIndustry, FaLaptopCode } from 'react-icons/fa';
import './Skills.css';

const iconMap = {
  FaMicrochip: FaMicrochip,
  FaIndustry: FaIndustry,
  FaLaptopCode: FaLaptopCode,
};

export default function Skills() {
  const { language } = useApp();

  return (
    <section id="skills" className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t('skills.title', language)}</h2>
          <p className="section-subtitle">{t('skills.subtitle', language)}</p>
        </div>

        <div className="skills-grid">
          {skillsData.categories.map((category, idx) => {
            const Icon = iconMap[category.icon] || FaLaptopCode;
            return (
              <div key={idx} className="skill-category glass-card">
                <div className="skill-category-header">
                  <Icon className="category-icon" />
                  <h3 className="category-name">{category.name}</h3>
                </div>
                <div className="skill-items">
                  {category.skills.map((skill, i) => (
                    <div key={i} className="skill-item">
                      <div className="skill-info">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-level">{skill.level}%</span>
                      </div>
                      <div className="skill-bar">
                        <div
                          className="skill-bar-fill"
                          style={{ '--width': `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
