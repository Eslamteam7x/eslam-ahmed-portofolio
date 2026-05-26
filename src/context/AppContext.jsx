import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { applyThemeOverrides } from '../utils/themeService';
import { applyFavicon } from '../utils/imageService';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('lang') || 'en';
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshSite = useCallback(() => setRefreshKey(k => k + 1), []);

  useEffect(() => {
    localStorage.setItem('lang', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    applyThemeOverrides();
  }, [theme]);

  useEffect(() => {
    applyFavicon();
    setTimeout(() => setLoading(false), 2000);
  }, []);

  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <AppContext.Provider value={{
      language, setLanguage, toggleLanguage,
      theme, setTheme, toggleTheme,
      isAdmin, setIsAdmin,
      adminUser, setAdminUser,
      loading, setLoading,
      refreshKey, refreshSite,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
