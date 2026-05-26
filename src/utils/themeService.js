const THEME_KEY = 'admin_theme_overrides';

const DEFAULT_COLORS = {
  '--primary': '#00f0ff',
  '--primary-dark': '#0099cc',
  '--secondary': '#ff00ff',
  '--accent': '#ff6600',
  '--bg-primary': '#0a0a1a',
  '--text-primary': '#ffffff',
  '--text-secondary': '#b0b0c8',
};

const LIGHT_COLORS = {
  '--primary': '#0088cc',
  '--primary-dark': '#006699',
  '--secondary': '#cc00cc',
  '--accent': '#ff5500',
  '--bg-primary': '#f0f4ff',
  '--text-primary': '#1a1a2e',
  '--text-secondary': '#4a4a6a',
};

export function getThemeOverrides() {
  try {
    return JSON.parse(localStorage.getItem(THEME_KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveThemeOverride(variable, value) {
  const overrides = getThemeOverrides();
  overrides[variable] = value;
  localStorage.setItem(THEME_KEY, JSON.stringify(overrides));
  document.documentElement.style.setProperty(variable, value);
}

export function resetThemeOverrides() {
  localStorage.removeItem(THEME_KEY);
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const defaults = isLight ? LIGHT_COLORS : DEFAULT_COLORS;
  Object.entries(defaults).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, '');
  });
}

export function applyThemeOverrides() {
  const overrides = getThemeOverrides();
  Object.entries(overrides).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
}

export function getThemePreviews() {
  return {
    dark: DEFAULT_COLORS,
    light: LIGHT_COLORS,
  };
}
