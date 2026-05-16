import data from '../data/translations.json';

export function t(key, lang) {
  const keys = key.split('.');
  let value = data;
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key;
    }
  }
  if (value && typeof value === 'object' && lang in value) {
    return value[lang];
  }
  return key;
}

export function formatDate(dateStr, lang) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const options = { year: 'numeric', month: 'short' };
  return date.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', options);
}

export function getPeriodText(start, end, lang) {
  const startDate = formatDate(start, lang);
  const endDate = end === 'present'
    ? (lang === 'ar' ? 'حتى الآن' : 'Present')
    : formatDate(end, lang);
  return `${startDate} - ${endDate}`;
}
