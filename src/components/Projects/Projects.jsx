import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import projectsData from '../../data/projects.json';
import { FaGithub, FaExternalLinkAlt, FaSearch, FaTimes } from 'react-icons/fa';
import './Projects.css';

const categories = ['all', 'embedded', 'iot', 'bms', 'automation'];

export default function Projects() {
  const { language } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  const filtered = projectsData.filter(p => {
    const matchCategory = activeCategory === 'all' || p.category === activeCategory;
    const title = p.title[language]?.toLowerCase() || '';
    const desc = p.description[language]?.toLowerCase() || '';
    const tech = p.technologies.join(' ').toLowerCase();
    const query = search.toLowerCase();
    const matchSearch = !search || title.includes(query) || desc.includes(query) || tech.includes(query);
    return matchCategory && matchSearch;
  });

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t('projects.title', language)}</h2>
          <p className="section-subtitle">{t('projects.subtitle', language)}</p>
        </div>

        <div className="projects-controls">
          <div className="projects-categories">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {t(`projects.${cat}`, language)}
              </button>
            ))}
          </div>
          <div className="projects-search">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder={t('projects.search', language)}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="projects-grid">
          {filtered.length > 0 ? filtered.map(project => (
            <div
              key={project.id}
              className="project-card glass-card"
              onClick={() => setSelectedProject(project)}
            >
              <div className="project-image">
                <img
                  src={project.images[0]}
                  alt={project.title[language]}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = `https://placehold.co/600x400/1a1a2e/00f0ff?text=${encodeURIComponent(project.title[language])}`;
                  }}
                />
                <div className="project-overlay">
                  <span className="project-view">{language === 'en' ? 'View Details' : 'عرض التفاصيل'}</span>
                </div>
              </div>
              <div className="project-info">
                <h3 className="project-title">{project.title[language]}</h3>
                <p className="project-desc">{project.description[language]}</p>
                <div className="project-techs">
                  {project.technologies.slice(0, 4).map((tech, i) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="tech-tag more">+{project.technologies.length - 4}</span>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="no-projects">
              <p>{t('projects.no_projects', language)}</p>
            </div>
          )}
        </div>
      </div>

      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProject(null)}>
              <FaTimes />
            </button>
            <div className="modal-gallery">
              <img
                src={selectedProject.images[0]}
                alt={selectedProject.title[language]}
                className="modal-image"
                onError={(e) => {
                  e.target.src = `https://placehold.co/800x500/1a1a2e/00f0ff?text=${encodeURIComponent(selectedProject.title[language])}`;
                }}
              />
              {selectedProject.images.length > 1 && (
                <div className="modal-thumbs">
                  {selectedProject.images.map((img, i) => (
                    <img key={i} src={img} alt="" className="modal-thumb" />
                  ))}
                </div>
              )}
            </div>
            <div className="modal-body">
              <h2 className="modal-title">{selectedProject.title[language]}</h2>
              <p className="modal-desc">{selectedProject.description[language]}</p>
              <div className="modal-techs">
                {selectedProject.technologies.map((tech, i) => (
                  <span key={i} className="tech-tag">{tech}</span>
                ))}
              </div>
              <div className="modal-links">
                {selectedProject.github && (
                  <a href={selectedProject.github} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                    <FaGithub /> {t('projects.view_github', language)}
                  </a>
                )}
                {selectedProject.live && (
                  <a href={selectedProject.live} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    <FaExternalLinkAlt /> {t('projects.view_live', language)}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
