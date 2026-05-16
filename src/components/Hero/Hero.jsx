import { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { FaDownload, FaEnvelope, FaEye } from 'react-icons/fa';
import personalInfo from '../../data/personal_info.json';
import './Hero.css';

function createParticles(canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  const particles = [];
  const count = 80;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha})`;
      ctx.fill();
    });
    particles.forEach((a) => {
      particles.forEach((b) => {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.1 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
    requestAnimationFrame(animate);
  }
  animate();

  const onResize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}

export default function Hero() {
  const { language } = useApp();
  const canvasRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) createParticles(canvasRef.current);
  }, []);

  useEffect(() => {
    if (!textRef.current) return;
    const words = personalInfo.titles;
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout;

    function type() {
      const current = words[wordIndex];
      if (isDeleting) {
        textRef.current.textContent = current.substring(0, charIndex--);
        if (charIndex < 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          timeout = setTimeout(type, 500);
          return;
        }
        timeout = setTimeout(type, 50);
      } else {
        textRef.current.textContent = current.substring(0, charIndex++);
        if (charIndex > current.length) {
          isDeleting = true;
          timeout = setTimeout(type, 2000);
          return;
        }
        timeout = setTimeout(type, 100);
      }
    }
    type();
    return () => clearTimeout(timeout);
  }, [language]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero-section">
      <canvas ref={canvasRef} className="hero-canvas" />
      <div className="hero-overlay" />
      <div className="container hero-content">
        <div className="hero-text">
          <p className="hero-greeting">{t('hero.greeting', language)}</p>
          <h1 className="hero-name">{personalInfo.name}</h1>
          <div className="hero-typing">
            <span className="typing-label">{language === 'ar' ? 'أنا' : 'I am'}</span>
            <span ref={textRef} className="typing-text" />
            <span className="typing-cursor">|</span>
          </div>
          <div className="hero-buttons">
            <a href={personalInfo.cvUrl} download className="btn btn-primary">
              <FaDownload /> {t('hero.download_cv', language)}
            </a>
            <button onClick={() => scrollTo('contact')} className="btn btn-secondary">
              <FaEnvelope /> {t('hero.contact_me', language)}
            </button>
            <button onClick={() => scrollTo('projects')} className="btn btn-outline">
              <FaEye /> {t('hero.view_projects', language)}
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-avatar-wrapper">
            <div className="hero-avatar-glow" />
            <img
              src={personalInfo.avatar}
              alt={personalInfo.name}
              className="hero-avatar"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hero-avatar-placeholder">
              <span>{personalInfo.name.split(' ').map(n => n[0]).join('')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
