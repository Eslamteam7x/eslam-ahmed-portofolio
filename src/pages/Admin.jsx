import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/translations';
import {
  getProjects, saveProjects,
  getSkills, saveSkills,
  getExperience, saveExperience,
  getCertificates, saveCertificates,
  getServices, saveServices,
  getPersonalInfo, savePersonalInfo,
  getAllDataForPublish,
} from '../utils/dataService';
import {
  isGitHubConfigured, setGitHubToken, clearGitHubToken,
  commitImage, publishAllData,
} from '../utils/githubService';
import { saveImageLocally, getLocalImage, getAllLocalImages } from '../utils/imageService';
import {
  FaLock, FaUser, FaSignOutAlt, FaPlus, FaEdit, FaTrash, FaSave, FaTimes,
  FaCog, FaProjectDiagram, FaCode, FaBriefcase, FaCertificate, FaConciergeBell,
  FaInfoCircle, FaImage, FaGitAlt, FaCheck, FaSpinner, FaUpload, FaLink,
} from 'react-icons/fa';
import './Admin.css';

const TABS = [
  { id: 'projects', label: { en: 'Projects', ar: 'المشاريع' }, icon: FaProjectDiagram },
  { id: 'skills', label: { en: 'Skills', ar: 'المهارات' }, icon: FaCode },
  { id: 'experience', label: { en: 'Experience', ar: 'الخبرات' }, icon: FaBriefcase },
  { id: 'certificates', label: { en: 'Certificates', ar: 'الشهادات' }, icon: FaCertificate },
  { id: 'services', label: { en: 'Services', ar: 'الخدمات' }, icon: FaConciergeBell },
  { id: 'personal', label: { en: 'Personal Info', ar: 'المعلومات الشخصية' }, icon: FaInfoCircle },
  { id: 'settings', label: { en: 'Settings', ar: 'الإعدادات' }, icon: FaCog },
];

export default function Admin() {
  const { language, isAdmin, setIsAdmin, setAdminUser } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');

  useEffect(() => {
    if (isAdmin) setActiveTab('projects');
  }, [isAdmin]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'Eslam Ahmed' && password === 'Eslam@2026') {
      setIsAdmin(true);
      setAdminUser(username);
      setLoginError(false);
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

        <div className="admin-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon /> {tab.label[language]}
            </button>
          ))}
        </div>

        <div className="admin-tab-content">
          {activeTab === 'projects' && <ProjectsManager language={language} />}
          {activeTab === 'skills' && <SkillsManager language={language} />}
          {activeTab === 'experience' && <ExperienceManager language={language} />}
          {activeTab === 'certificates' && <CertificatesManager language={language} />}
          {activeTab === 'services' && <ServicesManager language={language} />}
          {activeTab === 'personal' && <PersonalInfoManager language={language} />}
          {activeTab === 'settings' && <SettingsPanel language={language} />}
        </div>
      </div>
    </div>
  );
}

/* ---------- Projects Manager ---------- */
function ProjectsManager({ language }) {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { setProjects(getProjects()); }, []);

  const refresh = () => setProjects(getProjects());

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

  return (
    <div>
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
                  <button onClick={() => { setEditing(project); setShowForm(true); }} className="action-btn edit"><FaEdit /></button>
                  <button onClick={() => handleDelete(project.id)} className="action-btn delete"><FaTrash /></button>
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
  );
}

function ProjectForm({ project, language, onSave, onCancel }) {
  const [form, setForm] = useState(project || {
    title: { en: '', ar: '' }, description: { en: '', ar: '' },
    category: 'embedded', technologies: [], images: [''],
    github: '', live: '', featured: false,
  });
  const [techInput, setTechInput] = useState('');

  const addTech = () => {
    if (techInput.trim()) {
      setForm(prev => ({ ...prev, technologies: [...prev.technologies, techInput.trim()] }));
      setTechInput('');
    }
  };
  const removeTech = (idx) => setForm(prev => ({ ...prev, technologies: prev.technologies.filter((_, i) => i !== idx) }));

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="admin-form glass-card" onClick={e => e.stopPropagation()}>
        <div className="admin-form-header">
          <h3>{project ? t('admin.edit_project', language) : t('admin.add_project', language)}</h3>
          <button onClick={onCancel} className="modal-close"><FaTimes /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="admin-form-body">
          <div className="form-row">
            <div className="form-group">
              <label>Title (EN)</label>
              <input type="text" value={form.title.en} onChange={e => setForm(prev => ({ ...prev, title: { ...prev.title, en: e.target.value } }))} className="form-input" required />
            </div>
            <div className="form-group">
              <label>Title (AR)</label>
              <input type="text" value={form.title.ar} onChange={e => setForm(prev => ({ ...prev, title: { ...prev.title, ar: e.target.value } }))} className="form-input" required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Description (EN)</label>
              <textarea value={form.description.en} onChange={e => setForm(prev => ({ ...prev, description: { ...prev.description, en: e.target.value } }))} className="form-input form-textarea" rows={3} required />
            </div>
            <div className="form-group">
              <label>Description (AR)</label>
              <textarea value={form.description.ar} onChange={e => setForm(prev => ({ ...prev, description: { ...prev.description, ar: e.target.value } }))} className="form-input form-textarea" rows={3} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))} className="form-input">
                <option value="embedded">Embedded Systems</option>
                <option value="iot">IoT</option>
                <option value="bms">BMS</option>
                <option value="automation">Automation</option>
              </select>
            </div>
            <div className="form-group">
              <label>Technologies</label>
              <div className="tech-input-group">
                <input type="text" value={techInput} onChange={e => setTechInput(e.target.value)} className="form-input" placeholder="Add..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())} />
                <button type="button" onClick={addTech} className="btn btn-primary" style={{ padding: '10px 16px' }}>+</button>
              </div>
              <div className="tech-list">
                {form.technologies.map((tech, i) => (
                  <span key={i} className="tech-tag">{tech}<button type="button" onClick={() => removeTech(i)} className="tech-remove">&times;</button></span>
                ))}
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Image URL</label>
              <input type="text" value={form.images[0]} onChange={e => setForm(prev => ({ ...prev, images: [e.target.value] }))} className="form-input" />
              <ImageUploader language={language} onUpload={(url) => setForm(prev => ({ ...prev, images: [url] }))} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>GitHub URL</label>
              <input type="text" value={form.github} onChange={e => setForm(prev => ({ ...prev, github: e.target.value }))} className="form-input" />
            </div>
            <div className="form-group">
              <label>Live URL</label>
              <input type="text" value={form.live} onChange={e => setForm(prev => ({ ...prev, live: e.target.value }))} className="form-input" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group checkbox-group">
              <label><input type="checkbox" checked={form.featured} onChange={e => setForm(prev => ({ ...prev, featured: e.target.checked }))} /> Featured</label>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary"><FaSave /> {t('admin.save', language)}</button>
            <button type="button" onClick={onCancel} className="btn btn-outline"><FaTimes /> {t('admin.cancel', language)}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- Skills Manager ---------- */
function SkillsManager({ language }) {
  const [data, setData] = useState(null);
  useEffect(() => { setData(getSkills()); }, []);

  if (!data) return null;

  const addCategory = () => {
    const name = prompt(language === 'en' ? 'Category name:' : 'اسم التصنيف:');
    if (!name) return;
    const updated = { ...data, categories: [...data.categories, { name, icon: 'FaCode', skills: [] }] };
    setData(updated);
    saveSkills(updated);
  };

  const addSkill = (catIdx) => {
    const name = prompt(language === 'en' ? 'Skill name:' : 'اسم المهارة:');
    if (!name) return;
    const level = parseInt(prompt(language === 'en' ? 'Level (0-100):' : 'المستوى (0-100):') || '50', 10);
    const updated = { ...data, categories: data.categories.map((c, i) =>
      i === catIdx ? { ...c, skills: [...c.skills, { name, level, icon: c.icon }] } : c
    )};
    setData(updated);
    saveSkills(updated);
  };

  const deleteSkill = (catIdx, skillIdx) => {
    if (!window.confirm(language === 'en' ? 'Delete this skill?' : 'حذف هذه المهارة؟')) return;
    const updated = { ...data, categories: data.categories.map((c, i) =>
      i === catIdx ? { ...c, skills: c.skills.filter((_, si) => si !== skillIdx) } : c
    )};
    setData(updated);
    saveSkills(updated);
  };

  return (
    <div>
      <div className="admin-toolbar">
        <button onClick={addCategory} className="btn btn-primary"><FaPlus /> {language === 'en' ? 'Add Category' : 'إضافة تصنيف'}</button>
      </div>
      <div className="admin-grid">
        {data.categories.map((cat, ci) => (
          <div key={ci} className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ marginBottom: '15px', color: 'var(--primary)' }}>{cat.name}</h3>
            {cat.skills.map((skill, si) => (
              <div key={si} className="admin-list-item">
                <span>{skill.name} ({skill.level}%)</span>
                <button onClick={() => deleteSkill(ci, si)} className="action-btn delete" style={{ width: '28px', height: '28px' }}><FaTrash style={{ fontSize: '0.7rem' }} /></button>
              </div>
            ))}
            <button onClick={() => addSkill(ci)} className="btn btn-outline" style={{ marginTop: '10px', width: '100%', fontSize: '0.85rem' }}><FaPlus /> {language === 'en' ? 'Add Skill' : 'إضافة مهارة'}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Experience Manager ---------- */
function ExperienceManager({ language }) {
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  useEffect(() => { setData(getExperience()); }, []);

  const handleSave = (item) => {
    let updated;
    if (editing) {
      updated = data.map(e => e.id === item.id ? item : e);
    } else {
      updated = [...data, { ...item, id: Date.now() }];
    }
    setData(updated);
    saveExperience(updated);
    setEditing(null);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm(t('admin.confirm_delete', language))) return;
    const updated = data.filter(e => e.id !== id);
    setData(updated);
    saveExperience(updated);
  };

  return (
    <div>
      <div className="admin-toolbar">
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn btn-primary"><FaPlus /> {language === 'en' ? 'Add Experience' : 'إضافة خبرة'}</button>
      </div>
      <div className="admin-table-wrapper glass-card">
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>{language === 'en' ? 'Company' : 'الشركة'}</th><th>{language === 'en' ? 'Position (EN)' : 'المسمى (EN)'}</th><th>{language === 'en' ? 'Period' : 'الفترة'}</th><th>{language === 'en' ? 'Actions' : 'الإجراءات'}</th></tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td>#{item.id}</td>
                <td>{item.company}</td>
                <td>{item.position.en}</td>
                <td>{item.period.start} - {item.period.end}</td>
                <td className="actions-cell">
                  <button onClick={() => { setEditing(item); setShowForm(true); }} className="action-btn edit"><FaEdit /></button>
                  <button onClick={() => handleDelete(item.id)} className="action-btn delete"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && <ExperienceForm experience={editing} language={language} onSave={handleSave} onCancel={() => { setEditing(null); setShowForm(false); }} />}
    </div>
  );
}

function ExperienceForm({ experience, language, onSave, onCancel }) {
  const [form, setForm] = useState(experience || {
    company: '', position: { en: '', ar: '' }, period: { start: '', end: '' },
    description: { en: '', ar: '' }, achievements: [],
  });
  const [achInput, setAchInput] = useState('');

  const addAch = () => {
    if (achInput.trim()) {
      setForm(prev => ({ ...prev, achievements: [...prev.achievements, { en: achInput.trim(), ar: achInput.trim() }] }));
      setAchInput('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="admin-form glass-card" onClick={e => e.stopPropagation()}>
        <div className="admin-form-header">
          <h3>{experience ? (language === 'en' ? 'Edit Experience' : 'تعديل الخبرة') : (language === 'en' ? 'Add Experience' : 'إضافة خبرة')}</h3>
          <button onClick={onCancel} className="modal-close"><FaTimes /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="admin-form-body">
          <div className="form-row">
            <div className="form-group"><label>{language === 'en' ? 'Company' : 'الشركة'}</label><input type="text" value={form.company} onChange={e => setForm(prev => ({ ...prev, company: e.target.value }))} className="form-input" required /></div>
            <div className="form-group"><label>Position (EN)</label><input type="text" value={form.position.en} onChange={e => setForm(prev => ({ ...prev, position: { ...prev.position, en: e.target.value } }))} className="form-input" required /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Position (AR)</label><input type="text" value={form.position.ar} onChange={e => setForm(prev => ({ ...prev, position: { ...prev.position, ar: e.target.value } }))} className="form-input" required /></div>
            <div className="form-group" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ flex: 1 }}><label>{language === 'en' ? 'Start' : 'البداية'}</label><input type="text" value={form.period.start} onChange={e => setForm(prev => ({ ...prev, period: { ...prev.period, start: e.target.value } }))} className="form-input" placeholder="2023-01" /></div>
              <div style={{ flex: 1 }}><label>{language === 'en' ? 'End' : 'النهاية'}</label><input type="text" value={form.period.end} onChange={e => setForm(prev => ({ ...prev, period: { ...prev.period, end: e.target.value } }))} className="form-input" placeholder="present" /></div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Description (EN)</label><textarea value={form.description.en} onChange={e => setForm(prev => ({ ...prev, description: { ...prev.description, en: e.target.value } }))} className="form-input form-textarea" rows={2} /></div>
            <div className="form-group"><label>Description (AR)</label><textarea value={form.description.ar} onChange={e => setForm(prev => ({ ...prev, description: { ...prev.description, ar: e.target.value } }))} className="form-input form-textarea" rows={2} /></div>
          </div>
          <div className="form-group">
            <label>{language === 'en' ? 'Achievements' : 'الإنجازات'}</label>
            <div className="tech-input-group">
              <input type="text" value={achInput} onChange={e => setAchInput(e.target.value)} className="form-input" placeholder="Add achievement..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAch())} />
              <button type="button" onClick={addAch} className="btn btn-primary" style={{ padding: '10px 16px' }}>+</button>
            </div>
            <div className="tech-list">
              {form.achievements.map((a, i) => (
                <span key={i} className="tech-tag">{a.en}<button type="button" onClick={() => setForm(prev => ({ ...prev, achievements: prev.achievements.filter((_, idx) => idx !== i) }))} className="tech-remove">&times;</button></span>
              ))}
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary"><FaSave /> {t('admin.save', language)}</button>
            <button type="button" onClick={onCancel} className="btn btn-outline"><FaTimes /> {t('admin.cancel', language)}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- Certificates Manager ---------- */
function CertificatesManager({ language }) {
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  useEffect(() => { setData(getCertificates()); }, []);

  const handleSave = (item) => {
    let updated;
    if (editing) {
      updated = data.map(c => c.id === item.id ? item : c);
    } else {
      updated = [...data, { ...item, id: Date.now() }];
    }
    setData(updated);
    saveCertificates(updated);
    setEditing(null);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm(t('admin.confirm_delete', language))) return;
    const updated = data.filter(c => c.id !== id);
    setData(updated);
    saveCertificates(updated);
  };

  return (
    <div>
      <div className="admin-toolbar">
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn btn-primary"><FaPlus /> {language === 'en' ? 'Add Certificate' : 'إضافة شهادة'}</button>
      </div>
      <div className="admin-table-wrapper glass-card">
        <table className="admin-table">
          <thead><tr><th>ID</th><th>{language === 'en' ? 'Title (EN)' : 'العنوان (EN)'}</th><th>{language === 'en' ? 'Issuer' : 'الجهة'}</th><th>{language === 'en' ? 'Date' : 'التاريخ'}</th><th>{language === 'en' ? 'Actions' : 'الإجراءات'}</th></tr></thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td>#{item.id}</td>
                <td>{item.title.en}</td>
                <td>{item.issuer}</td>
                <td>{item.date}</td>
                <td className="actions-cell">
                  <button onClick={() => { setEditing(item); setShowForm(true); }} className="action-btn edit"><FaEdit /></button>
                  <button onClick={() => handleDelete(item.id)} className="action-btn delete"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && <CertificateForm certificate={editing} language={language} onSave={handleSave} onCancel={() => { setEditing(null); setShowForm(false); }} />}
    </div>
  );
}

function CertificateForm({ certificate, language, onSave, onCancel }) {
  const [form, setForm] = useState(certificate || {
    title: { en: '', ar: '' }, issuer: '', date: '', image: '', link: '', featured: false,
  });

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="admin-form glass-card" onClick={e => e.stopPropagation()}>
        <div className="admin-form-header">
          <h3>{certificate ? (language === 'en' ? 'Edit Certificate' : 'تعديل الشهادة') : (language === 'en' ? 'Add Certificate' : 'إضافة شهادة')}</h3>
          <button onClick={onCancel} className="modal-close"><FaTimes /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="admin-form-body">
          <div className="form-row">
            <div className="form-group"><label>Title (EN)</label><input type="text" value={form.title.en} onChange={e => setForm(prev => ({ ...prev, title: { ...prev.title, en: e.target.value } }))} className="form-input" required /></div>
            <div className="form-group"><label>Title (AR)</label><input type="text" value={form.title.ar} onChange={e => setForm(prev => ({ ...prev, title: { ...prev.title, ar: e.target.value } }))} className="form-input" required /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>{language === 'en' ? 'Issuer' : 'الجهة'}</label><input type="text" value={form.issuer} onChange={e => setForm(prev => ({ ...prev, issuer: e.target.value }))} className="form-input" required /></div>
            <div className="form-group"><label>{language === 'en' ? 'Date' : 'التاريخ'}</label><input type="text" value={form.date} onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))} className="form-input" placeholder="2023-06" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Image URL</label><input type="text" value={form.image} onChange={e => setForm(prev => ({ ...prev, image: e.target.value }))} className="form-input" /></div>
            <div className="form-group"><label>{language === 'en' ? 'Link' : 'الرابط'}</label><input type="text" value={form.link} onChange={e => setForm(prev => ({ ...prev, link: e.target.value }))} className="form-input" /></div>
          </div>
          <div className="form-row">
            <div className="form-group checkbox-group"><label><input type="checkbox" checked={form.featured} onChange={e => setForm(prev => ({ ...prev, featured: e.target.checked }))} /> Featured</label></div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary"><FaSave /> {t('admin.save', language)}</button>
            <button type="button" onClick={onCancel} className="btn btn-outline"><FaTimes /> {t('admin.cancel', language)}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- Services Manager ---------- */
function ServicesManager({ language }) {
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  useEffect(() => { setData(getServices()); }, []);

  const handleSave = (item) => {
    let updated;
    if (editing) {
      updated = data.map(s => s.id === item.id ? item : s);
    } else {
      updated = [...data, { ...item, id: Date.now() }];
    }
    setData(updated);
    saveServices(updated);
    setEditing(null);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm(t('admin.confirm_delete', language))) return;
    const updated = data.filter(s => s.id !== id);
    setData(updated);
    saveServices(updated);
  };

  return (
    <div>
      <div className="admin-toolbar">
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn btn-primary"><FaPlus /> {language === 'en' ? 'Add Service' : 'إضافة خدمة'}</button>
      </div>
      <div className="admin-table-wrapper glass-card">
        <table className="admin-table">
          <thead><tr><th>ID</th><th>{language === 'en' ? 'Title (EN)' : 'العنوان (EN)'}</th><th>{language === 'en' ? 'Actions' : 'الإجراءات'}</th></tr></thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td>#{item.id}</td>
                <td>{item.title.en}</td>
                <td className="actions-cell">
                  <button onClick={() => { setEditing(item); setShowForm(true); }} className="action-btn edit"><FaEdit /></button>
                  <button onClick={() => handleDelete(item.id)} className="action-btn delete"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && <ServiceForm service={editing} language={language} onSave={handleSave} onCancel={() => { setEditing(null); setShowForm(false); }} />}
    </div>
  );
}

function ServiceForm({ service, language, onSave, onCancel }) {
  const [form, setForm] = useState(service || {
    title: { en: '', ar: '' }, description: { en: '', ar: '' },
    icon: 'FaMicrochip', features: [],
  });
  const [featInput, setFeatInput] = useState('');

  const addFeat = () => {
    if (featInput.trim()) {
      setForm(prev => ({ ...prev, features: [...prev.features, { en: featInput.trim(), ar: featInput.trim() }] }));
      setFeatInput('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="admin-form glass-card" onClick={e => e.stopPropagation()}>
        <div className="admin-form-header">
          <h3>{service ? (language === 'en' ? 'Edit Service' : 'تعديل الخدمة') : (language === 'en' ? 'Add Service' : 'إضافة خدمة')}</h3>
          <button onClick={onCancel} className="modal-close"><FaTimes /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="admin-form-body">
          <div className="form-row">
            <div className="form-group"><label>Title (EN)</label><input type="text" value={form.title.en} onChange={e => setForm(prev => ({ ...prev, title: { ...prev.title, en: e.target.value } }))} className="form-input" required /></div>
            <div className="form-group"><label>Title (AR)</label><input type="text" value={form.title.ar} onChange={e => setForm(prev => ({ ...prev, title: { ...prev.title, ar: e.target.value } }))} className="form-input" required /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Description (EN)</label><textarea value={form.description.en} onChange={e => setForm(prev => ({ ...prev, description: { ...prev.description, en: e.target.value } }))} className="form-input form-textarea" rows={2} /></div>
            <div className="form-group"><label>Description (AR)</label><textarea value={form.description.ar} onChange={e => setForm(prev => ({ ...prev, description: { ...prev.description, ar: e.target.value } }))} className="form-input form-textarea" rows={2} /></div>
          </div>
          <div className="form-group">
            <label>{language === 'en' ? 'Features' : 'المميزات'}</label>
            <div className="tech-input-group">
              <input type="text" value={featInput} onChange={e => setFeatInput(e.target.value)} className="form-input" placeholder="Add feature..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeat())} />
              <button type="button" onClick={addFeat} className="btn btn-primary" style={{ padding: '10px 16px' }}>+</button>
            </div>
            <div className="tech-list">
              {form.features.map((f, i) => (
                <span key={i} className="tech-tag">{f.en}<button type="button" onClick={() => setForm(prev => ({ ...prev, features: prev.features.filter((_, idx) => idx !== i) }))} className="tech-remove">&times;</button></span>
              ))}
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary"><FaSave /> {t('admin.save', language)}</button>
            <button type="button" onClick={onCancel} className="btn btn-outline"><FaTimes /> {t('admin.cancel', language)}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- Personal Info Manager ---------- */
function PersonalInfoManager({ language }) {
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => { setForm(getPersonalInfo()); }, []);

  if (!form) return null;

  const handleSave = () => {
    savePersonalInfo(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="glass-card" style={{ padding: '30px' }}>
      <h3 style={{ marginBottom: '20px', color: 'var(--primary)' }}>{language === 'en' ? 'Personal Information' : 'المعلومات الشخصية'}</h3>
      <div className="admin-form-body">
        <div className="form-row">
          <div className="form-group"><label>{language === 'en' ? 'Name' : 'الاسم'}</label><input type="text" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} className="form-input" /></div>
          <div className="form-group"><label>{language === 'en' ? 'Title' : 'المسمى'}</label><input type="text" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} className="form-input" /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Email</label><input type="text" value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} className="form-input" /></div>
          <div className="form-group"><label>{language === 'en' ? 'Phone' : 'الهاتف'}</label><input type="text" value={form.phone} onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))} className="form-input" /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>{language === 'en' ? 'Location' : 'الموقع'}</label><input type="text" value={form.location} onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))} className="form-input" /></div>
          <div className="form-group"><label>Avatar URL</label><input type="text" value={form.avatar} onChange={e => setForm(prev => ({ ...prev, avatar: e.target.value }))} className="form-input" /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Bio (EN)</label><textarea value={form.bio.en} onChange={e => setForm(prev => ({ ...prev, bio: { ...prev.bio, en: e.target.value } }))} className="form-input form-textarea" rows={3} /></div>
          <div className="form-group"><label>Bio (AR)</label><textarea value={form.bio.ar} onChange={e => setForm(prev => ({ ...prev, bio: { ...prev.bio, ar: e.target.value } }))} className="form-input form-textarea" rows={3} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>CV URL</label><input type="text" value={form.cvUrl} onChange={e => setForm(prev => ({ ...prev, cvUrl: e.target.value }))} className="form-input" /></div>
          <div className="form-group"><label>{language === 'en' ? 'Years Exp.' : 'سنوات الخبرة'}</label><input type="text" value={form.yearsExperience} onChange={e => setForm(prev => ({ ...prev, yearsExperience: parseInt(e.target.value) || 0 }))} className="form-input" /></div>
        </div>
        <div className="form-actions">
          <button onClick={handleSave} className="btn btn-primary"><FaSave /> {language === 'en' ? (saved ? 'Saved!' : 'Save') : (saved ? 'تم الحفظ!' : 'حفظ')}</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Settings Panel ---------- */
function SettingsPanel({ language }) {
  const [token, setToken] = useState('');
  const [configured, setConfigured] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState(null);

  useEffect(() => {
    const hasToken = isGitHubConfigured();
    setConfigured(hasToken);
    if (!hasToken) {
      const saved = localStorage.getItem('github_token_input') || '';
      setToken(saved);
    }
  }, []);

  const saveToken = () => {
    if (!token.trim()) return;
    setGitHubToken(token.trim());
    localStorage.setItem('github_token_input', token.trim());
    setConfigured(true);
  };

  const handlePublish = async () => {
    setPublishing(true);
    setPublishResult(null);
    try {
      const data = getAllDataForPublish();
      const results = await publishAllData(data);

      const localImages = getAllLocalImages();
      for (const [filename, entry] of Object.entries(localImages)) {
        try {
          await commitImage(`public/assets/images/${filename}`, entry.data, `Upload image ${filename} via admin`);
          results.push({ path: `public/assets/images/${filename}`, success: true });
        } catch (err) {
          results.push({ path: `public/assets/images/${filename}`, success: false, error: err.message });
        }
      }

      setPublishResult(results);
    } catch (err) {
      setPublishResult([{ path: 'error', success: false, error: err.message }]);
    }
    setPublishing(false);
  };

  return (
    <div className="admin-settings">
      <div className="glass-card" style={{ padding: '30px', marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '20px', color: 'var(--primary)' }}>
          <FaGitAlt /> {language === 'en' ? 'GitHub Integration' : 'التكامل مع GitHub'}
        </h3>

        {!configured ? (
          <div className="admin-form-body">
            <p style={{ color: 'var(--text-muted)', marginBottom: '15px' }}>
              {language === 'en'
                ? 'Enter a GitHub Personal Access Token (classic) with repo scope to enable publishing.'
                : 'أدخل رمز الوصول الشخصي من GitHub (classic) مع صلاحية repo لنشر التغييرات.'}
            </p>
            <div className="form-group">
              <input
                type="password"
                value={token}
                onChange={e => setToken(e.target.value)}
                className="form-input"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              />
            </div>
            <button onClick={saveToken} className="btn btn-primary">
              <FaCheck /> {language === 'en' ? 'Save Token' : 'حفظ الرمز'}
            </button>
          </div>
        ) : (
          <div className="admin-form-body">
            <p style={{ color: 'var(--success)', marginBottom: '15px' }}>
              <FaCheck /> {language === 'en' ? 'GitHub is connected' : 'GitHub متصل'}
            </p>
            <div className="form-actions">
              <button onClick={handlePublish} className="btn btn-primary" disabled={publishing}>
                {publishing ? <FaSpinner className="spin" /> : <FaGitAlt />}
                {' '}{publishing
                  ? (language === 'en' ? 'Publishing...' : 'جاري النشر...')
                  : (language === 'en' ? 'Publish All to GitHub' : 'نشر الكل إلى GitHub')}
              </button>
              <button onClick={() => { clearGitHubToken(); setConfigured(false); setToken(''); }} className="btn btn-outline">
                <FaTimes /> {language === 'en' ? 'Disconnect' : 'فصل'}
              </button>
            </div>
          </div>
        )}
      </div>

      {publishResult && (
        <div className="glass-card" style={{ padding: '20px' }}>
          <h4 style={{ marginBottom: '15px' }}>{language === 'en' ? 'Publish Results' : 'نتائج النشر'}</h4>
          {publishResult.map((r, i) => (
            <div key={i} className="admin-list-item" style={{ color: r.success ? 'var(--success)' : '#ff4444' }}>
              <span>{r.success ? <FaCheck /> : <FaTimes />} {r.path}</span>
              <small>{r.success ? (language === 'en' ? 'Done' : 'تم') : r.error}</small>
            </div>
          ))}
        </div>
      )}

      <div className="glass-card" style={{ padding: '30px', marginTop: '20px' }}>
        <h3 style={{ marginBottom: '20px', color: 'var(--primary)' }}>
          <FaImage /> {language === 'en' ? 'Image Uploader' : 'رفع الصور'}
        </h3>
        <ImageUploader language={language} onUpload={(url) => {
          navigator.clipboard.writeText(url).catch(() => {});
          alert(language === 'en' ? `Uploaded: ${url}\nCopied to clipboard!` : `تم الرفع: ${url}\nتم النسخ!`);
        }} />
      </div>
    </div>
  );
}

/* ---------- Image Uploader Component ---------- */
function ImageUploader({ language, onUpload }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const base64 = reader.result.split(',')[1];
        const ext = file.name.split('.').pop();
        const filename = `${Date.now()}.${ext}`;

        saveImageLocally(filename, base64);
        const url = `/assets/images/${filename}`;

        if (isGitHubConfigured()) {
          const path = `public/assets/images/${filename}`;
          commitImage(path, base64, `Upload image ${file.name} via admin`).catch(() => {});
        }

        onUpload(url);
      } catch (err) {
        alert(language === 'en' ? `Upload failed: ${err.message}` : `فشل الرفع: ${err.message}`);
      }
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    };

    reader.onerror = () => {
      alert(language === 'en' ? 'Failed to read file' : 'فشل قراءة الملف');
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div style={{ marginTop: '8px' }}>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        style={{ display: 'none' }}
        id="image-upload-input"
      />
      <label htmlFor="image-upload-input" className="btn btn-outline" style={{ cursor: 'pointer', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        {uploading ? <FaSpinner className="spin" /> : <FaUpload />}
        {' '}{uploading
          ? (language === 'en' ? 'Loading...' : 'جاري التحميل...')
          : (language === 'en' ? 'Upload Image' : 'رفع صورة')}
      </label>
      <small style={{ display: 'block', color: 'var(--text-muted)', marginTop: '4px' }}>
        {language === 'en' ? 'Image saved locally instantly. Publish to GitHub to make it permanent.' : 'الصورة محفوظة محلياً فوراً. انشر إلى GitHub لجعلها دائمة.'}
      </small>
    </div>
  );
}
