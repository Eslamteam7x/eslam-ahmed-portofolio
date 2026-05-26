import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { getServices } from '../../utils/dataService';
import { FaMicrochip, FaWifi, FaIndustry, FaDesktop, FaBuilding, FaReact } from 'react-icons/fa';
import './Services.css';

const iconMap = {
  FaMicrochip, FaWifi, FaIndustry, FaDesktop, FaBuilding, FaReact,
};

export default function Services() {
  const { language } = useApp();
  const [servicesData] = useState(getServices());

  return (
    <section id="services" className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t('services.title', language)}</h2>
          <p className="section-subtitle">{t('services.subtitle', language)}</p>
        </div>

        <div className="services-grid">
          {servicesData.map(service => {
            const Icon = iconMap[service.icon] || FaMicrochip;
            return (
              <div key={service.id} className="service-card glass-card">
                <div className="service-icon-wrapper">
                  <Icon className="service-icon" />
                </div>
                <h3 className="service-title">{service.title[language]}</h3>
                <p className="service-desc">{service.description[language]}</p>
                <ul className="service-features">
                  {service.features.map((f, i) => (
                    <li key={i} className="service-feature">{f[language]}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
