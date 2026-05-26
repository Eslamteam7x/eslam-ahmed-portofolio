const IMAGE_CACHE_KEY = 'admin_image_cache';

function getCache() {
  try {
    return JSON.parse(localStorage.getItem(IMAGE_CACHE_KEY) || '{}');
  } catch {
    return {};
  }
}

function setCache(cache) {
  try {
    localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn('Image cache full, clearing old entries...');
    localStorage.removeItem(IMAGE_CACHE_KEY);
  }
}

export function saveImageLocally(filename, base64Data) {
  const cache = getCache();
  cache[filename] = { data: base64Data, timestamp: Date.now() };
  setCache(cache);
  return `/assets/images/${filename}`;
}

export function getLocalImage(filename) {
  const cache = getCache();
  const entry = cache[filename];
  if (entry) {
    const ext = filename.split('.').pop();
    const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
    return `data:${mime};base64,${entry.data}`;
  }
  return null;
}

export function getImageSrc(originalPath) {
  const filename = originalPath.split('/').pop();
  const local = getLocalImage(filename);
  return local || originalPath;
}

export function getAllLocalImages() {
  return getCache();
}

export function clearLocalImages() {
  localStorage.removeItem(IMAGE_CACHE_KEY);
}

const FAVICON_KEY = 'admin_favicon';

export function saveFavicon(base64Data) {
  localStorage.setItem(FAVICON_KEY, base64Data);
  const link = document.querySelector('link[rel="icon"]');
  if (link) {
    link.href = `data:image/x-icon;base64,${base64Data}`;
  }
}

export function getFavicon() {
  return localStorage.getItem(FAVICON_KEY) || null;
}

export function applyFavicon() {
  const data = getFavicon();
  if (data) {
    const link = document.querySelector('link[rel="icon"]');
    if (link) {
      link.href = `data:image/x-icon;base64,${data}`;
    }
  }
}

export function resetFavicon() {
  localStorage.removeItem(FAVICON_KEY);
  const link = document.querySelector('link[rel="icon"]');
  if (link) {
    link.href = '/favicon.svg';
  }
}
