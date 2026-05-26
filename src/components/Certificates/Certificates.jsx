import { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { t, formatDate } from '../../utils/translations';
import { getCertificates } from '../../utils/dataService';
import { getImageSrc } from '../../utils/imageService';
import { FaExternalLinkAlt, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Certificates.css';

export default function Certificates() {
  const { language } = useApp();
  const [certificatesData] = useState(getCertificates());
  const [selected, setSelected] = useState(null);
  const [slideIdx, setSlideIdx] = useState(0);
  const sliderRef = useRef(null);

  const nextSlide = () => setSlideIdx(prev => (prev + 1) % certificatesData.length);
  const prevSlide = () => setSlideIdx(prev => (prev - 1 + certificatesData.length) % certificatesData.length);

  return (
    <section id="certificates" className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t('certificates.title', language)}</h2>
          <p className="section-subtitle">{t('certificates.subtitle', language)}</p>
        </div>

        <div className="certificates-slider" ref={sliderRef}>
          <div className="slider-wrapper">
            {certificatesData.map((cert, idx) => (
              <div
                key={cert.id}
                className={`cert-slide ${idx === slideIdx ? 'active' : ''}`}
                style={{ transform: `translateX(${(idx - slideIdx) * 100}%)` }}
              >
                <div className="cert-card glass-card" onClick={() => setSelected(cert)}>
                  <div className="cert-image">
                    <img
                      src={getImageSrc(cert.image)}
                      alt={cert.title[language]}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = `https://placehold.co/400x280/1a1a2e/00f0ff?text=Certificate`;
                      }}
                    />
                  </div>
                  <div className="cert-body">
                    <h3 className="cert-title">{cert.title[language]}</h3>
                    <p className="cert-issuer">{cert.issuer}</p>
                    <span className="cert-date">{formatDate(cert.date, language)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="slider-btn prev" onClick={prevSlide}><FaChevronLeft /></button>
          <button className="slider-btn next" onClick={nextSlide}><FaChevronRight /></button>
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="cert-fullscreen" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}><FaTimes /></button>
            <img
              src={getImageSrc(selected.image)}
              alt={selected.title[language]}
              onError={(e) => {
                e.target.src = `https://placehold.co/800x600/1a1a2e/00f0ff?text=Certificate`;
              }}
            />
            <div className="cert-full-info">
              <h3>{selected.title[language]}</h3>
              <p>{selected.issuer} - {formatDate(selected.date, language)}</p>
              {selected.link && (
                <a href={selected.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <FaExternalLinkAlt /> Verify
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
