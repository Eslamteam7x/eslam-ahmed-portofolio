import staticProjects from '../data/projects.json';
import staticSkills from '../data/skills.json';
import staticExperience from '../data/experience.json';
import staticCertificates from '../data/certificates.json';
import staticServices from '../data/services.json';
import staticPersonalInfo from '../data/personal_info.json';

const KEYS = {
  projects: 'admin_projects',
  skills: 'admin_skills',
  experience: 'admin_experience',
  certificates: 'admin_certificates',
  services: 'admin_services',
  personalInfo: 'admin_personal_info',
};

function getLocal(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function getProjects() {
  return getLocal(KEYS.projects, staticProjects);
}
export function saveProjects(data) { setLocal(KEYS.projects, data); }

export function getSkills() {
  return getLocal(KEYS.skills, staticSkills);
}
export function saveSkills(data) { setLocal(KEYS.skills, data); }

export function getExperience() {
  return getLocal(KEYS.experience, staticExperience);
}
export function saveExperience(data) { setLocal(KEYS.experience, data); }

export function getCertificates() {
  return getLocal(KEYS.certificates, staticCertificates);
}
export function saveCertificates(data) { setLocal(KEYS.certificates, data); }

export function getServices() {
  return getLocal(KEYS.services, staticServices);
}
export function saveServices(data) { setLocal(KEYS.services, data); }

export function getPersonalInfo() {
  return getLocal(KEYS.personalInfo, staticPersonalInfo);
}
export function savePersonalInfo(data) { setLocal(KEYS.personalInfo, data); }

export function getAllDataForPublish() {
  return {
    'src/data/projects.json': JSON.stringify(getProjects(), null, 2),
    'src/data/skills.json': JSON.stringify(getSkills(), null, 2),
    'src/data/experience.json': JSON.stringify(getExperience(), null, 2),
    'src/data/certificates.json': JSON.stringify(getCertificates(), null, 2),
    'src/data/services.json': JSON.stringify(getServices(), null, 2),
    'src/data/personal_info.json': JSON.stringify(getPersonalInfo(), null, 2),
  };
}

export function clearAdminData() {
  Object.values(KEYS).forEach(key => localStorage.removeItem(key));
}
