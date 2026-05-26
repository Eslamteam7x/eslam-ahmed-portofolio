import { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { getPersonalInfo } from '../../utils/dataService';
import { FaPaperPlane, FaGithub, FaLinkedin, FaTwitter, FaYoutube, FaFacebook } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import './Contact.css';

const socialIcons = {
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  youtube: FaYoutube,
  facebook: FaFacebook,
};

export default function Contact() {
  const { language } = useApp();
  const formRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const personalInfo = getPersonalInfo();

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = t('contact.required', language);
    if (!form.email.trim()) errs.email = t('contact.required', language);
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t('contact.invalid_email', language);
    if (!form.subject.trim()) errs.subject = t('contact.required', language);
    if (!form.message.trim()) errs.message = t('contact.required', language);
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('sending');
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          subject: form.subject,
          message: form.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t('contact.title', language)}</h2>
          <p className="section-subtitle">{t('contact.subtitle', language)}</p>
        </div>

        <div className="contact-grid">
          <form ref={formRef} onSubmit={handleSubmit} className="contact-form glass-card">
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder={t('contact.name', language)}
                value={form.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder={t('contact.email', language)}
                value={form.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <input
                type="text"
                name="subject"
                placeholder={t('contact.subject', language)}
                value={form.subject}
                onChange={handleChange}
                className={`form-input ${errors.subject ? 'error' : ''}`}
              />
              {errors.subject && <span className="form-error">{errors.subject}</span>}
            </div>
            <div className="form-group">
              <textarea
                name="message"
                placeholder={t('contact.message', language)}
                value={form.message}
                onChange={handleChange}
                className={`form-input form-textarea ${errors.message ? 'error' : ''}`}
                rows={5}
              />
              {errors.message && <span className="form-error">{errors.message}</span>}
            </div>
            <button
              type="submit"
              className="btn btn-primary submit-btn"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? t('contact.sending', language) : (
                <><FaPaperPlane /> {t('contact.send', language)}</>
              )}
            </button>
            {status === 'success' && (
              <p className="form-status success">{t('contact.success', language)}</p>
            )}
            {status === 'error' && (
              <p className="form-status error">{t('contact.error', language)}</p>
            )}
          </form>

          <div className="contact-info">
            <div className="contact-details glass-card">
              <h3 className="contact-info-title">
                {language === 'en' ? 'Contact Information' : 'معلومات الاتصال'}
              </h3>
              <p className="contact-detail"><strong>Email:</strong> {personalInfo.email}</p>
              <p className="contact-detail"><strong>Phone:</strong> {personalInfo.phone}</p>
              <p className="contact-detail"><strong>Location:</strong> {personalInfo.location}</p>
            </div>

            <div className="contact-social glass-card">
              <h3 className="contact-info-title">
                {language === 'en' ? 'Follow Me' : 'تابعني'}
              </h3>
              <div className="social-links">
                {Object.entries(personalInfo.social).map(([key, url]) => {
                  const Icon = socialIcons[key];
                  if (!Icon) return null;
                  return (
                    <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="social-link">
                      <Icon />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="contact-map glass-card">
              <iframe
                title="location"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(personalInfo.location)}&output=embed`}
                width="100%"
                height="200"
                style={{ borderRadius: '12px', border: 'none' }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
