import { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { getPersonalInfo } from '../../utils/dataService';
import { FaProjectDiagram, FaCalendarAlt, FaSmile, FaAward } from 'react-icons/fa';
import './Statistics.css';

function Counter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const start = performance.now();
          const step = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref} className="stat-number">{count}+</span>;
}

export default function Statistics() {
  const { language } = useApp();
  const personalInfo = getPersonalInfo();

  const statConfig = [
    { key: 'projects', icon: FaProjectDiagram, value: personalInfo.stats.projects },
    { key: 'experience', icon: FaCalendarAlt, value: personalInfo.stats.experience },
    { key: 'clients', icon: FaSmile, value: personalInfo.stats.clients },
    { key: 'certificates', icon: FaAward, value: personalInfo.stats.certificates },
  ];

  return (
    <section className="section statistics-section">
      <div className="container">
        <div className="statistics-grid">
          {statConfig.map(({ key, icon: Icon, value }) => (
            <div key={key} className="stat-item">
              <Icon className="stat-icon" />
              <Counter target={value} />
              <span className="stat-desc">{t(`statistics.${key}`, language)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
