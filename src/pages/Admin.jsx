import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/translations';
import { getProjects, saveProjects } from '../utils/dataService';
import { FaLock, FaUser, FaSignOutAlt, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import './Admin.css';

const ADMIN_CREDENTIALS = {
  username: 'Eslam Ahmed',
  password: 'Eslam@2026',
};

export default function Admin() {
  const { language, isAdmin, setIsAdmin, setAdminUser } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (isAdmin) setProjects(getProjects());
  }, [isAdmin]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAdmin(true);
      setAdminUser(username);
      setLoginError(false);
      setProjects(getProjects());
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setAdminUser(null);
    setUsername('');
    setPassword('');
  };

  const handleDelete = (id) => {
    if (window.confirm(t('admin.confirm_delete', language))) {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      saveProjects(updated);
    }
  };

  const handleSave = (project) => {
    let updated;
    if (editing) {
      updated = projects.map(p => p.id === project.id ? project : p);
    } else {
      updated = [...projects, { ...project, id: Date.now() }];
    }
    setProjects(updated);
    saveProjects(updated);
    setEditing(null);
    setShowForm(false);
  };

  if (!isAdmin) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card glass-card">
          <FaLock className="admin-login-icon" />
          <h2>{t('admin.login', language)}</h2>
          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                placeholder={language === 'en' ? 'Username' : 'اسم المستخدم'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                autoFocus
              />
            </div>
            <div className="form-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder={t('admin.password', language)}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>
            {loginError && (
              <p className="form-status error">
                {language === 'en' ? 'Invalid credentials' : 'بيانات الدخول غير صحيحة'}
              </p>
            )}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <FaLock /> {t('admin.login', language)}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard" style={{ paddingTop: '100px' }}>
      <div className="container">
        <div className="admin-header">
          <h1 className="section-title">{t('admin.dashboard', language)}</h1>
          <div className="admin-header-actions">
            <span className="admin-user-badge">
              <FaUser /> {language === 'en' ? 'Welcome' : 'مرحباً'}, Eslam Ahmed
            </span>
            <button onClick={handleLogout} className="btn btn-secondary">
              <FaSignOutAlt /> {t('admin.logout', language)}
            </button>
          </div>
        </div>

        <div className="admin-toolbar">
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn btn-primary">
            <FaPlus /> {t('admin.add_project', language)}
          </button>
        </div>

        <div className="admin-table-wrapper glass-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{language === 'en' ? 'Title (EN)' : 'العنوان (EN)'}</th>
                <th>{language === 'en' ? 'Category' : 'التصنيف'}</th>
                <th>{language === 'en' ? 'Actions' : 'الإجراءات'}</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id}>
                  <td>#{project.id}</td>
                  <td>{project.title.en}</td>
                  <td><span className="category-badge">{project.category}</span></td>
                  <td className="actions-cell">
                    <button onClick={() => { setEditing(project); setShowForm(true); }} className="action-btn edit">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(project.id)} className="action-btn delete">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <ProjectForm
            project={editing}
            language={language}
            onSave={handleSave}
            onCancel={() => { setEditing(null); setShowForm(false); }}
          />
        )}
      </div>
    </div>
  );
}

function ProjectForm({ project, language, onSave, onCancel }) {
  const [form, setForm] = useState(project || {
    title: { en: '', ar: '' },
    description: { en: '', ar: '' },
    category: 'embedded',
    technologies: [],
    images: [''],
    github: '',
    live: '',
    featured: false,
  });

  const [techInput, setTechInput] = useState('');

  const addTech = () => {
    if (techInput.trim()) {
      setForm(prev => ({ ...prev, technologies: [...prev.technologies, techInput.trim()] }));
      setTechInput('');
    }
  };

  const removeTech = (idx) => {
    setForm(prev => ({ ...prev, technologies: prev.technologies.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="admin-form glass-card" onClick={e => e.stopPropagation()}>
        <div className="admin-form-header">
          <h3>{project ? t('admin.edit_project', language) : t('admin.add_project', language)}</h3>
          <button onClick={onCancel} className="modal-close"><FaTimes /></button>
        </div>
        <form onSubmit={handleSubmit} className="admin-form-body">
          <div className="form-row">
            <div className="form-group">
              <label>Title (EN)</label>
              <input
                type="text"
                value={form.title.en}
                onChange={e => setForm(prev => ({ ...prev, title: { ...prev.title, en: e.target.value } }))}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label>Title (AR)</label>
              <input
                type="text"
                value={form.title.ar}
                onChange={e => setForm(prev => ({ ...prev, title: { ...prev.title, ar: e.target.value } }))}
                className="form-input"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Description (EN)</label>
              <textarea
                value={form.description.en}
                onChange={e => setForm(prev => ({ ...prev, description: { ...prev.description, en: e.target.value } }))}
                className="form-input form-textarea"
                rows={3}
                required
              />
            </div>
            <div className="form-group">
              <label>Description (AR)</label>
              <textarea
                value={form.description.ar}
                onChange={e => setForm(prev => ({ ...prev, description: { ...prev.description, ar: e.target.value } }))}
                className="form-input form-textarea"
                rows={3}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={form.category}
                onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                className="form-input"
              >
                <option value="embedded">Embedded Systems</option>
                <option value="iot">IoT</option>
                <option value="bms">BMS</option>
                <option value="automation">Automation</option>
              </select>
            </div>
            <div className="form-group">
              <label>Technologies</label>
              <div className="tech-input-group">
                <input
                  type="text"
                  value={techInput}
                  onChange={e => setTechInput(e.target.value)}
                  className="form-input"
                  placeholder="Add technology..."
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())}
                />
                <button type="button" onClick={addTech} className="btn btn-primary" style={{ padding: '10px 16px' }}>+</button>
              </div>
              <div className="tech-list">
                {form.technologies.map((tech, i) => (
                  <span key={i} className="tech-tag">
                    {tech}
                    <button type="button" onClick={() => removeTech(i)} className="tech-remove">&times;</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="text"
                value={form.images[0]}
                onChange={e => setForm(prev => ({ ...prev, images: [e.target.value] }))}
                className="form-input"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>GitHub URL</label>
              <input
                type="text"
                value={form.github}
                onChange={e => setForm(prev => ({ ...prev, github: e.target.value }))}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Live URL</label>
              <input
                type="text"
                value={form.live}
                onChange={e => setForm(prev => ({ ...prev, live: e.target.value }))}
                className="form-input"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={e => setForm(prev => ({ ...prev, featured: e.target.checked }))}
                />
                Featured
              </label>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              <FaSave /> {t('admin.save', language)}
            </button>
            <button type="button" onClick={onCancel} className="btn btn-outline">
              <FaTimes /> {t('admin.cancel', language)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
